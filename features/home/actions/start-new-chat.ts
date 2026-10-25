"use server";

import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";

export async function startNewChat() {
  const user = await requireUser();

  const existingEmpty = await prisma.conversation.findFirst({
    where: {
      userId: user.id,
      messages: {
        none: {},
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingEmpty) {
    return existingEmpty.id;
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: "New Chat",
    },
  });

  return conversation.id;
}
