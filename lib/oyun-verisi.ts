export const YASAKLI_KELIMELER = [
  "devrim", "ihtilal", "propaganda", "sansür", "muhalefet",
  "direniş", "isyan", "örgüt", "darbe", "komplo",
  "anarşi", "baskı", "yasadışı", "ajanlık", "casusluk",
  "sabotaj", "virüs", "bomba", "silah", "tehdit",
] as const;

export interface KitapMetni {
  baslik: string;
  metin: string;
  yasakliKelimeVar: boolean;
}

export const KITAP_METINLERI: KitapMetni[] = [
  // ── YOK (25) ──────────────────────────────────────────────────────────────
  {
    baslik: "Aşkın Renkleri",
    metin:
      "Mavi bir Ege kasabasında iki yabancının beklenmedik karşılaşması... Bir ressamın tuvali, yaşlı bir balıkçının hikâyesi. Yıllar boyunca saklanan duygular tek bir yaz mevsiminde yüzeye çıkar.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Annemin Tarifleri",
    metin:
      "Torunlarına bırakacak şeyler arasında en kıymetli olanlar tarihler değil tariflerdi. Bu kitap, bir annenin mutfağından çıkan otuz yıllık lezzetlerin, kokuların ve anıların derlemesidir. Her tarif bir hikâye, her hikâye bir yaşam parçasıdır.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Yalnız Yürüyüş",
    metin:
      "Bir sırt çantası, bir pusula ve hiç bitirilmemiş bir dizi not defteri. Yazar, iki yıl boyunca Anadolu'nun görülmemiş köşelerinde yürüyerek bu notları biriktirdi. Modern insanın yitirdiği dinginliğe açık bir davet.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Dedemin Bahçesi",
    metin:
      "Küçük bir Karadeniz kasabasında büyüyen torun, ölümünden sonra dedesinin bıraktığı bahçeyi anlamaya çalışır. Her ağaç bir hatıra, her köşe bir sırdır. Toprağa gömülen geçmiş yavaş yavaş gün yüzüne çıkar.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Kazananın Sırrı",
    metin:
      "Başarı bir tesadüf değil, alışkanlıkların birikimidir. On yıl boyunca dünyanın dört bir yanındaki girişimcilerle görüşen yazar, başarının formülünü bu kitapta aktarıyor. Pratik egzersizler ve somut adımlarla hayatınızı dönüştürün.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Ormanın Dili",
    metin:
      "Bir biyolog, kırk yıllık araştırmasını paylaşıyor: ağaçlar birbirleriyle konuşur. Kök ağları, kimyasal sinyaller ve sessiz iletişim. Doğanın en büyük gizemi artık okunabilir bir dilde.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Keçi ile Denizci",
    metin:
      "Küçük bir çocuğun gözünden anlatılan bu masal, kayıp bir keçi ile yaşlı bir denizcinin dostluğunu konu alıyor. Her çocuğun bilmesi gereken şu gerçekle bitiyor: en büyük maceralar bazen tam yanı başındadır.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Osmanlı'nın Son Şehzadesi",
    metin:
      "19. yüzyıl İstanbul'unda büyüyen bir şehzade, sarayın altın kafesinde mahkûm kalır. Harem entrikalarından uzaklaşmak isteyen genç adam bir Fransız mürebbiyeyle karşılaşır. İki farklı dünyanın buluşmasını anlatan nefes kesen bir tarihi roman.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Kâğıttan Şiirler",
    metin:
      "Şair bu koleksiyonunda hayatın sıradan anlarından evrensel duygular çıkarıyor. Sabahın sessizliği, bir çocuğun kahkahası, geçen trenin gürültüsü... Hepsinde gizlenen anlam bu dizelerde yeniden doğuyor.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Gecenin Terzisi",
    metin:
      "İstanbul'un arka sokaklarında faaliyet gösteren küçük bir terzinin müşterisi ölü bulununca her şey karmaşık bir hal alır. Dedektif Meral Hanım ipuçlarını mahallenin örümcek ağı gibi dolaşık ilişkilerinde arar.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Son Yıldız",
    metin:
      "Dünya'dan binlerce ışıkyılı uzakta, bir insan kolonisi tuhaf bir anomaliyle karşı karşıya kalır. Genç bir astrofizikçinin cesur kararları tüm koloniyi etkileyecektir. Bilim kurgu tarihinin en özgün distopya hikâyelerinden biri.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Pist Dışında",
    metin:
      "Milli takımın eski kaptanı, sakatlık sonrası hayata nasıl tutundu? Otuz yıllık futbol kariyerini, mutluluklarını ve pişmanlıklarını dürüstçe anlattığı bu anı kitabı, sporun salt bir oyundan fazlası olduğunu gösteriyor.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Komşunun Kedisi",
    metin:
      "Bir apartman katındaki beş farklı ailenin gözünden anlatılan şehir hayatı. Komşuluk ilişkileri, küçük çatışmalar ve beklenmedik dayanışmalar. İstanbul'un gündelik kargaşasına eğlenceli bir mercek.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Sonsuzluğun Eşiğinde",
    metin:
      "Varoluşun anlamını arayan bir filozofun ömür boyu süren yolculuğu. Doğu ve Batı düşüncesini harmanlayan bu eser, büyük soruların yanıtını okuyucuyla birlikte arar.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Matematiği Sevdiren Adam",
    metin:
      "Okuma yazma bilmeyen bir babadan doğan çocuk, nasıl Türkiye'nin ilk matematik olimpiyat madalyacısı oldu? Bir öğretmenin adanmışlığını ve bir çocuğun yeteneğini anlatan ilham verici bir öykü.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Küçük Fabrika",
    metin:
      "Garajında başlattığı küçük işletmeyi on yılda halka açık bir şirkete dönüştüren girişimcinin gerçek hikâyesi. Her hata bir ders, her başarı bir strateji içeriyor. Genç girişimciler için vazgeçilmez bir rehber.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Çocuğunuzu Tanıyın",
    metin:
      "Bir çocuk psikologunun yirmi yıllık deneyimi bu kitapta toplanmış. Oyun, merak, öfke ve sevgi... Çocuğun iç dünyasını anlamak için ebeveynlere yönelik pratik bir rehber.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Taş ve Zaman",
    metin:
      "Türkiye'nin kayıp mimari hazinelerini belgelemeye çalışan bir fotoğrafçının yolculuğu. Yıkılmaya terk edilmiş hanlar, camiler ve köprüler. Taşların sessiz anlatısı bu kitabın her sayfasında yankı buluyor.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Rengin Tarihi",
    metin:
      "Mavi nasıl Prusya mavisine, kırmızı nasıl Türk kırmızısına dönüştü? Bir sanat tarihçisi renklerin kültürel yolculuğunu büyüleyici bir anlatımla aktarıyor.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Ud'un Sırrı",
    metin:
      "Geleneksel müziği yok olmaktan kurtarmaya çalışan genç bir udistanın hikâyesi. Ustadan öğrenciye aktarılan bilgi modern çağda nasıl yaşatılır? Hem bir aşk hem de bir sanat hikâyesi.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Sağlıklı Yaşamak",
    metin:
      "Hastalık başlamadan önce önlenebilir. Uzman doktor, günlük küçük değişikliklerin on yıl sonra büyük fark yarattığını örneklerle anlatıyor. Beslenme, uyku ve hareketin sağlık üzerindeki derin etkisi.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Balkondan Tarla",
    metin:
      "Şehir insanı için pratik bir doğa rehberi: beş metrekare balkonunuzu küçük bir bostana çevirin. Domates, biber, fesleğen ve daha fazlası. Toprağa dokunmanın iyileştirici gücünü keşfedin.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Geçiş Mevsimi",
    metin:
      "Ne çocuk ne yetişkin olan o belirsiz yaşlarda geçen bir yazı anlatan bu roman, büyümenin acısını ve güzelliğini aynı anda hissettiriyor. Okuyucuyu kendi çocukluğuna götüren etkileyici bir dil.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Dağların Çocuğu",
    metin:
      "Tırmanış mevsiminde yaşanan bir kaybolma hikâyesi. Lider ve grup arasındaki güven, hayatta kalma içgüdüsü ve doğanın insana öğrettikleri. Gerilim son sayfaya kadar dinmiyor.",
    yasakliKelimeVar: false,
  },
  {
    baslik: "Ankaralı Ressam",
    metin:
      "Bir ressamın doğduğu şehre yaptığı son ziyareti anlatan bu biyografik roman, sanat ile kimlik arasındaki ilişkiyi sorguluyor. Ankara'nın değişen yüzü ve değişmeyen insanı.",
    yasakliKelimeVar: false,
  },

  // ── VAR (25) ───────────────────────────────────────────────────────────────
  {
    baslik: "Devrimin İçinden",
    metin:
      "1920'lerin başında başlayan devrim, sadece bir hükümeti değil tüm bir toplumu dönüştürdü. Tarihçi bu kitapta sıradan insanların bu dönüşümü nasıl deneyimlediğini taze belgelerle ortaya koyuyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "O Gece",
    metin:
      "Bir ihtilal gecesinin saatlerini dakika dakika izleyen bu belgesel roman, tanık ifadelerinden ve gizli arşivlerden derlendi. Tarih yazımında yeni bir yaklaşım sunan cesur bir eser.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Poster ve Yalan",
    metin:
      "İkinci Dünya Savaşı sırasında üretilen propaganda posterleri, halklara ne kadar kolay yalan söylenebileceğini gözler önüne seriyor. Bir sanat tarihçisinin kapsamlı analizi.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Yasaklı Sayfalar",
    metin:
      "1980'lerden bugüne Türk edebiyatında sansür uygulamalarını mercek altına alan bu akademik çalışma, yasaklanan kitapların listesini ve gerekçelerini belgeliyor. Edebiyat tarihinin sessizlikleri.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Sessiz Sesler",
    metin:
      "Tek parti döneminde muhalefet yapmak ölüm riskini göze almak demekti. Tarihçi, bu cesur seslerin hikâyelerini ilk kez gün yüzüne çıkarıyor. Tarihin gölgesinde kalanların romanı.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Gece Radyosu",
    metin:
      "İkinci Dünya Savaşı'nda Fransız direniş hareketinin içinden bir kadının anıları. Ölüm korkusuyla yaşamın ortasında tutunmanın olağanüstü öyküsü. Gerçek bir kahramanın sesinden.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Yenilmeyenler",
    metin:
      "Tarihte görünmez kalan bir köylü isyanının anlatısı. Arşivlerde yıllarca gizlenen belgeler, sıradan insanların büyük güce karşı nasıl direndiğini ortaya koyuyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Sızdırılan Dosya",
    metin:
      "Interpol'ün on yıldır peşinde olduğu uluslararası bir örgütün sızdırılmış belgeleri bu kitabın temelini oluşturuyor. Bir gazetecinin hayatını tehlikeye atarak yazdığı araştırma.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Sabah Radyosu Sustuktan Sonra",
    metin:
      "1960 darbesinin hemen ardından yazılan bu günlük, o dönemin belirsizliğini, korkusunu ve umudunu eşsiz bir samimiyetle aktarıyor. Siyasi tarihin en değerli birincil kaynaklarından biri.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Kirli Yazışmalar",
    metin:
      "Büyük bir komplo mu, yoksa sıradan yazışmalar zinciri mi? Aralarında bakanların, generallerin ve gazetecilerin bulunduğu davayı belgeleyen bu eser kararı okuyucuya bırakıyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Çatışmanın Çocukları",
    metin:
      "1970'lerin anarşi ortamında büyüyen bir çocuğun anıları. Sokak çatışmaları, kapıya gelen haberler ve babanın sessizliği. Acıyla yoğrulmuş bir büyüme romanı.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Kısıtlı Bölge",
    metin:
      "Azınlıklara yönelik baskı politikalarının belgelendiği bu akademik çalışma arşiv belgelerine ve sözlü tarih röportajlarına dayanıyor. Türkiye'de insan hakları araştırmalarının önemli bir halkası.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Geçiş Ücreti",
    metin:
      "Yasadışı göç yollarını kullanan yüzlerce kişiyle yapılan röportajlardan derlenen bu kitap, Avrupa'ya ulaşmanın gerçek bedelini insanı zorlayan bir dürüstlükle aktarıyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Çifte Hayat",
    metin:
      "Soğuk Savaş döneminde iki farklı ülke adına ajanlık yapan bir kadının inanılmaz hikâyesi. Çifte hayat, çifte kimlik ve bir ömrün yalnızlığı. Gerçeği kurgudan ayırt etmek güçleşiyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Şifre: İstanbul",
    metin:
      "Osmanlı'nın son on yılında casusluk ağlarının nasıl kurulduğunu anlatan bu tarihsel roman gizli belgeler ışığında kurgulanmış. Gerilim ve tarih iç içe geçiyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "İç Ses",
    metin:
      "Bir sabotaj eylemi binlerce kişiyi etkiliyor ama kimse neden söylemek istemez. Endüstriyel kazanın ardındaki gerçeği aramak için ülkeyi dolaşan gazetecinin romanı.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Hasta Gezegen",
    metin:
      "Yeni bir virüs dünyanın dört bir yanındaki laboratuvarlarda izleniyor. Kim ilk çözüme ulaşacak, kim sessiz kalacak? Küresel bir yarışın içinde bilimin ve siyasetin çarpıştığı nefes kesen roman.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Enkaz",
    metin:
      "Bir şehrin kalbinde patlayan bomba sadece binaları değil insanlar arasındaki güveni de paramparça ediyor. Hayatta kalanların anlatısından oluşan bu kitap acının belleğini yaşatıyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Kara Para",
    metin:
      "Yasadışı silah ticaretinin izini süren gazeteci beklenmedik bir kapıyı aralıyor. Devlet, suç ve ticaret arasındaki üçgeni belgeleyen cesur bir araştırma kitabı.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Avukat",
    metin:
      "Tehdit mektupları almaya başlamadan önce sıradan bir avukattı. Şimdi müvekkili ölü, tanıklar kayboluyor ve ipuçları onu devletin en karanlık köşelerine çekiyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Kitlelerin Zaferi",
    metin:
      "Bir devrim nasıl propaganda aracına dönüştürülür? Tarihin iktidara gelen güçlerin mesajlarını nasıl şekillendirdiğini inceleyen bu eser günümüz medya okuryazarlığı için kritik sorular soruyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Kalemler Susmaz",
    metin:
      "Sansür ve baskı ortamında eser üretmeye çalışan sanatçıların hikâyeleri. Yazarlar, yönetmenler ve müzisyenlerle yapılan röportajlardan oluşan bu derleme yaratıcılığın direnişini belgeler.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "İktidarın Anatomisi",
    metin:
      "Darbeye giden süreçte muhalefet seslerini kısmanın sistematik bir yol haritasını anlatan bu siyaset bilimi çalışması otoriterleşme süreçlerine dair evrensel dersler içeriyor.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Kırlarda Ateş",
    metin:
      "Tarihte en uzun süren isyan hareketlerinden birini konu alan bu kitap hem silahlı direniş yıllarını hem de barış müzakerelerini belgeleyen nadir bir kaynak.",
    yasakliKelimeVar: true,
  },
  {
    baslik: "Gizli Misyon",
    metin:
      "Uluslararası bir casusluk örgütünün içinde geçirdiği on yılı anlatan eski ajanın yayınlanması yasaklanan anıları. Mahkeme kararıyla serbest bırakılan bu versiyon bazı bölümleri hâlâ sansürlü içeriyor.",
    yasakliKelimeVar: true,
  },
];
