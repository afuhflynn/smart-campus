"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    router.push(`/schools?q=${input}`);
  };
  return (
    <form
      className="relative flex items-center bg-background rounded-xl border p-2 shadow-2xl"
      onSubmit={handleSubmitSearch}
    >
      <Search className="ml-3 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Search schools, programs, or cities..."
        required
        className="border-0 focus-visible:ring-0 text-lg h-12"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button size="lg" className="rounded-lg px-8 font-bold">
        Search
      </Button>
    </form>
  );
};
