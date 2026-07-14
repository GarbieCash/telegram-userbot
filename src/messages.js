/**
 * Bilingual (English / Indonesian) formatting for every outgoing message.
 *
 * There is no live translation API key configured for this bot (it runs
 * unattended on Render, and a paid translation/AI API would need its own
 * key and could fail or rate-limit mid-send). Instead:
 *
 *  - The fixed daily messages (sessions 1-4) are translated once, up front,
 *    and looked up by exact English text below. If MESSAGE_n is edited in
 *    Render without updating this file, the bot logs a warning and sends
 *    English-only rather than risk showing a stale/mismatched translation.
 *  - The "good morning" session doesn't use a fixed message at all -- it
 *    rotates through a pool of pre-written English/Indonesian variants
 *    (one per day, cycling), so the wording changes daily without needing
 *    a live AI call in production.
 */

// Exact English text -> Indonesian translation, for sessions 1-4.
const staticTranslations = {
  [`Session 1 \u{1F6CE}\u{1F6CE}\u{1F6CE}

First Reservation:
Market Open
Buy Available Tokens
Order and Resell at a Higher Price.`]: `Sesi 1 \u{1F6CE}\u{1F6CE}\u{1F6CE}

Reservasi Pertama:
Pasar Dibuka
Beli Token yang Tersedia
Pesan dan Jual Kembali dengan Harga Lebih Tinggi.`,

  [`Session 2 \u{1F6CE}\u{1F6CE}\u{1F6CE}

First Reservation:
Market Open
Buy Available Tokens
Order and Resell at a Higher Price.`]: `Sesi 2 \u{1F6CE}\u{1F6CE}\u{1F6CE}

Reservasi Pertama:
Pasar Dibuka
Beli Token yang Tersedia
Pesan dan Jual Kembali dengan Harga Lebih Tinggi.`,

  [`\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}

Market Closed 
Resell  Tokens
Resell now for profits`]: `\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}

Pasar Ditutup
Jual Kembali Token
Jual kembali sekarang untuk keuntungan`,

  [`\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}

Market Closed
Available Tokens
Resell now for profits`]: `\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}\u{1F6CE}\u{FE0F}

Pasar Ditutup
Token Tersedia
Jual kembali sekarang untuk keuntungan`,
};

/**
 * Wraps an English message with its Indonesian translation, formatted as:
 *   🇬🇧 <english>
 *
 *   🇮🇩 <indonesian>
 * Falls back to English-only (with a warning) if no saved translation
 * matches the exact text -- this happens if MESSAGE_n was edited in Render
 * without this file being updated to match.
 */
function bilingual(englishText) {
  const indonesian = staticTranslations[englishText];
  if (!indonesian) {
    console.warn(
      `[messages] No saved Indonesian translation for: "${englishText.slice(0, 50).replace(/\n/g, " ")}...". Sending English only.`
    );
    return `\u{1F1EC}\u{1F1E7} ${englishText}`;
  }
  return `\u{1F1EC}\u{1F1E7} ${englishText}\n\n\u{1F1EE}\u{1F1E9} ${indonesian}`;
}

