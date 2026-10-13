import { buildAssistant, europePmc, trDizin } from "@/data/mock";

export const WORKSPACES = [
  { id: "personal", name: "Kişisel Çalışma Alanı", sub: "Dr. Elif Yılmaz", type: "hekim" },
  { id: "clinic", name: "Çankaya ASM Ekibi", sub: "Kurum · demo ekip", type: "hekim" },
  { id: "admin", name: "Platform Yönetimi", sub: "Yönetici yetkisi", type: "admin" },
];

export const PHYSICIAN = {
  name: "Dr. Elif Yılmaz", initials: "EY", title: "Aile Hekimliği Uzmanı",
  institution: "Örnek Aile Sağlığı Merkezi, Ankara", email: "elif.yilmaz@ornek-medassistix.tr",
  diploma: "•••• •••• 4821", since: "Mart 2026",
};

const ago = (days, hours = 0) => new Date(Date.now() - days * 864e5 - hours * 36e5).toISOString();

export const seedCases = () => {
  const c1 = { id: "c1", ws: "personal", complaint: "6 haftadır devam eden kuru öksürük, geceleri artıyor. Ateş yok.", age: 45, sex: "Kadın", duration: "6 hafta", allergies: ["Penisilin"], context: "Sigara kullanmıyor. Bilinen astım öyküsü yok. Son 2 ayda yeni başlanan ilaç bildirilmedi.", status: "hazir", createdAt: ago(1, 3), updatedAt: ago(0, 2) };
  c1.messages = [
    { id: "m1", role: "user", kind: "ayirici", text: "Bu vakada ayırıcı tanıda hangi başlıkları değerlendirmeliyim?", createdAt: ago(0, 3) },
    buildAssistant("ayirici", c1, "ayırıcı"),
  ];
  return [
    c1,
    { id: "c2", ws: "personal", complaint: "Tekrarlayan baş ağrısı, sabahları belirgin", age: 32, sex: "Kadın", duration: "3 ay", allergies: [], context: "", status: "taslak", messages: [], createdAt: ago(0, 5), updatedAt: ago(0, 5) },
    { id: "c3", ws: "personal", complaint: "Son 1 ayda artan susama hissi ve sık idrara çıkma", age: 58, sex: "Erkek", duration: "1 ay", allergies: ["Sülfonamid"], context: "Babasında tip 2 diyabet öyküsü var. Kilo kaybı tarif ediyor.", status: "hazir", messages: [], createdAt: ago(2), updatedAt: ago(2) },
    { id: "c4", ws: "personal", complaint: "Kulak ağrısı ve ateş, huzursuzluk", age: 6, sex: "Erkek", duration: "2 gün", allergies: [], context: "Üst solunum yolu enfeksiyonu sonrası başlamış.", status: "arsiv", messages: [], createdAt: ago(12), updatedAt: ago(9) },
    { id: "c5", ws: "clinic", complaint: "Halsizlik ve efor dispnesi, solukluk", age: 39, sex: "Kadın", duration: "2 ay", allergies: [], context: "Menoraji tarif ediyor.", status: "hazir", messages: [], createdAt: ago(3), updatedAt: ago(1) },
  ];
};

const ev = (id, title, source, lang, type, year, publisher, topics) => ({
  id, title, source, lang, type, year, publisher, topics,
  url: source === "TR Dizin" ? trDizin(topics[0]) : europePmc(topics[0]),
});

export const EVIDENCE = [
  ev("e1", "Birinci basamakta kronik öksürüğe yaklaşım", "TR Dizin", "TR", "Derleme", 2024, "Örnek Aile Hekimliği Dergisi", ["kronik öksürük", "öksürük"]),
  ev("e2", "Chronic cough in adults: diagnostic pathways in primary care", "Europe PMC", "EN", "Araştırma Makalesi", 2023, "Sample Journal of Primary Care", ["chronic cough", "öksürük", "cough"]),
  ev("e3", "Yeni tanı tip 2 diyabet hastalarında birinci basamak izlemi", "TR Dizin", "TR", "Araştırma Makalesi", 2023, "Örnek Endokrinoloji Dergisi", ["tip 2 diyabet", "diyabet", "poliüri"]),
  ev("e4", "Hypertension management in primary care settings", "Europe PMC", "EN", "Derleme", 2022, "Sample Cardiology Review", ["hypertension", "hipertansiyon", "tansiyon"]),
  ev("e5", "Çocuklarda akut otitis media yönetimi", "TR Dizin", "TR", "Derleme", 2022, "Örnek Pediatri Dergisi", ["otitis media", "kulak ağrısı", "çocuk"]),
  ev("e6", "Migren ve gerilim tipi baş ağrısının ayırıcı tanısı", "TR Dizin", "TR", "Derleme", 2024, "Örnek Nöroloji Bülteni", ["baş ağrısı", "migren"]),
  ev("e7", "Antibiotic stewardship in outpatient respiratory infections", "Europe PMC", "EN", "Araştırma Makalesi", 2024, "Sample Infectious Diseases Journal", ["antibiotic stewardship", "antibiyotik", "öksürük"]),
  ev("e8", "Aile hekimliğinde akılcı ilaç kullanımı", "TR Dizin", "TR", "Araştırma Makalesi", 2021, "Örnek Aile Hekimliği Dergisi", ["akılcı ilaç kullanımı", "ilaç"]),
  ev("e9", "Hipertansiyon tanı ve izlem kılavuzu (örnek)", "Kılavuz", "TR", "Kılavuz", 2025, "Örnek Uzmanlık Derneği", ["hipertansiyon kılavuz", "hipertansiyon"]),
  ev("e10", "Diyabet tanı, tedavi ve izlem kılavuzu (örnek)", "Kılavuz", "TR", "Kılavuz", 2025, "Örnek Uzmanlık Derneği", ["diyabet kılavuz", "diyabet"]),
  ev("e11", "Penicillin allergy labels and delabeling strategies", "Europe PMC", "EN", "Derleme", 2023, "Sample Allergy Review", ["penicillin allergy", "penisilin", "alerji"]),
  ev("e12", "Yetişkinlerde demir eksikliği anemisine tanısal yaklaşım", "TR Dizin", "TR", "Derleme", 2022, "Örnek Hematoloji Dergisi", ["demir eksikliği anemisi", "anemi", "halsizlik"]),
];

