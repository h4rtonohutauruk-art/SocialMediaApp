"use client";
import {
  addComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import DeleteAlertDialog from "./DeleteAlertDialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostCard = ({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) => {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId),
  );
  const [optimisticLikes, SetOptimisticLikes] = useState(post._count.likes);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComment, setShowComment] = useState(false);

  // console.log("this post and comment and like ", post);
  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      SetOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      SetOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
      console.log("Error in handleLike controller", error);
    } finally {
      setIsLiking(false);
    }
  };
  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await addComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };
  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result?.success) {
        toast.success("Post deleted successfully");
      } else throw new Error(result?.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className=" overflow-hidden">
      <CardContent className=" p-4 sm:p-6">
        <div className=" space-y-4">
          <div className=" flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className=" size-8 sm:w-10 sm:h-10">
                <AvatarImage
                  src={post.author.image ?? "/avatar.png"}
                ></AvatarImage>
              </Avatar>
            </Link>
            {/* POST HEADER && TEXT CONTENT */}
            <div className=" flex-1 min-w-0">
              <div className=" flex items-start justify-between">
                <div className=" flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className=" font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>
                  <div className=" flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>
                      {/* @{post.author.username} */}
                    </Link>
                    <span></span>
                    <span className="-ml-3">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                {/* Check if current user is the post author */}
                {dbUserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>
              <p className=" mt-2 text-sm text-foreground wrap-break-word">
                {post.content}
              </p>
            </div>
          </div>
          {/* POST IMAGE */}
          {post.image && (
            <div className=" rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt="Post Content"
                width={500}
                height={400}
                className=" w-full h-auto object-cover"
              />
            </div>
          )}
          {/* LIKE & COMMENT BUTTONS */}
          <div className=" flex items-center pt-2 space-x-4">
            {user ? (
              <Button
                variant={"ghost"}
                size={"sm"}
                className={`text-muted-foreground gap-2 ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                {hasLiked ? (
                  <HeartIcon className=" size-5 fill-current" />
                ) : (
                  <HeartIcon className=" size-5" />
                )}
                <span>{optimisticLikes}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className=" text-muted-foreground gap-2"
                >
                  <HeartIcon className=" size-5" />
                  <span>{optimisticLikes}</span>
                </Button>
              </SignInButton>
            )}
            <Button
              variant={"ghost"}
              size={"sm"}
              className=" text-muted-foreground gap-2 hover:text-blue-500"
              onClick={() => setShowComment((prev) => !prev)}
            >
              <MessageCircleIcon
                className={`size-5 ${showComment ? "fill-blue-500 text-blue-500" : ""}`}
              />
              <span>{post.comments.length}</span>
            </Button>
          </div>

          {/* COMMENT SECTION */}
          {showComment && (
            <div className=" space-y-4 pt-4 border-t">
              {/* Display comment */}
              {post.comments.map((comment) => (
                <div key={comment.id} className=" flex space-x-3">
                  <Avatar className=" size-8 shrink-0">
                    <AvatarImage
                      src={comment.author.image ?? "/avatar.png"}
                    ></AvatarImage>
                  </Avatar>
                  <div className=" flex-1 min-w-0">
                    <div className=" flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className=" font-medium text-sm">
                        {comment.author.name}
                      </span>
                      <span className=" text-muted-foreground text-sm">
                        {/* @{comment.author.username} */}
                      </span>
                      <span className=" text-sm text-muted-foreground"></span>
                      <span className=" -ml-3 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                    </div>
                    <p className=" text-sm wrap-break-word">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {user ? (
            <div className=" flex space-x-3">
              <Avatar className=" size-8 shrink-0">
                <AvatarImage
                  src={user?.imageUrl || "/avatar.png"}
                ></AvatarImage>
              </Avatar>
              <div className=" flex-1">
                <Textarea
                  placeholder="Write a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className=" min-h-[80px] resize-none"
                />
                <div className=" flex justify-end mt-2">
                  <Button
                    className=" flex items-center gap-2"
                    size={"sm"}
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isCommenting}
                  >
                    {isCommenting ? (
                      "Posting..."
                    ) : (
                      <>
                        <SendIcon className=" size-4" />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
