interface NoticeProps {
  type: "success" | "error";
  message: string;
}

export function Notice({ type, message }: NoticeProps) {
  if (!message) return null;
  return (
    <div
      role="status"
      className={`rounded-lg px-4 py-2 text-sm mb-4 ${
        type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
      }`}
    >
      {message}
    </div>
  );
}
