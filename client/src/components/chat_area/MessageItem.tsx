// client/src/components/messages/MessageItem.tsx
import React from "react";
import type { MessageDTO } from "../../models/messages/MessageDTO";

// Font Awesome za dvostruke kvačice
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";

interface MessageItemProps {
  message: MessageDTO;
  isOwnMessage: boolean;
}

function formatDateTime(iso?: string | null) {
  if (!iso) return { date: "—", time: "—" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: "—", time: "—" };

  const date = d.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return { date, time };
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage }) => {
  const { date, time } = formatDateTime(message.vrijemeSlanja);

  const showChecks = isOwnMessage;
  const isRead = message.stanje === "read";

  return (
    <div
      className={`p-3 rounded-lg flex ${
        isOwnMessage ? "justify-end col-start-6 col-end-13" : "justify-start col-span-8"
      }`}
    >
      <div
        className={`flex items-center ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
        style={{ width: "100%" }}
      >
        {/* Avatar placeholder */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white flex-shrink-0">
          {isOwnMessage ? "Y" : "O"}
        </div>

        {/* Balon poruke */}
        <div
          className={`relative ${
            isOwnMessage ? "mr-3 bg-indigo-100 text-gray-900" : "ml-3 bg-white text-gray-900"
          } text-sm py-2 px-4 shadow rounded-xl`}
          style={{ maxWidth: "80%" }}
        >
          {/* Tekst poruke */}
          <div className="whitespace-pre-wrap break-words">{message.tekstPoruke}</div>

          {/* Datum + vreme + dvostruke kvačice */}
          <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
            <span>{date} {time}</span>
            {showChecks && (
              <FontAwesomeIcon
                icon={faCheckDouble}
                className={`ml-2 w-4 h-4 ${
                  isRead ? "text-blue-500" : "text-gray-400"
                }`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
