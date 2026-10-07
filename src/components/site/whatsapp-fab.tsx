import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export function WhatsAppFab({ whatsapp, message, label }: { whatsapp: string; message: string; label: string }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25D366] pl-4 pr-4 text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:gap-2.5 hover:pr-5"
      aria-label={label}
    >
      <MessageCircle size={24} aria-hidden="true" className="shrink-0" />
      <span className="max-w-0 whitespace-nowrap text-[14px] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[200px] group-hover:opacity-100 group-focus-visible:max-w-[200px] group-focus-visible:opacity-100">
        {label}
      </span>
    </a>
  );
}
