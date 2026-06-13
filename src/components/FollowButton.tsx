"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import {
  getInfoUserById,
  getUserByClerkId,
  toggleFollow,
} from "@/actions/user.action";

const FollowButton = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      await toggleFollow(userId);
      const userFollow = await getInfoUserById(userId);
      console.log("this is user", userFollow);
      toast.success(`You followed this user ${userFollow?.user?.username}`);
    } catch (error) {
      console.log("Error following user", error);
      toast.error("Error following user");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant={"secondary"}
      size={"sm"}
      onClick={handleFollow}
      disabled={isLoading}
      className=" w-20"
    >
      {isLoading ? <Loader2Icon className=" size-4 animate-spin" /> : "Follow"}
    </Button>
  );
};

export default FollowButton;
