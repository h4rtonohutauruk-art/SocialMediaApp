"use server";

import { prisma } from "@/lib/prisma";
import { getDBUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export const createPost = async (content: string, image: string) => {
  try {
    const userId = await getDBUserId();

    if (!userId) return;

    const post = prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });
    revalidatePath("/"); //purge the cache for the homepage
    return {
      success: true,
      post,
    };
  } catch (error) {
    console.error("Failed to create post:", error);
    return {
      success: false,
      error: "Failed to create post",
    };
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log("this is errorsdsd", error);
    return [];
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const userId = await getDBUserId();

    if (!userId) return;

    // check if like exist
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  userId: post.authorId, //recipient (post author)
                  type: "LIKE",
                  creatorId: userId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
  } catch (error) {
    console.log("Error in toggleLike controller", error);
  }
};

export const addComment = async (postId: string, content: string) => {
  try {
    const userId = await getDBUserId();
    if (!userId) return;

    if (!content) throw new Error("Content is required");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        // authorId: userId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId: post.id,
        },
      });

      // create notification if commenting on someone else's post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }
      return newComment;
    });
    // revalidatePath(`/post/${postId}`);
    revalidatePath("/");
    return {
      success: true,
      comment,
    };
  } catch (error) {
    console.log("Error in addComment", error);
    return {
      success: false,
      error: "Failed to create comment",
    };
  }
};

export const deletePost = async (postId: string) => {
  try {
    const userId = await getDBUserId();
    if (!userId) return;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("Unauthorized - No delete permission");

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    console.log("Error in deletePost:", error);
    return {
      success: false,
      error: "Error in delete Post",
    };
  }
};
