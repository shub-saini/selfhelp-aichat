"use client";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, Form } from "./ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAnswerToDb,
  addQuestionToDb,
  getChatsBySessionId,
  submitQuery,
} from "@/actions/chat";
import { ChatType } from "@prisma/client";
import Spinner from "@/components/spinner";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useRedirect from "@/hooks/useRedirect";

function ChatBox({ sessionId }: { sessionId: string }) {
  useRedirect();
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const session = useSession();

  const formSchema = z.object({
    query: z.string().min(1, { message: "Please write something" }).max(500),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    questionMutation.mutate({ sessionId, query: values.query });
    form.reset();
  }

  const { data, isPending } = useQuery({
    queryKey: ["chats", sessionId],
    queryFn: () => getChatsBySessionId(sessionId),
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [data]);

  const questionMutation = useMutation({
    mutationFn: ({
      sessionId,
      query,
    }: {
      sessionId: string;
      query: string;
    }) => {
      return addQuestionToDb(sessionId, query);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chats", sessionId] });
      answerMutation.mutate({ sessionId, query: variables.query });
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({
      sessionId,
      query,
    }: {
      sessionId: string;
      query: string;
    }) => {
      return submitQuery(sessionId, query);
    },
    onSuccess: (data) => {
      answerToDbMutation.mutate({ sessionId, answer: data.data.answer });
    },
  });

  const answerToDbMutation = useMutation({
    mutationFn: ({
      sessionId,
      answer,
    }: {
      sessionId: string;
      answer: string;
    }) => {
      return addAnswerToDb(sessionId, answer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", sessionId] });
    },
  });

  if (!session.data?.user && isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex-grow overflow-hidden">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            data?.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === ChatType.QUESTION
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`inline-block max-w-[70%] p-3 rounded-lg whitespace-pre-wrap ${
                    message.type === ChatType.QUESTION
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 bg-background">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center w-full gap-x-3"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <div className="relative w-full">
                      <Input
                        autoFocus
                        placeholder="Type your message..."
                        {...field}
                        ref={inputRef}
                        disabled={answerMutation.isPending}
                        className="flex-grow mr-2 p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                      {answerMutation.isPending && (
                        <Loader2
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400"
                          size={20}
                        />
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid || answerMutation.isPending}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatBox;
