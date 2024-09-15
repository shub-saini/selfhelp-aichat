"use client";

import { HeartHandshake } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";

function Appbar() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 flex items-center py-3 px-7 z-50 h-16",
        isLandingPage ? "" : "bg-background border-b"
      )}
    >
      <div className=" flex justify-between items-center w-full">
        <div
          className="flex justify-center items-center text-red-600 gap-x-1 hover:cursor-pointer"
          onClick={() => router.push("/new")}
        >
          <HeartHandshake height={25} width={25} />
          <div className="text-2xl text-extrabold">Heart To Heart</div>
        </div>
        <div className="flex gap-x-2 items-center">
          {!session.data?.user ? (
            <Button
              onClick={() => {
                signIn("github", { callbackUrl: "/new" });
              }}
            >
              SignIn
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Appbar;
