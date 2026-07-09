"use client";
import { currentUser } from "@clerk/nextjs/server";
import useSWR from "swr";
export interface CurrentUser {
  id: string;
  clerkId: string;
  username: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
}

const fetcher = async (url: string): Promise<CurrentUser | null> => {
  const res = await fetch(url);

  if (!res.ok) {
    return null;
  }
  return res.json();
};

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<CurrentUser | null>(
    "/api/me",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
  return {
    currentUser: data,
    isLoading,
    isError: error,
    mutateCurrentUser: mutate,
  };
}
