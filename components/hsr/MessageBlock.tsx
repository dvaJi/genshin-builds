import { memo } from "react";

import { getHsrUrl } from "@lib/imgUrl";
import type { Message } from "hsr-data/dist/types/messages";

function MessageBlock({ message }: { message: Message }) {
  return (
    <div className="flex flex-row gap-4" key={message.id}>
      <img
        loading="eager"
        src={getHsrUrl(
          `/avatar/round/${message.senderContactId || "8002"}.png`
        )}
        alt={message.sender}
        className="h-14 w-14 rounded-full object-contain"
      />
      <div className="flex flex-col gap-1">
        <span className="font-bold text-gray-200">{message.sender}</span>
        <div className="rounded-md bg-hsr-surface3 bg-opacity-80 px-4 py-2 font-semibold">
          {message.type === "Text" ? <span>{message.text}</span> : null}
          {message.type === "Image" || message.type === "Sticker" ? (
            <img
              loading="eager"
              src={getHsrUrl(`/pic/${message.image}.png`)}
              alt={message.text}
              className="w-2/3"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default memo(MessageBlock);
