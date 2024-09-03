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
        className={`chat-bubble prose p-0 ${isHuman && "bg-indigo-600 text-white overflow-x-auto"}`}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin h-5 w-5 text-white" />
          </div>
        ) : (
            <div>
              <div className={`flex justify-between items-center font-semibold ${isHuman ? "bg-indigo-800 p-2 cursor-pointer " : "bg-gray-700 p-2 cursor-pointer text-gray-200"}`}>
                <h1>PDF Genie</h1>
                <Clipboard size={20} onClick={onCopy}/>
              </div>
              <Markdown className="overflow-x-auto px-5">
                {message.message}
              </Markdown>
            </div>
        )}
      </div>
    </div>
  );
}
export default ChatMessage;