import React from "react";

type Props = {
  count?: number;
  className?: string;
  max?: number;           // 99 po difoltu
};

const UnreadMessagesIndicator: React.FC<Props> = ({ count = 0, className = "", max = 99 }) => {
  if (!count || count <= 0) return null;
  const text = count > max ? `${max}+` : String(count);

  return (
    <span
      className={
        "inline-flex items-center justify-center " +
        "min-w-4 h-4 px-[3px] text-[10px] font-semibold rounded-full " +
        "bg-red-500 text-white shadow " +
        className
      }
      aria-label={`${count} nepročitanih poruka`}
    >
      {text}
    </span>
  );
};

export default UnreadMessagesIndicator;
