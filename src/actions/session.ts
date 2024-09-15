"use server";
import { authOptions } from "@/lib/auth-options";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { createChatSession } from "./chat";
import { signIn } from "next-auth/react";

export const createNewSession = async (name: string) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const chatsession = await createChatSession();

  if (!session) return signIn();

  try {
    if (!userId) return;
    return await db.chatsession.create({
      data: {
        name,
        userId,
        chatsession,
      },
    });
  } catch (error) {}
};

export const getAllSessions = async () => {
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  if (!session) return signIn();

  try {
    if (!id) return;
    return await db.chatsession.findMany({
      where: {
        userId: id,
      },
    });
  } catch (error) {}
};
