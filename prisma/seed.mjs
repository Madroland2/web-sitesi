import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const gun = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const YAZILAR = [
  {
    baslik: "Okumanın Yavaşlığı Üzerine",
    slug: "okumanin-yavasligi-uzerine",
    ozet: "Hızlı okuma teknikleri bir metni tüketmeyi öğretiyor; oysa edebiyat tüketilmek için yazılmıyor.",
    icerik: `Bir kitabı bitirmek ile bir kitabı okumak arasındaki farkı geç öğrendim. Yıllarca listelerimi tuttum, sayıları büyüttüm, yılda kaç kitap bitirdiğimi övünerek söyledim. Sonra bir gün, iki yıl önce bitirdiğim bir romanın adını hatırladığımı ama tek bir cümlesini hatırlamadığımı fark ettim.

Hızlı okuma teknikleri bir metni tüketmeyi öğretiyor. Gözü satır boyunca kaydırmayı, iç sesi susturmayı, geri dönüşleri engellemeyi. Bilgi almak için okuduğunuz metinlerde bunların hepsi işe yarar. Ama edebiyat bilgi vermez; bir ritim kurar ve sizden o ritme uymanızı ister.

Proust'un cümleleri uzundur çünkü hatırlamak uzun sürer. Hemingway'inkiler kısadır çünkü söylenmeyeni duymanız gerekir. Cümlenin uzunluğu bir üslup tercihi değil, okurdan istenen zamanın ölçüsüdür. Hızlandırdığınızda metni değil, metnin sizden istediği şeyi kaybedersiniz.

Şimdi daha az kitap okuyorum. Bazen bir sayfayı iki kez, sesli olarak. Listem küçüldü ama hatırladıklarım çoğaldı.`,
    yayinda: true,
    olusturuldu: gun(2),
  },
  {
    baslik: "Çeviride Kaybolan ve Kazanılan",
    slug: "ceviride-kaybolan-ve-kazanilan",
    ozet: "Her çeviri bir yorumdur. Kaybolanı konuşuruz da kazanılanı nedense hiç konuşmayız.",
    icerik: `"Çeviride kaybolan" ifadesi o kadar çok tekrarlandı ki, artık bir klişe. Doğru bir klişe, ama eksik. Çünkü çeviride kaybolan kadar kazanılan da var ve bunu neredeyse hiç konuşmuyoruz.

Bir metin başka bir dile geçtiğinde yalnızca kelimeler değişmez. Metin, o dilin taşıdığı bütün edebi hafızanın içine düşer. Türkçeye çevrilen bir Rus romanı, Türkçenin kendi roman geleneğiyle, kendi deyimleriyle, kendi sessizlikleriyle temas eder. Ortaya çıkan şey ne aslıdır ne de kopyası; üçüncü bir şeydir.

Bazen çevirmen yazarın bulamadığını bulur. Bir kelime, özgün dilinde sıradan iken çevrildiği dilde beklenmedik bir çağrışım açar ve metin o noktada, aslında olmayan bir derinlik kazanır. Bunu kayıp saymak zor.

Elbette bunun tersi çok daha sık oluyor. Ama "kaybolan" üzerine kurulan bütün o hüzünlü söylem, çeviriyi bir eksilme olarak görmeye alıştırıyor bizi. Oysa çeviri bir eksilme değil, bir başkalaşma.`,
    yayinda: true,
    olusturuldu: gun(9),
  },
  {
    baslik: "Kitap Arka Kapaklarının Sessiz Edebiyatı",
    slug: "kitap-arka-kapaklari",
    ozet: "Kimsenin yazar olarak anılmadığı, herkesin okuduğu bir tür: arka kapak metni.",
    icerik: `Bir kitabı elinize aldığınızda ilk okuduğunuz şey büyük ihtimalle romanın ilk cümlesi değil, arka kapaktaki o kırk-elli kelimelik metin. Kim yazdığını bilmezsiniz. Yazarın kendisi değildir genellikle; editördür, bazen bir asistan, bazen serbest çalışan biri.

Bu metinlerin kendine has bir dili var. Asla olay örgüsünü tam anlatmazlar ama hep bir eşiğe kadar getirirler. "Ta ki o mektup gelene kadar." "Ama hiçbir şey göründüğü gibi değildir." Cümleler kısa, sorular retorik, sıfatlar cömerttir.

İlginç olan şu: bu tür, edebiyatın en çok okunan ama en az tartışılan biçimi. Milyonlarca insan her yıl binlerce arka kapak metni okuyor ve hiç kimse bunların iyisini kötüsünü konuşmuyor. Ödülü yok, eleştirisi yok, antolojisi yok.

Oysa iyi bir arka kapak metni yazmak zor. Yalan söylemeden merak uyandırmak, anlatmadan vaat etmek gerekiyor. Bunu başaran biri, kırk kelimeyle bir romanın ruhunu tutuyor demektir.`,
    yayinda: true,
    olusturuldu: gun(21),
  },
];

for (const yazi of YAZILAR) {
  await db.post.upsert({
    where: { slug: yazi.slug },
    update: {},
    create: yazi,
  });
}

const n = await db.post.count();
console.log(`Tohumlama tamam. Toplam yazı: ${n}`);
await db.$disconnect();
