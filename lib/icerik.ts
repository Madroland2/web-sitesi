import DOMPurify from "isomorphic-dompurify";

/**
 * Editörün ürettiği HTML'i güvenli hale getirir.
 *
 * İçeriği yalnızca giriş yapmış admin yazabiliyor, yani birincil tehdit dışarıdan
 * gelen saldırgan değil. Yine de sanitize ediliyor: yapıştırılan içerikle farkında
 * olmadan script taşınabilir ve veritabanına bir kez yazılan HTML her ziyaretçide
 * çalışır. Beyaz liste, editörün üretebildiği etiketlerle sınırlı tutuldu.
 */
const IZINLI_ETIKETLER = [
  "p", "br", "strong", "em", "s", "u",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "hr",
  "a", "img",
  "code", "pre",
];

const IZINLI_NITELIKLER = ["href", "target", "rel", "src", "alt", "title", "style"];

export function temizle(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: IZINLI_ETIKETLER,
    ALLOWED_ATTR: IZINLI_NITELIKLER,
    // javascript: ve data: şemalarını engeller (data:image hariç tutulmadı,
    // görseller Blob'dan https ile geliyor)
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
    // style yalnızca hizalama için kullanılıyor; DOMPurify değerleri ayrıca süzer
    FORBID_ATTR: ["onerror", "onload", "onclick"],
  });
}

/** HTML etiketlerini atıp düz metin bırakır — özet ve okuma süresi için */
export function duzMetin(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
