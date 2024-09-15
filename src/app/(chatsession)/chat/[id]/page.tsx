import ChatBox from "@/components/chatbox";

async function Page({ params }: { params: { id: string } }) {
  return <ChatBox sessionId={params.id} />;
}

export default Page;