// Rotating "good morning" variants -- same meaning as the seed message the
// user provided, reworded so the post looks different every day. Cycles by
// day of year, so it repeats only after this list is exhausted.
const morningVariants = [
  {
    en: "Good morning family, friends and community members! Today marks another profitable journey of NFT reservation. Let's get ready for the market to open and income to be earned.",
    id: "Selamat pagi keluarga, teman-teman, dan anggota komunitas! Hari ini dimulai lagi perjalanan reservasi NFT yang menguntungkan. Mari bersiap untuk pembukaan pasar dan pendapatan yang akan diperoleh.",
  },
  {
    en: "Good morning everyone! A brand new day, a brand new opportunity for NFT reservation profits. Get ready -- the market is about to open and earnings await.",
    id: "Selamat pagi semuanya! Hari baru, peluang baru untuk keuntungan reservasi NFT. Bersiaplah -- pasar akan segera dibuka dan penghasilan menanti.",
  },
  {
    en: "Rise and shine, family! Another exciting day of NFT reservation is here. Stay prepared as the market opens and profits start rolling in.",
    id: "Bangun dan bersemangat, keluarga! Hari yang menarik untuk reservasi NFT telah tiba. Tetap siap saat pasar dibuka dan keuntungan mulai mengalir.",
  },
  {
    en: "Good morning to our wonderful community! Today brings a fresh chance at NFT reservation gains. Let's stay ready for the market opening and the income ahead.",
    id: "Selamat pagi untuk komunitas kita yang luar biasa! Hari ini membawa kesempatan baru untuk keuntungan reservasi NFT. Mari tetap siap untuk pembukaan pasar dan pendapatan yang akan datang.",
  },
  {
    en: "Hello family and friends, good morning! Another profitable NFT reservation journey begins today. Get set -- the market opens soon and income follows.",
    id: "Halo keluarga dan teman-teman, selamat pagi! Perjalanan reservasi NFT yang menguntungkan dimulai lagi hari ini. Bersiaplah -- pasar akan dibuka dan pendapatan menyusul.",
  },
  {
    en: "Good morning everyone! It's a new day filled with NFT reservation opportunities. Let's prepare together for the market opening and the profits to come.",
    id: "Selamat pagi semuanya! Ini hari baru penuh peluang reservasi NFT. Mari bersiap bersama untuk pembukaan pasar dan keuntungan yang akan datang.",
  },
  {
    en: "Good morning family! Today is another chance to profit through NFT reservation. Stay alert as the market opens and income starts flowing.",
    id: "Selamat pagi keluarga! Hari ini adalah kesempatan lain untuk mendapatkan keuntungan melalui reservasi NFT. Tetap waspada saat pasar dibuka dan pendapatan mulai mengalir.",
  },
  {
    en: "Wishing our community a great morning! A new profitable NFT reservation cycle starts today. Be ready for the market to open and earnings to begin.",
    id: "Selamat pagi untuk komunitas kita! Siklus reservasi NFT yang menguntungkan dimulai lagi hari ini. Bersiaplah untuk pembukaan pasar dan awal penghasilan.",
  },
  {
    en: "Good morning to all our members! Another rewarding day of NFT reservation is ahead. Let's prepare for the market opening and the income that follows.",
    id: "Selamat pagi untuk semua anggota kita! Hari yang menguntungkan lainnya dalam reservasi NFT ada di depan. Mari bersiap untuk pembukaan pasar dan pendapatan yang menyusul.",
  },
  {
    en: "Good morning family and friends! A fresh profitable journey with NFT reservation starts now. Get ready as the market opens and income comes in.",
    id: "Selamat pagi keluarga dan teman-teman! Perjalanan baru yang menguntungkan dengan reservasi NFT dimulai sekarang. Bersiaplah saat pasar dibuka dan pendapatan masuk.",
  },
  {
    en: "Good morning everyone! Today's NFT reservation journey promises more profits. Stay prepared -- the market opens soon and earnings will follow.",
    id: "Selamat pagi semuanya! Perjalanan reservasi NFT hari ini menjanjikan lebih banyak keuntungan. Tetap siap -- pasar akan segera dibuka dan penghasilan akan menyusul.",
  },
  {
    en: "Good morning community! Another day, another opportunity to profit from NFT reservation. Let's gear up for the market opening and the income ahead.",
    id: "Selamat pagi komunitas! Hari baru, peluang baru untuk mendapat untung dari reservasi NFT. Mari bersiap untuk pembukaan pasar dan pendapatan yang akan datang.",
  },
  {
    en: "Good morning family! A new day of NFT reservation profits begins. Be prepared as the market opens and income starts to flow in.",
    id: "Selamat pagi keluarga! Hari baru keuntungan reservasi NFT dimulai. Bersiaplah saat pasar dibuka dan pendapatan mulai mengalir.",
  },
  {
    en: "Good morning to everyone tuning in! Today's NFT reservation journey brings fresh profit opportunities. Get ready for the market to open and earnings to roll in.",
    id: "Selamat pagi untuk semua yang menyimak! Perjalanan reservasi NFT hari ini membawa peluang keuntungan baru. Bersiaplah untuk pembukaan pasar dan penghasilan yang akan mengalir.",
  },
  {
    en: "Good morning family and community! Another successful NFT reservation journey kicks off today. Let's prepare for the market opening and the profits ahead.",
    id: "Selamat pagi keluarga dan komunitas! Perjalanan reservasi NFT yang sukses lainnya dimulai hari ini. Mari bersiap untuk pembukaan pasar dan keuntungan yang akan datang.",
  },
  {
    en: "Rise and shine, everyone! A new profitable NFT reservation day has begun. Stay ready as the market opens and income is earned.",
    id: "Bangun dan bersemangat, semuanya! Hari baru reservasi NFT yang menguntungkan telah dimulai. Tetap siap saat pasar dibuka dan pendapatan diperoleh.",
  },
  {
    en: "Good morning friends! Today brings another opportunity for NFT reservation profits. Let's stay prepared for the market opening and the earnings ahead.",
    id: "Selamat pagi teman-teman! Hari ini membawa peluang lain untuk keuntungan reservasi NFT. Mari tetap siap untuk pembukaan pasar dan penghasilan yang akan datang.",
  },
  {
    en: "Good morning family, friends and members! Another day of profitable NFT reservation starts now. Get ready for the market to open and income to follow.",
    id: "Selamat pagi keluarga, teman-teman, dan anggota! Hari lain reservasi NFT yang menguntungkan dimulai sekarang. Bersiaplah untuk pembukaan pasar dan pendapatan yang akan menyusul.",
  },
  {
    en: "Good morning everyone! It's time for another profitable NFT reservation journey. Be prepared -- the market opens soon and income is on the way.",
    id: "Selamat pagi semuanya! Saatnya perjalanan reservasi NFT yang menguntungkan lagi. Bersiaplah -- pasar akan segera dibuka dan pendapatan sedang dalam perjalanan.",
  },
  {
    en: "Good morning community! A brand new profitable NFT reservation journey begins today. Let's stay ready for the market opening and the income ahead.",
    id: "Selamat pagi komunitas! Perjalanan reservasi NFT yang menguntungkan dan baru dimulai hari ini. Mari tetap siap untuk pembukaan pasar dan pendapatan yang akan datang.",
  },
];

/** Picks today's morning variant (rotates by day of year) and formats it bilingually. */
function todaysMorningMessage(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / 86400000);
  const variant = morningVariants[dayOfYear % morningVariants.length];
  return `\u{1F1EC}\u{1F1E7} ${variant.en}\n\n\u{1F1EE}\u{1F1E9} ${variant.id}`;
}

module.exports = { bilingual, todaysMorningMessage };
