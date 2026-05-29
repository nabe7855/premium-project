export const STORE_META: Record<string, {
  city: string; cityKana: string; area: string; areaKw: string[];
}> = {
  tokyo:   { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  honten:  { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  yokohama:{ city: "横浜",   cityKana: "よこはま",   area: "みなとみらい・関内", areaKw: ["みなとみらい","関内","桜木町","新横浜"] },
  nagoya:  { city: "名古屋", cityKana: "なごや",     area: "栄・名古屋駅",     areaKw: ["栄","名駅","金山","伏見"] },
  osaka:   { city: "大阪",   cityKana: "おおさか",   area: "梅田・難波",       areaKw: ["梅田","難波","心斎橋","天王寺"] },
  fukuoka: { city: "福岡",   cityKana: "ふくおか",   area: "天神・博多",       areaKw: ["天神","博多","中洲"] },
};
