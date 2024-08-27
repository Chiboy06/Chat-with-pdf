"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { BotIcon, Clipboard, Loader2Icon } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "./Chat";
import { toast } from "./ui/use-toast";

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  const onCopy = () => {
    navigator.clipboard.writeText(message.message);
    toast({
      variant: "default",
      description: 'Message copied to clipboard',
    });
  }

  return (
    <div className={`chat ${isHuman ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {isHuman ? (
            user?.imageUrl && (
              <Image
                src={user?.imageUrl}
                alt="Profile Picture"
                width={40}
                height={40}
                className="rounded-full"
              />
            )
          ) : (
            <div className="h-10 w-10 bg-indigo-600 flex items-center overflow-x-auto-auto justify-center">
              <BotIcon className="text-white h-7 w-7 " />
            </div>
          )}
        </div>
      </div>

      <div
        className={`chat-bubble prose ${isHuman && "bg-indigo-600 text-white overflow-x-auto"}`}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin h-5 w-5 text-white" />
          </div>
        ) : (
            <div>
              <div className="mb-3 bg-transparent py-4 cursor-pointer px-2 flex items-end">
                <Clipboard size={20} onClick={onCopy}/>
              </div>
              <Markdown className="overflow-x-auto">
                {message.message}
              </Markdown>
            </div>
        )}
      </div>
    </div>
  );
}
export default ChatMessage;