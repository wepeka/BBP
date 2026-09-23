import { MessageCircle } from "lucide-react";

export function WhatsAppFab({ whatsapp }: { whatsapp: string }) {
  const message = encodeURIComponent(
    "Halo BBP, saya ingin menanyakan tentang layanan konstruksi Anda."
  );
  const href = `https://wa.me/${whatsapp}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 lg:h-12 lg:w-12"
      aria-label="Hubungi BBP lewat WhatsApp"
    >
      <MessageCircle size={26} aria-hidden="true" className="lg:hidden" />
      <MessageCircle size={22} aria-hidden="true" className="hidden lg:block" />
    </a>
  );
}
