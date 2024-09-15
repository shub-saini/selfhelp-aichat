"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewSession } from "@/actions/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Atleast write a name" }).max(50),
});

function NewSession({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    newSession.mutate(values.name);
  }

  const newSession = useMutation({
    mutationFn: (name: string) => {
      return createNewSession(name);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setIsOpen(false);
      router.push(`/chat/${data?.id}`);
    },
  });

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          {newSession.isPending ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-4">
                  Name your your chat session
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                autoFocus
                                placeholder="Session Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-x-4">
                        <Button type="submit">Create</Button>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          variant={"outline"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default NewSession;
