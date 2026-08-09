# IELTS Full Mock Platform

To&lsquo;liq IELTS (Academic) mock imtihon platformasi: ro&lsquo;yxatdan o&lsquo;tish, imtihon tartibidagi 4 bo&lsquo;lim,
real band score va har bir urinishdan keyin batafsil tahlil.

## Imkoniyatlar

- **Ro&lsquo;yxatdan o&lsquo;tish / kirish** — testlar faqat tizimga kirgan foydalanuvchi uchun ochiladi.
  Parol solt bilan xeshlanadi, maʼlumotlar brauzerning `localStorage`ida saqlanadi (backend talab qilinmaydi).
- **1200 ta to&lsquo;liq mock** — har bir mock `id` bo&lsquo;yicha deterministik generator orqali yaratiladi
  (bir xil `id` doim bir xil imtihonni beradi), Listening 40 savol, Reading 40 savol, Writing 2 task, Speaking 3 part.
- **Imtihon rejimi** — bo&lsquo;lim tartibi va rasmiy vaqt: Listening 30 daqiqa, Reading 60, Writing 60, Speaking ~14.
  Taymer tugaganda keyingi bo&lsquo;limga avtomatik o&lsquo;tiladi; yopilgan bo&lsquo;limga qaytib bo&lsquo;lmaydi.
  Listening audiosi har bir part uchun faqat bir marta ijro etiladi (Web Speech API).
- **Real band score** — Listening/Reading uchun rasmiy raw → band jadvali, Writing/Speaking uchun 4 mezon bo&lsquo;yicha
  baholash (Writing Task 2 ikki barobar vaznda), overall band rasmiy yarim-band yaxlitlash qoidasi bilan.
- **Tahlil** — har bir savol uchun sizning javobingiz, to&lsquo;g&lsquo;ri javob va izoh; savol turlari bo&lsquo;yicha
  foizlar; kuchli/zaif tomonlar, tavsiyalar; Listening transkriptlari; natijalar tarixi va statistikasi.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit testlar (vitest)
npm run build    # typecheck + production build
npm run lint     # oxlint
```

## Loyiha tuzilishi

| Fayl | Vazifasi |
| --- | --- |
| `src/lib/prng.ts` | Deterministik tasodifiy generator (mock reproduktsiyasi uchun) |
| `src/lib/banks.ts` | Kontent banklari (mavzular, savol shablonlari, Speaking kartalari) |
| `src/lib/listening.ts` | Listening 4 parti, transkript va javoblar |
| `src/lib/reading.ts` | Reading 3 passage, savol turlari (headings, TFNG, completion, MCQ) |
| `src/lib/writing.ts` | Writing tasklari va matn tahlili asosida mezonli baholash |
| `src/lib/speaking.ts` | Speaking savollari va nutq transkripti bo&lsquo;yicha baholash |
| `src/lib/scoring.ts` | Rasmiy raw → band jadvallari, overall yaxlitlash, javob taqqoslash |
| `src/lib/grade.ts` | Urinishni baholash va tahlil hisobotini yig&lsquo;ish |
| `src/lib/mocks.ts` | Mock katalogi (1200 ta), sahifalash va qidiruv |
| `src/lib/storage.ts` | Foydalanuvchi hisoblari, sessiya va natijalar tarixi |

## Cheklovlar

- Listening audiosi brauzerdagi nutq sintezi orqali o&lsquo;qiladi (studiya yozuvi emas).
- Speaking javobi brauzer nutqni tanish (Web Speech API) orqali matnga aylantiriladi; qo&lsquo;llab-quvvatlanmasa,
  javobni matn ko&lsquo;rinishida kiritish mumkin. Talaffuz balli faqat taqribiy hisoblanadi.
- Writing/Speaking ballari matn xususiyatlariga asoslangan evristik model orqali chiqariladi; LLM (masalan Gemini)
  bilan baholashni qo&lsquo;shish keyingi qadam sifatida rejalashtirilgan.
