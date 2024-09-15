"use server";
import { authOptions } from "@/lib/auth-options";
import db from "@/lib/db";
import { ChatType } from "@prisma/client";
import axios from "axios";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";

const externalUserId =
  Date.now().toString() + Math.random().toString(36).substring(2, 15);

export const getChatSessionId = async (id: string) => {
  const session = getServerSession(authOptions);
  if (!session) return signIn();
  try {
    return await db.chatsession.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {}
};

export async function createChatSession() {
  const session = getServerSession(authOptions);
  if (!session) return signIn();

  const url = "https://api.on-demand.io/chat/v1/sessions";
  const headers = {
    apikey: process.env.ONDEMAND_KEY,
    "Content-Type": "application/json",
  };
  const body = {
    pluginIds: ["plugin-1726241745", "plugin-1717503940"],
    externalUserId: externalUserId,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.data.id; // Extract session ID
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }
}

export async function submitQuery(sessionId: string, query: string) {
  const session = await getServerSession(authOptions);
  if (!session) return signIn();

  const chatsession = await getChatSessionId(sessionId);
  const chatId = await chatsession?.chatsession;

  const url = `https://api.on-demand.io/chat/v1/sessions/${chatId}/query`;
  const headers = {
    apikey: process.env.ONDEMAND_KEY,
    "Content-Type": "application/json",
  };
  const body = {
    endpointId: "predefined-openai-gpt4o",
    query: query,
    pluginIds: ["plugin-1726241745", "plugin-1717503940"],
    responseMode: "sync",
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error("Error submitting query:", error);
    throw error;
  }
}

export const addQuestionToDb = async (sessionId: string, query: string) => {
  const session = getServerSession(authOptions);
  if (!session) return signIn();

  try {
    await db.chat.create({
      data: {
        text: query,
        sessionId,
        type: ChatType.QUESTION,
      },
    });
  } catch (error) {}
};

export const addAnswerToDb = async (sessionId: string, answer: string) => {
  const session = getServerSession(authOptions);
  if (!session) return signIn();

  try {
    await db.chat.create({
      data: {
        text: answer,
        sessionId,
        type: ChatType.ANSWER,
      },
    });
  } catch (error) {}
};

export const getChatsBySessionId = async (sessionId: string) => {
  const session = getServerSession(authOptions);
  if (!session) return signIn();

  try {
    return await db.chat.findMany({
      where: {
        sessionId,
      },
    });
  } catch (error) {}
};