export const SUGGESTED_TOPICS = ["kronik öksürük", "hipertansiyon", "tip 2 diyabet", "baş ağrısı", "anemi"];

export const INGREDIENTS = ["Parasetamol", "İbuprofen", "Amoksisilin", "Amoksisilin + Klavulanik asit", "Metformin", "Amlodipin", "Ramipril", "Atorvastatin", "Omeprazol", "Salbutamol", "Setirizin", "Levotiroksin"];

const p = (id, name, ingredient, strength, form, pack) => ({ id, name, ingredient, strength, form, pack, firm: "Örnek İlaç A.Ş." });

export const PRODUCTS = [
  p("p1", "Termafen", "Parasetamol", "500 mg", "Tablet", "20 tablet"),
  p("p2", "Termafen Forte", "Parasetamol", "1000 mg", "Efervesan tablet", "16 tablet"),
  p("p3", "Termafen Pediatrik", "Parasetamol", "120 mg/5 ml", "Şurup", "150 ml"),
  p("p4", "Ibrofex", "İbuprofen", "400 mg", "Film kaplı tablet", "20 tablet"),
  p("p5", "Ibrofex Süspansiyon", "İbuprofen", "100 mg/5 ml", "Oral süspansiyon", "100 ml"),
  p("p6", "Amoxilen", "Amoksisilin", "500 mg", "Kapsül", "16 kapsül"),
  p("p7", "Amoxilen", "Amoksisilin", "250 mg/5 ml", "Oral süspansiyon için toz", "100 ml"),
  p("p8", "Klavomed", "Amoksisilin + Klavulanik asit", "875/125 mg", "Film kaplı tablet", "14 tablet"),
  p("p9", "Klavomed BID", "Amoksisilin + Klavulanik asit", "400/57 mg/5 ml", "Oral süspansiyon için toz", "70 ml"),
  p("p10", "Glumetrix", "Metformin", "850 mg", "Film kaplı tablet", "100 tablet"),
  p("p11", "Glumetrix XR", "Metformin", "1000 mg", "Uzatılmış salımlı tablet", "60 tablet"),
  p("p12", "Amlovas", "Amlodipin", "5 mg", "Tablet", "30 tablet"),
  p("p13", "Amlovas", "Amlodipin", "10 mg", "Tablet", "30 tablet"),
  p("p14", "Ramicor", "Ramipril", "5 mg", "Tablet", "28 tablet"),
  p("p15", "Atorlip", "Atorvastatin", "20 mg", "Film kaplı tablet", "30 tablet"),
  p("p16", "Omepra-D", "Omeprazol", "20 mg", "Enterik kapsül", "14 kapsül"),
  p("p17", "Salbuvent", "Salbutamol", "100 mcg/doz", "İnhalasyon aerosolü", "200 doz"),
  p("p18", "Setira", "Setirizin", "10 mg", "Film kaplı tablet", "20 tablet"),
  p("p19", "Tiroxa", "Levotiroksin", "50 mcg", "Tablet", "50 tablet"),
  p("p20", "Tiroxa", "Levotiroksin", "100 mcg", "Tablet", "50 tablet"),
];

export const seedPhysicians = () => [
  { id: "u1", name: "Dr. Elif Yılmaz", title: "Aile Hekimliği Uzmanı", city: "Ankara", status: "Doğrulandı", submitted: ago(40), doc: "Diploma + uzmanlık belgesi" },
  { id: "u2", name: "Dr. Mehmet Kaya", title: "Pratisyen Hekim", city: "İzmir", status: "İnceleniyor", submitted: ago(0, 6), doc: "Diploma tescil belgesi" },
  { id: "u3", name: "Dr. Zeynep Demir", title: "İç Hastalıkları Uzmanı", city: "İstanbul", status: "İnceleniyor", submitted: ago(1, 2), doc: "Uzmanlık belgesi" },
  { id: "u4", name: "Dr. Ahmet Çelik", title: "Aile Hekimi", city: "Bursa", status: "İnceleniyor", submitted: ago(2, 4), doc: "Diploma tescil belgesi" },
  { id: "u5", name: "Selin Arslan", title: "Belirtilmedi", city: "Antalya", status: "Reddedildi", submitted: ago(5), doc: "Eksik belge", reason: "Hekimlik belgesi doğrulanamadı" },
];

export const ACCOUNTS = [
  { id: "a1", name: "Dr. Elif Yılmaz", email: "elif.yilmaz@ornek-medassistix.tr", roles: ["Hekim"], ws: "Kişisel, Çankaya ASM Ekibi" },
  { id: "a2", name: "Can Öztürk", email: "can.ozturk@ornek-medassistix.tr", roles: ["Platform Yöneticisi"], ws: "Platform Yönetimi" },
  { id: "a3", name: "Dr. Deniz Aydın", email: "deniz.aydin@ornek-medassistix.tr", roles: ["Hekim", "Platform Yöneticisi"], ws: "Kişisel, Platform Yönetimi" },
  { id: "a4", name: "Dr. Mehmet Kaya", email: "mehmet.kaya@ornek-medassistix.tr", roles: ["Hekim (doğrulama bekliyor)"], ws: "Kişisel" },
];
