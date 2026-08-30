"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

interface Props {
  deger: string;
  degisti: (html: string) => void;
}

/** Araç çubuğundaki tek bir düğme */
function Dugme({
  etiket,
  baslik,
  aktif,
  pasif,
  tikla,
}: {
  etiket: React.ReactNode;
  baslik: string;
  aktif?: boolean;
  pasif?: boolean;
  tikla: () => void;
}) {
  return (
    <button
      type="button"
      onClick={tikla}
      disabled={pasif}
      title={baslik}
      aria-label={baslik}
      aria-pressed={aktif}
      className={`min-w-8 rounded px-2 py-1 text-sm leading-none disabled:opacity-40 ${
        aktif
          ? "bg-[#d4a24c] font-semibold text-[#0d1117]"
          : "text-[#a89e8c] hover:bg-[#161b22] hover:text-[#e9e2d4]"
      }`}
    >
      {etiket}
    </button>
  );
}

function Ayirici() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-[#3a332a]" aria-hidden="true" />;
}

function AracCubugu({
  editor,
  gorselEkle,
  yukleniyor,
}: {
  editor: Editor;
  gorselEkle: () => void;
  yukleniyor: boolean;
}) {
  const baglantiEkle = useCallback(() => {
    const mevcut = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı adresi:", mevcut ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-[#3a332a] bg-[#12100c] px-2 py-1.5">
      <Dugme
        etiket={<strong>K</strong>}
        baslik="Kalın (Cmd+B)"
        aktif={editor.isActive("bold")}
        tikla={() => editor.chain().focus().toggleBold().run()}
      />
      <Dugme
        etiket={<em>İ</em>}
        baslik="İtalik (Cmd+I)"
        aktif={editor.isActive("italic")}
        tikla={() => editor.chain().focus().toggleItalic().run()}
      />
      <Dugme
        etiket={<s>S</s>}
        baslik="Üstü çizili"
        aktif={editor.isActive("strike")}
        tikla={() => editor.chain().focus().toggleStrike().run()}
      />

      <Ayirici />

      <Dugme
        etiket="B1"
        baslik="Büyük başlık"
        aktif={editor.isActive("heading", { level: 2 })}
        tikla={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <Dugme
        etiket="B2"
        baslik="Küçük başlık"
        aktif={editor.isActive("heading", { level: 3 })}
        tikla={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <Dugme
        etiket="¶"
        baslik="Normal paragraf"
        aktif={editor.isActive("paragraph")}
        tikla={() => editor.chain().focus().setParagraph().run()}
      />

      <Ayirici />

      <Dugme
        etiket="•"
        baslik="Madde listesi"
        aktif={editor.isActive("bulletList")}
        tikla={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Dugme
        etiket="1."
        baslik="Numaralı liste"
        aktif={editor.isActive("orderedList")}
        tikla={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Dugme
        etiket="❝"
        baslik="Alıntı"
        aktif={editor.isActive("blockquote")}
        tikla={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <Ayirici />

      <Dugme
        etiket="⇤"
        baslik="Sola hizala"
        aktif={editor.isActive({ textAlign: "left" })}
        tikla={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <Dugme
        etiket="↔"
        baslik="Ortala"
        aktif={editor.isActive({ textAlign: "center" })}
        tikla={() => editor.chain().focus().setTextAlign("center").run()}
      />
      <Dugme
        etiket="⇥"
        baslik="Sağa hizala"
        aktif={editor.isActive({ textAlign: "right" })}
        tikla={() => editor.chain().focus().setTextAlign("right").run()}
      />

      <Ayirici />

      <Dugme
        etiket="🔗"
        baslik="Bağlantı ekle"
        aktif={editor.isActive("link")}
        tikla={baglantiEkle}
      />
      <Dugme
        etiket={yukleniyor ? "…" : "🖼"}
        baslik="Görsel yükle"
        pasif={yukleniyor}
        tikla={gorselEkle}
      />

      <Ayirici />

      <Dugme
        etiket="↶"
        baslik="Geri al"
        pasif={!editor.can().undo()}
        tikla={() => editor.chain().focus().undo().run()}
      />
      <Dugme
        etiket="↷"
        baslik="İleri al"
        pasif={!editor.can().redo()}
        tikla={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
}

export default function ZenginEditor({ deger, degisti }: Props) {
  const dosyaGirdisi = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "editor-gorsel" } }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: deger,
    // SSR sırasında hemen render edilmesin — hidrasyon uyuşmazlığını önler
    immediatelyRender: false,
    onUpdate: ({ editor }) => degisti(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "editor-govde min-h-[22rem] rounded-b-lg border border-[#3a332a] bg-[#0f0d0a] px-4 py-3 focus:outline-none",
      },
    },
  });

  async function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
    if (!dosya || !editor) return;

    setYukleniyor(true);
    setHata("");

    try {
      const govde = new FormData();
      govde.append("dosya", dosya);
      const cevap = await fetch("/api/upload", { method: "POST", body: govde });
      const veri = await cevap.json();

      if (!cevap.ok) {
        setHata(veri.hata ?? "Yükleme başarısız.");
        return;
      }

      editor.chain().focus().setImage({ src: veri.url, alt: dosya.name }).run();
    } catch {
      setHata("Sunucuya ulaşılamadı.");
    } finally {
      setYukleniyor(false);
    }
  }

  if (!editor) {
    return (
      <div className="min-h-[25rem] animate-pulse rounded-lg border border-[#3a332a] bg-[#0f0d0a]" />
    );
  }

  return (
    <div>
      <AracCubugu
        editor={editor}
        yukleniyor={yukleniyor}
        gorselEkle={() => dosyaGirdisi.current?.click()}
      />
      <EditorContent editor={editor} />

      <input
        ref={dosyaGirdisi}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={dosyaSecildi}
        className="hidden"
      />

      {hata && (
        <p className="mt-2 rounded-lg border border-[#f85149]/30 bg-[#f85149]/10 px-3 py-2 text-sm text-[#f85149]">
          {hata}
        </p>
      )}

      <p className="mt-1.5 text-xs text-[#8b949e]">
        Görseller sürükle-bırak yerine 🖼 düğmesiyle eklenir. En fazla 8 MB; JPEG,
        PNG, GIF, WEBP.
      </p>
    </div>
  );
}
