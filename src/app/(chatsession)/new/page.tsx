"use client";
import { getAllSessions } from "@/actions/session";
import NewSession from "@/components/new-session";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useRedirect from "@/hooks/useRedirect";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const router = useRouter();
  useRedirect();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => {
      return getAllSessions();
    },
  });

  const filteredCourses = data?.filter((sessions) => {
    if (sessions.name)
      return sessions.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return isPending ? (
    <div className="flex justify-center items-center w-full h-[calc(100vh-112px)]">
      <Spinner />
    </div>
  ) : (
    <div className="px-14 md:mx-0 w-full">
      <NewSession>
        <Button className="mb-6">Create A New Session</Button>
      </NewSession>
      <Input
        autoFocus
        type="text"
        placeholder="Search session by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 w-full border border-gray-300 rounded-lg"
      />
      <Table className="">
        <TableCaption>A list of your created sessions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Your Sessions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses?.map((item, index) => {
            return (
              <TableRow
                key={index}
                onClick={() => router.push(`/chat/${item.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="">{item.name}</TableCell>
                <TableCell className="text-right">
                  <ChevronRight />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default Page;
