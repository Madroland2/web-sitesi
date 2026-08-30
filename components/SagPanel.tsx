import { DIS_BAGLANTILAR } from "@/lib/baglantilar";

function InstagramSimgesi() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Kitapyurdu için açık kitap sembolü — marka logosu değil, jenerik simge */
function KitapSimgesi() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5" aria-hidden="true">
      <path d="M12 6.5C10.3 5.2 8.1 4.6 5.5 4.6c-.9 0-1.8.1-2.5.2v13c.7-.1 1.6-.2 2.5-.2 2.6 0 4.8.6 6.5 1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6.5c1.7-1.3 3.9-1.9 6.5-1.9.9 0 1.8.1 2.5.2v13c-.7-.1-1.6-.2-2.5-.2-2.6 0-4.8.6-6.5 1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6.5v13" strokeLinecap="round" />
    </svg>
  );
}

const SIMGELER: Record<string, () => React.ReactElement> = {
  instagram: InstagramSimgesi,
  kitapyurdu: KitapSimgesi,
};

export default function SagPanel() {
  const etkin = DIS_BAGLANTILAR.filter((b) => b.adres.trim() !== "");
  if (etkin.length === 0) return null;

  return (
    <nav aria-label="Dış bağlantılar" className="flex gap-2 lg:flex-col">
      {etkin.map((b) => {
        const Simge = SIMGELER[b.ad];
        return (
          <a
            key={b.ad}
            href={b.adres}
            target="_blank"
            rel="noopener noreferrer"
            title={b.baslik}
            aria-label={`${b.baslik} (yeni sekmede açılır)`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a332a] text-[#a89e8c] hover:border-[#d4a24c] hover:text-[#d4a24c]"
          >
            {Simge ? <Simge /> : b.baslik.charAt(0)}
          </a>
        );
      })}
    </nav>
  );
}
