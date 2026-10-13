export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const trLower = (s = "") => s.toLocaleLowerCase("tr-TR");

export const matches = (haystack, query) => {
  const tokens = trLower(query).split(/\s+/).filter((t) => t.length >= 2);
  if (!tokens.length) return true;
  const h = trLower(haystack);
  return tokens.every((t) => h.includes(t));
};

export const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
  if (diff < 172800) return "dün";
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
};

export const dayGroup = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (diff < 1) return "Bugün";
  if (diff < 7) return "Bu hafta";
  if (diff < 31) return "Bu ay";
  return "Daha eski";
};

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
};
