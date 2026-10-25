import { startNewChat } from "@/features/home/actions/start-new-chat";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const conversationId = await startNewChat();
  redirect(`/c/${conversationId}`);
}
