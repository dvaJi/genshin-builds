"use client";

import { useState } from "react";

import { Button } from "@app/components/ui/button";
import type { Message } from "@interfaces/hsr";

import MessageBlock from "./MessageBlock";

function Messages({
  isStartingMessage = true,
  startingMessageId,
  messages,
}: {
  isStartingMessage?: boolean;
  startingMessageId: number[];
  messages: Record<string, Message>;
}) {
  const [selectedMessage, setSelectedMessage] = useState(startingMessageId[0]);
  if (startingMessageId.length > 1 && isStartingMessage) {
    return (
      <>
        <div className="flex flex-col gap-1 leading-snug md:flex-row md:gap-6 lg:flex-row lg:gap-6 xl:flex-row xl:gap-6">
          {startingMessageId.map((messageId) => (
            <Button
              key={messageId}
              variant={selectedMessage === messageId ? "default" : "secondary"}
              onClick={() => setSelectedMessage(messageId)}
            >
              {messages[messageId].text}
            </Button>
          ))}
        </div>
        <MessageBlock message={messages[selectedMessage]} />
        {selectedMessage ? (
          <Messages
            isStartingMessage={false}
            startingMessageId={messages[selectedMessage].next}
            messages={messages}
          />
        ) : null}
      </>
    );
  }

  if (startingMessageId.length > 1 && !isStartingMessage) {
    return (
      <>
        <div className="-mx-4 flex flex-col gap-2 bg-muted bg-opacity-50 p-4">
          {startingMessageId.map((messageId) => (
            <button
              key={messageId}
              className={
                selectedMessage === messageId
                  ? "cursor-pointer rounded-md bg-primary bg-opacity-90 px-4 py-1 text-left font-semibold text-accent-foreground"
                  : "mx-4 cursor-pointer rounded-md bg-background bg-opacity-60 px-4 py-1 text-left font-semibold text-card-foreground"
              }
              onClick={() => setSelectedMessage(messageId)}
            >
              {messages[messageId].text}
            </button>
          ))}
        </div>
        <MessageBlock message={messages[selectedMessage]} />
        {selectedMessage ? (
          <Messages
            isStartingMessage={false}
            startingMessageId={messages[selectedMessage].next}
            messages={messages}
          />
        ) : null}
      </>
    );
  }

  if (selectedMessage) {
    const message = messages[selectedMessage];
    return (
      <>
        <MessageBlock message={message} />
        <Messages
          isStartingMessage={false}
          startingMessageId={message.next}
          messages={messages}
        />
      </>
    );
  }

  return null;
}

export default Messages;
