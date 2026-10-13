import { uid } from "@/lib/format";

export const QUICK_ACTIONS = [
  { kind: "tedavi", label: "Tedavi yaklaşımı", prompt: "Bu vaka için tedavi yaklaşımını hangi başlıklar altında değerlendirmeliyim?" },
  { kind: "ilac", label: "İlaç seçenekleri", prompt: "Bu vakanın bağlamında ilaç seçeneklerini değerlendirirken nelere dikkat etmeliyim?" },
  { kind: "ayirici", label: "Ayırıcı tanı", prompt: "Bu vakada ayırıcı tanıda hangi başlıkları değerlendirmeliyim?" },
  { kind: "tetkik", label: "Tetkik önerileri", prompt: "Bu vakada hangi tetkik kategorilerini planlamayı düşünmeliyim?" },
];

export const KIND_LABEL = { tedavi: "Tedavi yaklaşımı", ilac: "İlaç seçenekleri", ayirici: "Ayırıcı tanı", tetkik: "Tetkik önerileri", genel: "Klinik soru" };

export const europePmc = (q) => `https://europepmc.org/search?query=${encodeURIComponent(q)}`;
export const trDizin = (q) => `https://search.trdizin.gov.tr/tr/yayin/ara?q=${encodeURIComponent(q)}&order=relevance-DESC&page=1&limit=20`;

const searchLinks = (topic) => [
  { id: uid(), source: "TR Dizin", label: `TR Dizin'de "${topic}" ile ilgili yayınları ara`, url: trDizin(topic) },
  { id: uid(), source: "Europe PMC", label: `Europe PMC'de "${topic}" ile ilgili yayınları ara`, url: europePmc(topic) },
];

const STOP = /\d|^(son|devam|eden|olan|ve|ile|bir|haftadır|gündür|aydır|yıldır|ayda|günde|haftada|artan)$/i;
const shortTopic = (c) => (c?.complaint || "klinik soru").split(/[.,;]/)[0].split(/\s+/).filter((w) => !STOP.test(w)).slice(0, 4).join(" ") || "klinik soru";

const BODIES = {
  ayirici: (c) => [
    { title: "Değerlendirilebilecek tanı grupları", items: ["Enfeksiyöz nedenler (öykü, süre ve ateş varlığına göre)", "İnflamatuvar / alerjik nedenler", "Yapısal veya organ sistemine özgü nedenler", "İlaç ilişkili olası nedenler — güncel ilaç listesi gözden geçirilmeli"] },
    { title: "Öncelikle dışlanması gerekenler", items: ["Kırmızı bayrak bulgularının sistematik sorgulanması", `${c?.age || "Belirtilen"} yaş ve ${c?.sex ? c.sex.toLocaleLowerCase("tr-TR") : "belirtilen"} hasta grubunda öne çıkabilecek ciddi tablolar`] },
  ],
  tetkik: () => [
    { title: "Düşünülebilecek tetkik kategorileri", items: ["Temel laboratuvar değerlendirmesi", "Klinik bulgulara göre hedefe yönelik görüntüleme", "Gerekirse fonksiyonel testler", "Bulgulara göre uzman konsültasyonu"] },
    { title: "Planlama notu", items: ["Tetkik seçimi muayene bulguları ve güncel kılavuzlarla birlikte hekim tarafından belirlenmelidir."] },
  ],
  tedavi: () => [
    { title: "Yaklaşım çerçevesi", items: ["Altta yatan nedene yönelik değerlendirmenin tamamlanması", "Güncel ulusal / uluslararası kılavuzların kontrol edilmesi", "Non-farmakolojik önlemler ve hasta eğitimi", "Takip aralığı ve yeniden değerlendirme kriterleri"] },
  ],
  ilac: (c) => [
    { title: "Değerlendirme kontrol listesi", items: [c?.allergies?.length ? `Kayıtlı alerji(ler): ${c.allergies.join(", ")} — seçeneklerde mutlaka dikkate alınmalı` : "Kayıtlı alerji bulunmuyor — yine de hastayla teyit edilmeli", "Yaş, böbrek ve karaciğer fonksiyonu gibi faktörler", "Hastanın kullandığı diğer ilaçlar", "Dozaj bilgisi bu prototipte sunulmaz — onaylı ürün bilgisine başvurun"] },
  ],
  genel: () => [
    { title: "Genel değerlendirme başlıkları", items: ["Sorunuz vaka bağlamıyla birlikte ele alındı", "Ayrıntılı öykü ve muayene bulgularının eklenmesi yanıtın kapsamını iyileştirebilir"] },
  ],
};

const FOLLOWUPS = {
  ayirici: ["Kırmızı bayrak bulguları nelerdir?", "Hangi tetkiklerle ayrım yapılabilir?"],
  tetkik: ["Tetkik sonuçlarına göre izlem nasıl planlanmalı?", "Hangi durumda sevk düşünülmeli?"],
  tedavi: ["Takip planını nasıl yapılandırmalıyım?", "Hasta eğitiminde hangi başlıklar önemli?"],
  ilac: ["Alerji öyküsü olan hastada nelere dikkat edilmeli?", "İlaç güvenlik kontrolü yapmak istiyorum"],
  genel: ["Ayırıcı tanı başlıklarını göster", "Tetkik kategorilerini listele"],
};

export const buildAssistant = (kind, c, text = "") => {
  const t = text.trim();
  if (/hata/i.test(t)) return { id: uid(), role: "assistant", type: "error", kind, createdAt: new Date().toISOString() };
  if (kind === "genel" && t.length < 14) {
    return {
      id: uid(), role: "assistant", type: "clarification", kind, createdAt: new Date().toISOString(),
      question: "Sorunuzu biraz daha netleştirebilir misiniz? Hangi konuda destek istediğinizi belirtirseniz vaka bağlamıyla birlikte ele alabilirim.",
      options: ["Ayırıcı tanı başlıkları", "Tetkik planlaması", "Tedavi yaklaşımı çerçevesi"],
    };
  }
  const withSources = kind !== "genel";
  return {
    id: uid(), role: "assistant", type: "answer", kind, createdAt: new Date().toISOString(),
    intro: `Vaka bağlamı (${c?.age || "?"} yaş, ${c?.sex || "belirtilmedi"}, ${c?.duration || "süre belirtilmedi"}) dikkate alınarak yapılandırılmış bir değerlendirme çerçevesi hazırlandı.`,
    sections: BODIES[kind](c),
    sources: withSources ? searchLinks(shortTopic(c)) : [],
    followups: FOLLOWUPS[kind],
  };
};

export const detectKind = (text) => {
  const t = text.toLocaleLowerCase("tr-TR");
  if (t.includes("ayırıcı")) return "ayirici";
  if (t.includes("tetkik")) return "tetkik";
  if (t.includes("tedavi")) return "tedavi";
  if (t.includes("ilaç")) return "ilac";
  return "genel";
};
