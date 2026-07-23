/* A single generic "communication" glyph for WhatsApp actions. Deliberately
   not the trademarked WhatsApp logo — the brief asks for a white
   communication icon, and this avoids reproducing a brand mark. */
export function ChatGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-8.7 15l-1.2 4.2a.8.8 0 0 0 1 1l4.3-1.2A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4 14.9.9.9 0 0 0-.7-.1l-2.7.8.8-2.6a.9.9 0 0 0-.1-.8A8 8 0 0 1 12 4Zm-2.3 3.6c-.2 0-.5 0-.7.4-.3.4-.9 1-.9 2.3 0 1.4 1 2.7 1.1 2.9.2.2 2 3 4.8 4.1 2.4.9 2.8.7 3.3.7.5-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.1-1.3l-.6-.3s-1.4-.7-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.7-.2-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.7Z" />
    </svg>
  );
}
