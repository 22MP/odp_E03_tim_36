// client/src/components/messages/MessageItem.tsx
import React from "react";
import type { MessageDTO } from "../../models/messages/MessageDTO";

interface MessageItemProps {
  message: MessageDTO;
  isOwnMessage: boolean;
}

/**
 * Pomocna: sigurno formatiranje ISO stringa → labela za prikaz.
 * Ako iz bilo kog razloga stigne nevalidan datum, vraca "—" umesto "Invalid Date".
 */
function formatTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  // samo sat:min (kompaktno u balončiću)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage }) => {
  const timeLabel = formatTime(message.vrijemeSlanja);
  const seen = isOwnMessage && message.stanje === "read";

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
        {/* Avatar inicijal – ostavio sam tvoj 'Y'/'T' placeholder */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white flex-shrink-0">
          {isOwnMessage ? "Y" : "T"}
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

          {/* Vreme slanja (sigurno formatirano) */}
          <div className="text-xs text-gray-400 mt-1">{timeLabel}</div>

          {/* Seen badge – samo za sopstvene poruke i samo kada je stanje 'read' */}
          {seen && (
            <div className="absolute text-[10px] bottom-0 right-0 -mb-5 mr-2 text-gray-500 select-none">
              Seen
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
