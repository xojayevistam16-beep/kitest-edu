import { EducationLesson, QuizQuestion } from '../types';

export interface GradeLessonData {
  grade: string;
  title: string;
  theory: string;
  formulaOrRule: string;
  example: string;
  summary: string;
  questions: {
    q: string;
    a: string[];
    c: number;
  }[];
}

// 20 Full Lessons for Matematika (5-8 sinflar)
export const MATEMATIKA_LESSONS: GradeLessonData[] = [
  // 5-sinf
  {
    grade: "5-sinf",
    title: "Natural sonlar va xona birliklari",
    theory: "Sanoqda ishlatiladigan 1, 2, 3, 4, ... sonlar natural sonlar deb ataladi. 0 soni natural son emas. Eng kichik natural son 1 ga teng, eng katta natural son esa mavjud emas. Natural sonlar o'nlik sanoq sistemasida 0 dan 9 gacha bo'lgan 10 ta raqam yordamida yoziladi. Sonlar xonalar (birlar, o'nlar, yuzlar, minglar) va sinflarga bo'linadi.",
    formulaOrRule: "Xona qo'shiluvchilari yig'indisi: 4528 = 4×1000 + 5×100 + 2×10 + 8×1.",
    example: "Misol: 7 305 sonida 7 ta minglik, 3 ta yuzlik, 0 ta o'nlik va 5 ta birlik mavjud.",
    summary: "Natural sonlar buyumlarni sanashda ishlatiladi, eng kichigi 1 dir. Har bir xona o'zidan oldingisidan 10 barobar katta.",
    questions: [
      { q: "Eng kichik natural son qaysi?", a: ["1", "0", "-1", "Mavjud emas"], c: 0 },
      { q: "0 soni natural son hisoblanadimi?", a: ["Yo'q, natural son emas", "Ha, eng kichik natural son", "Faqat juft natural son", "Faqat kasr son"], c: 0 },
      { q: "5842 sonida nechta yuzlik xonasi bor?", a: ["8 ta", "5 ta", "4 ta", "2 ta"], c: 0 },
      { q: "999 dan keyin keluvchi natural son qaysi?", a: ["1000", "998", "1001", "9990"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Natural sonlarni qo'shish va ayirish qonunlari",
    theory: "Qo'shish amali a + b = c ko'rinishida yoziladi (a va b — qo'shiluvchilar, c — yig'indi). Ayirish esa qo'shishga teskari amal: a - b = c (a — kamayuvchi, b — ayriluvchi, c — ayirma). Qo'shish amali o'rin almashtirish va guruhlash qonunlariga bo'ysunadi.",
    formulaOrRule: "O'rin almashtirish: a + b = b + a. Guruhlash: (a + b) + c = a + (b + c). Nolinchi element: a + 0 = a.",
    example: "Misol: (127 + 450) + 73 ifodani qulay usulda hisoblash: (127 + 73) + 450 = 200 + 450 = 650.",
    summary: "Qo'shiluvchilarning o'rni almashgani bilan yig'indi o'zgarmaydi. Bu hisob-kitoblarni tez va oson bajarishga yordam beradi.",
    questions: [
      { q: "Qo'shishning o'rin almashtirish qonuni qaysi?", a: ["a + b = b + a", "(a * b) = a + b", "a - b = b - a", "a + 0 = 0"], c: 0 },
      { q: "25 + 47 + 75 ifodaning eng qulay hisoblash natijasi:", a: ["147", "137", "157", "125"], c: 0 },
      { q: "Kamayuvchi 90, ayriluvchi 35 bo'lsa, ayirma nechaga teng?", a: ["55", "65", "45", "125"], c: 0 },
      { q: "a - 0 ifodaning qiymati nimaga teng?", a: ["a", "0", "1", "Aniqlab bo'lmaydi"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Natural sonlarni ko'paytirish va taqsimot qonuni",
    theory: "Bir xil qo'shiluvchilar yig'indisini topish amali ko'paytirish deyiladi: a · b = c (a va b — ko'paytuvchilar, c — ko'paytma). Ko'paytirishning o'rin almashtirish, guruhlash va qo'shishga nisbatan taqsimot qonunlari mavjud.",
    formulaOrRule: "Taqsimot qonuni: a · (b + c) = a·b + a·c va a · (b - c) = a·b - a·c.",
    example: "Misol: 25 × 38 × 4 = (25 × 4) × 38 = 100 × 38 = 3800.",
    summary: "Ko'paytirishda sonlarni 10, 100, 1000 hosil qiladigan qilib guruhlash hisoblashni juda osonlashtiradi.",
    questions: [
      { q: "25 × 17 × 4 ko'paytmani qulay hisoblang:", a: ["1700", "170", "3400", "1500"], c: 0 },
      { q: "Taqsimot qonunining to'g'ri formulasini toping:", a: ["a(b + c) = ab + ac", "a(b + c) = ab + c", "a(b + c) = a + bc", "a(b + c) = abc"], c: 0 },
      { q: "Ixtiyoriy sonni 0 ga ko'paytirganda natija nima bo'ladi?", a: ["0", "1", "O'sha sonning o'zi", "Cheksizlik"], c: 0 },
      { q: "12 × 5 + 12 × 5 ifodaning natijasi:", a: ["120", "60", "100", "144"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Qoldiqli bo'lish va bo'linish belgilari",
    theory: "Bir natural sonni ikkinchisiga har doim qoldiqsiz bo'lib bo'lmaydi. Bo'linuvchi (a), bo'luvchi (b), to'liqsiz bo'linma (q) va qoldiq (r) orasidagi bog'lanish: a = b·q + r, bunda 0 ≤ r < b. Bo'linish belgilari orqali sonni bo'lmasdan turib qoldiqsiz bo'linishini bilish mumkin.",
    formulaOrRule: "Qoldiq har doim bo'luvchidan kichik bo'ladi (r < b). Raqamlari yig'indisi 3 ga bo'linsa, son 3 ga bo'linadi.",
    example: "Misol: 47 ni 5 ga bo'lganda to'liqsiz bo'linma 9, qoldiq 2 bo'ladi: 47 = 5×9 + 2.",
    summary: "Son 2 ga bo'linishi uchun oxirgi raqami juft, 5 ga bo'linishi uchun oxiri 0 yoki 5, 10 ga bo'linishi uchun 0 bo'lishi kerak.",
    questions: [
      { q: "Qaysi son 3 ga qoldiqsiz bo'linadi?", a: ["234 (yig'indisi 9)", "125", "233", "401"], c: 0 },
      { q: "Qoldiqli bo'lishda qoldiq bo'luvchidan qanday bo'lishi shart?", a: ["Har doim kichik", "Katta yoki teng", "Ixtiyoriy", "Har doim 0"], c: 0 },
      { q: "53 ni 6 ga bo'lgandagi qoldiq nechaga teng?", a: ["5 (chunki 6×8=48, 53-48=5)", "4", "3", "2"], c: 0 },
      { q: "Oxirgi raqami 0 yoki 5 bo'lgan barcha sonlar qaysi songa bo'linadi?", a: ["5 ga", "3 ga", "4 ga", "9 ga"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Oddiy kasrlar va to'g'ri/noto'g'ri kasrlar",
    theory: "Birlikning bir yoki bir nechta teng ulushlaridan tuzilgan son oddiy kasr deyiladi. Kasr chizig'i ustidagi son surat, ostidagi son maxraj deyiladi. Maxraj butun nechta bo'lakka bo'linganini, surat esa nechta bo'lak olinganini bildiradi. Surati maxrajidan kichik kasr to'g'ri kasr, surati maxrajiga teng yoki katta bo'lsa noto'g'ri kasr deyiladi.",
    formulaOrRule: "To'g'ri kasr: a/b < 1 (a < b). Noto'g'ri kasr: a/b ≥ 1 (a ≥ b).",
    example: "Misol: 3/4 — to'g'ri kasr (3 < 4), 7/5 — noto'g'ri kasr (7 > 5) bo'lib, uni 1 butun 2/5 aralash son ko'rinishida yozish mumkin.",
    summary: "To'g'ri kasrlar har doim 1 dan kichik, noto'g'ri kasrlar esa 1 ga teng yoki 1 dan katta bo'ladi.",
    questions: [
      { q: "Kasrning maxraji nimani anglatadi?", a: ["Butun nechta teng bo'lakka bo'linganini", "Nechta bo'lak olinganini", "Ko'paytmani", "Qoldiqni"], c: 0 },
      { q: "Quyidagilardan qaysi biri to'g'ri kasr?", a: ["3/5", "7/4", "9/9", "12/5"], c: 0 },
      { q: "Noto'g'ri kasrning qiymati qanday bo'ladi?", a: ["1 ga teng yoki 1 dan katta", "Har doim 0 dan kichik", "Har doim 1 dan kichik", "Faqat butun son"], c: 0 },
      { q: "11/4 noto'g'ri kasr aralash son ko'rinishida qanday yoziladi?", a: ["2 butun 3/4", "3 butun 1/4", "2 butun 1/4", "1 butun 3/4"], c: 0 },
    ]
  },

  // 6-sinf
  {
    grade: "6-sinf",
    title: "O'nli kasrlar va ular ustida arifmetik amallar",
    theory: "Maxraji 10, 100, 1000, ... bo'lgan kasrlar o'nli kasrlar shaklida vergul bilan yoziladi. Masalan, 3/10 = 0.3, 27/100 = 0.27. O'nli kasrlarni qo'shish va ayirishda vergullar tagma-tag tushadigan qilib yoziladi. Ko'paytirishda esa vergul hisobga olinmay ko'paytirilib, natijada har ikkala sondagi verguldan keyingi raqamlar yig'indisi qadar o'ngdan chapga vergul ajratiladi.",
    formulaOrRule: "0.5 + 0.25 = 0.75; 0.4 × 0.2 = 0.08 (ikkita xona vergul suriladi).",
    example: "Misol: 3.5 × 1.2 ko'paytirish: 35 × 12 = 420. Verguldan keyin 2 ta raqam bo'lgani uchun natija: 4.20 = 4.2.",
    summary: "O'nli kasrlar kundalik hayotda (pul, o'lchov, vazn) keng ishlatiladi. Vergul bilan ishlash qoidalariga aniq amal qilish shart.",
    questions: [
      { q: "0.6 + 0.35 yig'indining qiymati nechaga teng?", a: ["0.95", "0.41", "0.095", "1.05"], c: 0 },
      { q: "0.3 × 0.3 ko'paytmaning to'g'ri natijasi:", a: ["0.09", "0.9", "0.009", "9"], c: 0 },
      { q: "4.5 : 10 amalini bajaring:", a: ["0.45", "45", "0.045", "4.50"], c: 0 },
      { q: "7/100 oddiy kasr o'nli kasr ko'rinishida qanday yoziladi?", a: ["0.07", "0.7", "0.007", "7.0"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Musbat va manfiy sonlar. Butun sonlar ustida amallar",
    theory: "0 dan katta sonlar musbat (+), 0 dan kichik sonlar manfiy (-) sonlar deyiladi. 0 soni musbat ham, manfiy ham emas. Barcha natural sonlar, ularga qarama-qarshi manfiy sonlar va 0 soni birgalikda butun sonlar to'plamini (Z) tashkil etadi. Bir xil ishorali sonlarni qo'shishda ularning modullari qo'shilib, umumiy ishora yoziladi. Har xil ishorali sonlarni qo'shishda kattasidan kichigi ayrilib, kattasining ishorasi qo'yiladi.",
    formulaOrRule: "(-a) + (-b) = -(a + b); (-a) + b = b - a; (-a) × (-b) = a × b; (-a) × b = -(a × b).",
    example: "Misol: (-7) + (-8) = -15; (-12) + 20 = +8; (-4) × (-5) = +20; (-18) : 3 = -6.",
    summary: "Minusni minusga ko'paytirsak plus bo'ladi. Minusni plusga ko'paytirsak minus bo'ladi.",
    questions: [
      { q: "(-15) + 20 amalini bajaring:", a: ["5", "-5", "-35", "35"], c: 0 },
      { q: "(-6) × (-7) amali natijasi nechaga teng?", a: ["42", "-42", "13", "-13"], c: 0 },
      { q: "(-30) : (-5) amali natijasi:", a: ["6", "-6", "25", "-25"], c: 0 },
      { q: "0 soni qanday son hisoblanadi?", a: ["Musbat ham, manfiy ham emas", "Faqat musbat son", "Faqat manfiy son", "Natural son"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Sonning moduli va koordinata to'g'ri chizig'i",
    theory: "Sanoq boshi O(0), masshtab birligi va yo'nalishi ko'rsatilgan to'g'ri chiziq koordinata to'g'ri chizig'i deyiladi. Koordinata to'g'ri chizig'ida sanoq boshidan berilgan nuqtagacha bo'lgan masofa shu sonning moduli (mutlaq qiymati) deb ataladi va |a| kabi belgilanadi. Masofa har doim nomanfiy bo'lgani sababli, har qanday sonning moduli musbat son yoki nolga teng bo'ladi.",
    formulaOrRule: "|a| = a (agar a ≥ 0 bo'lsa), |a| = -a (agar a < 0 bo'lsa). |-5| = 5, |0| = 0, |5| = 5.",
    example: "Misol: |-12| + |7| - |-3| = 12 + 7 - 3 = 16.",
    summary: "Sonning moduli manfiy bo'lishi mumkin emas. Modul geometrik jihatdan masofani bildiradi.",
    questions: [
      { q: "|-25| ning qiymati nechaga teng?", a: ["25", "-25", "0", "1/25"], c: 0 },
      { q: "|-8| + |+8| ifodani hisoblang:", a: ["16", "0", "-16", "64"], c: 0 },
      { q: "Koordinata to'g'ri chizig'ida qaysi son kichik hisoblanadi?", a: ["Chapda joylashgani", "O'ngda joylashgani", "Moduli katta bo'lgani", "Nolga yaqin bo'lgani"], c: 0 },
      { q: "Agar |x| = 9 bo'lsa, x qanday qiymatlarni qabul qilishi mumkin?", a: ["9 va -9", "Faqat 9", "Faqat -9", "0 va 9"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Nisbat va proporsiya qonuniyatlari",
    theory: "Ikki sonning bo'linmasi nisbat deyiladi (a : b). Ikki nisbatning tengligi proporsiya deyiladi: a : b = c : d yoki a/b = c/d. Bu yerda a va d chetki hadlar, b va c o'rta hadlar deyiladi. Proporsiyaning asosiy xossasi: chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng.",
    formulaOrRule: "Asosiy xossa: a · d = b · c. Noma'lum chetki had: a = (b · c) / d.",
    example: "Misol: x : 4 = 15 : 6 bo'lsa, 6 · x = 4 · 15 => 6x = 60 => x = 10.",
    summary: "Proporsiya yordamida to'g'ri va teskari mutanosib miqdorlarga oid xaritalar, masshtab va iqtisodiy masalalar yechiladi.",
    questions: [
      { q: "Proporsiyaning asosiy xossasi qaysi?", a: ["Chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng (ad = bc)", "a + d = b + c", "a - d = b - c", "a / d = b / c"], c: 0 },
      { q: "x : 6 = 10 : 3 proporsiyadan x ni toping:", a: ["20 (chunki 6×10/3 = 20)", "15", "18", "30"], c: 0 },
      { q: "12 ning 4 ga nisbati nechaga teng?", a: ["3", "4", "8", "48"], c: 0 },
      { q: "4 ta daftar 8000 so'm bo'lsa, 7 ta daftar qancha turadi?", a: ["14000 so'm", "12000 so'm", "16000 so'm", "10000 so'm"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Foizlar va sonning foizini topish",
    theory: "Butunning yuzdan bir ulushi foiz deyiladi va % belgisi bilan ifodalanadi (1% = 1/100 = 0.01). Sonning p foizini topish uchun sonni 100 ga bo'lib, p ga ko'paytirish (yoki 0.01·p ga ko'paytirish) kerak. Foiziga ko'ra sonni topish uchun berilgan qiymatni foiz ko'rsatkichiga bo'lib, 100 ga ko'paytiriladi.",
    formulaOrRule: "Sonning foizi: B = A × (p / 100). Foiziga ko'ra son: A = (B / p) × 100.",
    example: "Misol: 200 ning 15% ini topish: 200 × 0.15 = 30.",
    summary: "Foizlar iqtisodiyotda, bank omonatlarida, chegirmalarda va do'konlardagi aksiyalarda eng muhim hisoblash vositasidir.",
    questions: [
      { q: "500 ning 20% i nechaga teng?", a: ["100", "50", "200", "20"], c: 0 },
      { q: "50% qanday ulushni bildiradi?", a: ["Yarmini (1/2)", "To'rtdan birini (1/4)", "Beshdan birini (1/5)", "Butunni (1)"], c: 0 },
      { q: "25% qaysi oddiy kasrga teng?", a: ["1/4", "1/2", "1/5", "3/4"], c: 0 },
      { q: "10% i 40 ga teng bo'lgan sonni toping:", a: ["400", "40", "4", "200"], c: 0 },
    ]
  },

  // 7-sinf
  {
    grade: "7-sinf",
    title: "Birhadlar va ko'phadlar ustida amallar",
    theory: "Sonli va harfli ko'paytuvchilar hamda ularning darajalaridan tuzilgan ifoda birhad deyiladi (masalan: 5x²y). Birhadlarning algebraik yig'indisi ko'phad deyiladi (masalan: 3x² - 2x + 7). Harfli qismi bir xil bo'lgan birhadlar o'xshash birhadlar deyiladi. O'xshash birhadlarni birlashtirish o'xshash hadlarni ixchamlash deb ataladi.",
    formulaOrRule: "Ko'paytirish: a^m × a^n = a^(m+n); Bo'lish: a^m / a^n = a^(m-n); Darajaga ko'tarish: (a^m)^n = a^(m×n).",
    example: "Misol: 4x² + 7x - 2x² + 3x = (4 - 2)x² + (7 + 3)x = 2x² + 10x.",
    summary: "Algebraik ifodalar bilan ishlashda harfli qismlar qat'iy tekshirilib, faqat bir xil darajali o'xshash hadlar qo'shiladi yoki ayriladi.",
    questions: [
      { q: "x³ × x⁴ ifodaning soddalashtirilgan shakli qaysi?", a: ["x⁷", "x¹²", "x¹", "2x⁷"], c: 0 },
      { q: "5a + 3b + 2a - b ifodani ixchamlang:", a: ["7a + 2b", "8ab", "7a - 2b", "10ab"], c: 0 },
      { q: "(y²)³ darajaning qiymati nimaga teng?", a: ["y⁶", "y⁵", "y⁸", "y³"], c: 0 },
      { q: "3x²y birhadning darajasi nechaga teng?", a: ["3 (chunki 2 + 1 = 3)", "2", "1", "6"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Qisqa ko'paytirish formulalari",
    theory: "Ko'phadlarni tez ko'paytirish va ko'paytuvchilarga ajratishda qisqa ko'paytirish formulalari qo'llaniladi. Ular hisoblash jarayonini bir necha barobar qisqartiradi va algebraning eng asosiy qurollaridan biridir.",
    formulaOrRule: "1) (a + b)² = a² + 2ab + b²\n2) (a - b)² = a² - 2ab + b²\n3) a² - b² = (a - b)(a + b)",
    example: "Misol: (x + 5)² = x² + 2·x·5 + 5² = x² + 10x + 25. 49² - 41² = (49 - 41)(49 + 41) = 8 × 90 = 720.",
    summary: "Kvadratlar ayirmasi va yig'indining kvadrati formulalarini yoddan bilish har qanday murakkab ifodani oson yechish kalitidir.",
    questions: [
      { q: "(a - b)² ning to'liq yoyilmasi qaysi?", a: ["a² - 2ab + b²", "a² - b²", "a² + 2ab + b²", "a² - 2ab - b²"], c: 0 },
      { q: "x² - 16 ifoda ko'paytuvchilarga qanday ajraladi?", a: ["(x - 4)(x + 4)", "(x - 8)(x + 8)", "(x - 4)²", "(x + 4)²"], c: 0 },
      { q: "(2x + 3)² ifodani oching:", a: ["4x² + 12x + 9", "4x² + 9", "2x² + 6x + 9", "4x² + 6x + 9"], c: 0 },
      { q: "51² - 49² ifodaning qiymatini hisoblang:", a: ["200 (chunki (51-49)(51+49) = 2×100 = 200)", "100", "400", "2"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Bir noma'lumli chiziqli tenglamalar",
    theory: "ax + b = 0 (bu yerda a ≠ 0) ko'rinishidagi tenglama bir noma'lumli chiziqli tenglama deyiladi. Tenglamani yechish — uning barcha ildizlarini topish yoki ildizlari yo'qligini isbotlash demakdir. Tenglamada hadlarni tenglikning bir tomonidan ikkinchi tomoniga ishorasini qarama-qarshisiga o'zgartirib o'tkazish mumkin.",
    formulaOrRule: "ax = -b => x = -b / a.",
    example: "Misol: 3x + 12 = 27 => 3x = 27 - 12 => 3x = 15 => x = 15 / 3 => x = 5.",
    summary: "Noma'lum qatnashgan hadlar chap tomonga, ma'lum sonlar o'ng tomonga o'tkazilib, ixchamlanadi va ildiz topiladi.",
    questions: [
      { q: "2x + 8 = 20 tenglamaning ildizini toping:", a: ["6 (chunki 2x=12 => x=6)", "14", "10", "4"], c: 0 },
      { q: "5x - 15 = 0 tenglamada x nechaga teng?", a: ["3", "-3", "5", "0"], c: 0 },
      { q: "Tenglamada had narigi tomonga o'tganda uning ishorasi qanday o'zgaradi?", a: ["Qarama-qarshisiga o'zgaradi", "O'zgarmay qoladi", "Doim musbat bo'ladi", "Nolga aylanadi"], c: 0 },
      { q: "4x = 0 tenglamaning ildizi nechaga teng?", a: ["0", "4", "-4", "Ildizi yo'q"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Burchaklar, qo'shni va vertikal burchaklar",
    theory: "Bir nuqtadan chiquvchi ikki nur hosil qilgan geometrik figura burchak deyiladi. Burchaklar graduslarda o'lchanadi: O'tkir (<90°), To'g'ri (90°), O'tmas (90° va 180° oralig'ida) va Yoyiq (180°). Bir tomoni umumiy, qolgan ikki tomoni bir to'g'ri chiziqni to'ldiruvchi nurlar bo'lgan burchaklar qo'shni burchaklar deyiladi. Tomonlari bir-birining davomi bo'lgan burchaklar vertikal burchaklar deyiladi.",
    formulaOrRule: "Qo'shni burchaklar yig'indisi 180° ga teng (α + β = 180°). Vertikal burchaklar o'zaro tengdir (α = β).",
    example: "Misol: Qo'shni burchaklardan biri 70° bo'lsa, ikkinchisi 180° - 70° = 110° bo'ladi.",
    summary: "Vertikal burchaklar doimo teng, qo'shni burchaklar esa birgalikda 180 gradusli to'g'ri chiziq hosil qiladi.",
    questions: [
      { q: "Qo'shni burchaklar yig'indisi necha gradusga teng?", a: ["180°", "90°", "360°", "100°"], c: 0 },
      { q: "Vertikal burchaklardan biri 45° bo'lsa, ikkinchisi necha gradus?", a: ["45°", "135°", "90°", "180°"], c: 0 },
      { q: "To'g'ri burchak necha gradus bo'ladi?", a: ["90°", "180°", "60°", "45°"], c: 0 },
      { q: "Qo'shni burchaklardan biri 120° bo'lsa, ikkinchisini toping:", a: ["60°", "120°", "90°", "30°"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Uchburchaklar va ularning tenglik alomatlari",
    theory: "Bir to'g'ri chiziqda yotmagan uchta nuqta va ularni tutashtiruvchi uchta kesmadan iborat figura uchburchak deyiladi. Uchburchakning ichki burchaklari yig'indisi har doim 180° ga teng. Ikki uchburchakning mos tomonlari va mos burchaklari teng bo'lsa, ular teng uchburchaklar deyiladi.",
    formulaOrRule: "Ichki burchaklar yig'indisi: ∠A + ∠B + ∠C = 180°.\n1-alomat: TBT (Ikki tomon va ular orasidagi burchak).\n2-alomat: BTB (Bir tomon va unga yopishgan ikki burchak).\n3-alomat: TTT (Uchta tomon tengligi).",
    example: "Misol: Uchburchakning ikki burchagi 50° va 70° bo'lsa, uchinchi burchagi: 180° - (50° + 70°) = 60°.",
    summary: "Uchburchak burchaklari yig'indisi qat'iy 180° bo'lib, uning alomatlari shakllarning tengligini aniqlashda asosiy o'rin tutadi.",
    questions: [
      { q: "Uchburchakning ichki burchaklari yig'indisi nechaga teng?", a: ["180°", "360°", "90°", "270°"], c: 0 },
      { q: "Teng tomonli (muntazam) uchburchakning har bir burchagi necha gradus?", a: ["60°", "90°", "45°", "180°"], c: 0 },
      { q: "Uchburchakning ikki burchagi 40° va 60° bo'lsa, uchinchi burchagini toping:", a: ["80°", "90°", "100°", "70°"], c: 0 },
      { q: "Uchburchaklar tengligining TTT alomati nimani bildiradi?", a: ["Uchta mos tomonlarining tengligini", "Uchta burchak tengligini", "Ikki tomon va burchakni", "Yuzalar tengligini"], c: 0 },
    ]
  },

  // 8-sinf
  {
    grade: "8-sinf",
    title: "Arifmetik kvadrat ildiz va uning xossalari",
    theory: "Kvadrati a ga teng bo'lgan nomanfiy son a sonining arifmetik kvadrat ildizi deyiladi va √a kabi belgilanadi (a ≥ 0). Manfiy sonlarning haqiqiy sonlar to'plamida kvadrat ildizi mavjud emas. Kvadrat ildiz amali darajaga ko'tarishga teskari amaldir.",
    formulaOrRule: "(√a)² = a; √(a × b) = √a × √b (a ≥ 0, b ≥ 0); √(a / b) = √a / √b (b > 0); √(a²) = |a|.",
    example: "Misol: √64 = 8, chunki 8 ≥ 0 va 8² = 64. √(4 × 25) = √4 × √25 = 2 × 5 = 10.",
    summary: "Ildiz ostida faqat nomanfiy sonlar bo'ladi va ildizdan chiqadigan natija ham har doim nomanfiy son bo'ladi.",
    questions: [
      { q: "√81 ning qiymati nechaga teng?", a: ["9", "-9", "81", "18"], c: 0 },
      { q: "√16 + √9 ifodani hisoblang:", a: ["7 (chunki 4 + 3 = 7)", "5", "25", "12"], c: 0 },
      { q: "√(a²) ifoda nimaga teng?", a: ["|a| ga", "a² ga", "2a ga", "-a ga"], c: 0 },
      { q: "√0 ning qiymati nechaga teng?", a: ["0", "1", "Mavjud emas", "-1"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Kvadrat tenglamalar va Diskriminant",
    theory: "ax² + bx + c = 0 (a ≠ 0) ko'rinishidagi tenglama kvadrat tenglama deyiladi. a — birinchi koeffitsiyent, b — ikkinchi koeffitsiyent, c — ozod had. Kvadrat tenglamaning ildizlari soni diskriminant (D) ga bog'liq.",
    formulaOrRule: "Diskriminant: D = b² - 4ac.\n1) Agar D > 0 bo'lsa: 2 ta turli ildiz: x₁,₂ = (-b ± √D) / (2a).\n2) Agar D = 0 bo'lsa: 1 ta ildiz (karrali): x = -b / (2a).\n3) Agar D < 0 bo'lsa: Haqiqiy ildizlari yo'q.",
    example: "Misol: x² - 5x + 6 = 0. a=1, b=-5, c=6. D = (-5)² - 4·1·6 = 25 - 24 = 1. x₁ = (5 + 1)/2 = 3, x₂ = (5 - 1)/2 = 2.",
    summary: "Diskriminant kvadrat tenglamaning kalitidir. D musbat bo'lsa 2 ta ildiz, nol bo'lsa 1 ta ildiz, manfiy bo'lsa haqiqiy ildiz yo'q.",
    questions: [
      { q: "Kvadrat tenglama diskriminanti formulasi qaysi?", a: ["D = b² - 4ac", "D = b² + 4ac", "D = 2b - 4ac", "D = b - 4ac"], c: 0 },
      { q: "Agar D < 0 bo'lsa, kvadrat tenglama nechta haqiqiy ildizga ega?", a: ["Ildizga ega emas (0 ta)", "1 ta", "2 ta", "Cheksiz ko'p"], c: 0 },
      { q: "x² - 6x + 9 = 0 tenglamaning diskriminanti nimaga teng?", a: ["0 (chunki 36 - 36 = 0)", "36", "18", "-36"], c: 0 },
      { q: "x² - 4 = 0 to'liqsiz kvadrat tenglama ildizlarini toping:", a: ["2 va -2", "Faqat 2", "Faqat 4", "0 va 4"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Viyet teoremasi va ildizlar xossalari",
    theory: "Keltirilgan kvadrat tenglama x² + px + q = 0 ko'rinishida bo'ladi (birinchi koeffitsiyenti a = 1 bo'lgan tenglama). Fransuz matematigi Fransua Viyet keltirilgan kvadrat tenglama ildizlari va uning koeffitsiyentlari o'rtasidagi ajoyib bog'liqlikni kashf etgan.",
    formulaOrRule: "Viyet teoremasi:\nx₁ + x₂ = -p (ildizlar yig'indisi qarama-qarshi ishora bilan olingan ikkinchi koeffitsiyentga teng);\nx₁ · x₂ = q (ildizlar ko'paytmasi ozod hadga teng).",
    example: "Misol: x² - 7x + 12 = 0 tenglamada x₁ + x₂ = 7 va x₁ · x₂ = 12. Demak, ildizlar: x₁ = 3, x₂ = 4.",
    summary: "Viyet teoremasi yordamida kvadrat tenglamaning ildizlarini diskriminantsiz, og'zaki topish juda qulaydir.",
    questions: [
      { q: "x² + px + q = 0 tenglamada ildizlar yig'indisi nimaga teng?", a: ["-p", "p", "q", "-q"], c: 0 },
      { q: "x² - 9x + 20 = 0 tenglamaning ildizlarini Viyet orqali toping:", a: ["4 va 5", "2 va 10", "-4 va -5", "1 va 20"], c: 0 },
      { q: "x² + 5x + 6 = 0 tenglamaning ildizlari ko'paytmasi nechaga teng?", a: ["6", "-5", "5", "-6"], c: 0 },
      { q: "Ildizlari 2 va 3 bo'lgan keltirilgan kvadrat tenglamani tuzing:", a: ["x² - 5x + 6 = 0", "x² + 5x + 6 = 0", "x² - 6x + 5 = 0", "x² + 6x + 5 = 0"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "To'rtburchaklar: Parallelogramm, Romb, Trapetsiya",
    theory: "Qarama-qarshi tomonlari juft-jufti bilan parallel bo'lgan to'rtburchak parallelogramm deyiladi. Parallelogrammning qarama-qarshi tomonlari va qarama-qarshi burchaklari o'zaro teng, diagonallari esa kesishish nuqtasida teng ikkiga bo'linadi. Barcha tomonlari teng parallelogramm romb deyiladi. Faqat ikki tomoni parallel bo'lgan to'rtburchak trapetsiya deyiladi.",
    formulaOrRule: "Parallelogramm yuzi: S = a × h_a. Romb yuzi: S = (d₁ × d₂) / 2. Trapetsiya yuzi: S = ((a + b) / 2) × h.",
    example: "Misol: Asosi 8 sm, balandligi 5 sm bo'lgan parallelogramm yuzi: S = 8 × 5 = 40 sm².",
    summary: "To'rtburchaklarning xossalari va yuz formulalari arxitektura, qurilish va muhandislikda keng qo'llaniladi.",
    questions: [
      { q: "Barcha tomonlari teng bo'lgan parallelogramm nima deyiladi?", a: ["Romb", "Trapetsiya", "To'g'ri to'rtburchak", "Aylana"], c: 0 },
      { q: "Faqat ikki qarama-qarshi tomoni parallel bo'lgan to'rtburchak qaysi?", a: ["Trapetsiya", "Parallelogramm", "Kvadrat", "Romb"], c: 0 },
      { q: "Diagonallari 6 sm va 8 sm bo'lgan rombning yuzini toping:", a: ["24 sm² (chunki (6×8)/2 = 24)", "48 sm²", "14 sm²", "28 sm²"], c: 0 },
      { q: "Parallelogrammning diagonallari kesishish nuqtasida qanday bo'linadi?", a: ["Teng ikkiga bo'linadi", "Uchdan birga", "Bo'linmaydi", "90° burchak ostida kesishadi"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Pifagor teoremasi va to'g'ri burchakli uchburchak",
    theory: "To'g'ri burchakli uchburchakda 90° li burchak qarshisidagi eng uzun tomon gipotenuza, qolgan ikki tomoni katetlar deyiladi. Qadimgi yunon olimi Pifagor to'g'ri burchakli uchburchak tomonlari o'rtasidagi fundamental munosabatni isbotlagan.",
    formulaOrRule: "Pifagor teoremasi: c² = a² + b² (Gipotenuza kvadrati katetlar kvadratlarining yig'indisiga teng).\nc = √(a² + b²), a = √(c² - b²).",
    example: "Misol: Katetlari a = 3 sm, b = 4 sm bo'lsa: c² = 3² + 4² = 9 + 16 = 25 => c = √25 = 5 sm (Misr uchburchagi).",
    summary: "Pifagor teoremasi geometriya, navigatsiya, fizika va fazoviy o'lchovlarning eng muhim poydevoridir.",
    questions: [
      { q: "Pifagor teoremasining to'g'ri formulasi qaysi?", a: ["c² = a² + b²", "c = a + b", "c² = a² - b²", "a² + c² = b²"], c: 0 },
      { q: "Katetlari 6 sm va 8 sm bo'lgan uchburchakning gipotenuzasini toping:", a: ["10 sm (chunki 36+64=100 => √100=10)", "14 sm", "12 sm", "48 sm"], c: 0 },
      { q: "Gipotenuzasi 13 sm, bir kateti 5 sm bo'lsa, ikkinchi katetni toping:", a: ["12 sm (chunki 169 - 25 = 144 => √144=12)", "8 sm", "10 sm", "18 sm"], c: 0 },
      { q: "To'g'ri burchakli uchburchakning eng uzun tomoni nima deb ataladi?", a: ["Gipotenuza", "Katet", "Balandlik", "Bissektrisa"], c: 0 },
    ]
  }
];

// 20 Full Lessons for Informatika (5-8 sinflar)
export const INFORMATIKA_LESSONS: GradeLessonData[] = [
  // 5-sinf
  {
    grade: "5-sinf",
    title: "Axborot va uning turlari",
    theory: "Axborot — bizni o'rab turgan olam, undagi narsa va hodisalar haqidagi ma'lumotlar, xabarlar to'plamidir. Inson axborotni beshta sezgi a'zosi orqali qabul qiladi: ko'rish (ko'z - 80-90%), eshitish (quloq), hid bilish (burun), ta'm bilish (til) va sezish (teri). Shakliga ko'ra axborot matnli, sonli, grafikli (rasm), tovushli (audio) va video ko'rinishida bo'ladi.",
    formulaOrRule: "Axborot jarayonlari: Axborotni qabul qilish -> Saqlash -> Qayta ishlash -> Uzatish.",
    example: "Misol: Kitob o'qiyotganda inson matnli va grafik axborotni ko'rish orqali qabul qiladi va miyada saqlaydi.",
    summary: "Axborot inson hayoti va zamonaviy texnologiyalar asosi bo'lib, kompyuter uni qayta ishlovchi asosiy vositadir.",
    questions: [
      { q: "Inson eng ko'p axborotni qaysi sezgi a'zosi orqali oladi?", a: ["Ko'rish (ko'z)", "Eshitish (quloq)", "Hid bilish", "Ta'm bilish"], c: 0 },
      { q: "Axborotning asosiy jarayonlari qatorini toping:", a: ["Qabul qilish, saqlash, qayta ishlash, uzatish", "Faqat o'chirish va yozish", "Faqat chop etish", "Faqat chizish"], c: 0 },
      { q: "Musiqa eshitish qanday axborot turiga kiradi?", a: ["Tovushli (audio)", "Matnli", "Grafikli", "Sonli"], c: 0 },
      { q: "Dars jadvali qanday axborot turiga misol bo'ladi?", a: ["Matnli va jadval axboroti", "Faqat video", "Faqat audio", "Faqat hidli"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Kompyuterning asosiy va qo'shimcha qurilmalari",
    theory: "Kompyuter — axborotni qabul qilish, saqlash, qayta ishlash va uzatish uchun mo'ljallangan universal elektron qurilma. Uning 4 ta asosiy qurilmasi mavjud: Tizimli blok (System Unit), Monitor, Klaviatura va Sichqoncha. Qo'shimcha qurilmalarga printer, skaner, kolonka, mikrofon, veb-kamera va proyektor kiradi.",
    formulaOrRule: "Kiritish qurilmalari: Klaviatura, sichqoncha, skaner, mikrofon.\nChiqarish qurilmalari: Monitor, printer, dinamik (kolonka), proyektor.",
    example: "Misol: Matn kiritish uchun klaviatura (kiritish), chop etish uchun esa printer (chiqarish) ishlatiladi.",
    summary: "Asosiy qurilmalarsiz kompyuter to'liq ishlay olmaydi. Qo'shimcha qurilmalar uning imkoniyatlarini kengaytiradi.",
    questions: [
      { q: "Quyidagilardan qaysi biri kompyuterning asosiy chiqarish qurilmasi?", a: ["Monitor", "Klaviatura", "Skaner", "Mikrofon"], c: 0 },
      { q: "Qog'ozdagi matn va rasmlarni kompyuterga kirituvchi qurilma qaysi?", a: ["Skaner", "Printer", "Monitor", "Proyektor"], c: 0 },
      { q: "Kompyuterning asosiy 'miyasi' qaysi qurilma ichida joylashgan?", a: ["Tizimli blok", "Klaviatura", "Sichqoncha", "Monitor"], c: 0 },
      { q: "Qaysi biri axborot kiritish qurilmasi hisoblanadi?", a: ["Klaviatura", "Printer", "Kalonka", "Monitor"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Axborot xavfsizligi va kompyuter gigiyenasi",
    theory: "Kompyuter xonasida xavfsizlik texnikasi qoidalariga qat'iy rioya qilish shart. Simlarga va rozetkalarga tegmaslik, monitordan 50-70 sm masofada to'g'ri o'tirish, har 20-30 daqiqada ko'z mashqlarini bajarish kerak. Internetda shaxsiy ma'lumotlarni (manzil, telefon, parol) begonalarga bermaslik kiberxavfsizlikning oltin qoidasidir.",
    formulaOrRule: "Gigiyena qoidasi: Monitordan ko'zgacha masofa: 50-70 sm; Ko'z burchagi: biroz pastga qaragan (15-20°).",
    example: "Misol: 20-20-20 qoidasi: Har 20 daqiqada 20 soniya davomida 20 fut (6 metr) uzoqlikka qarab ko'zni dam oldirish.",
    summary: "Sog'liqni saqlash va virtual firibgarlardan himoyalanish uchun xavfsizlik qoidalariga doimo amal qilish lozim.",
    questions: [
      { q: "Kompyuter monitoridan ko'zgacha bo'lgan optimal masofa qancha?", a: ["50 - 70 sm", "10 - 20 sm", "2 metr", "5 sm"], c: 0 },
      { q: "Internetda begonalarga qanday ma'lumotlarni berish xavfli?", a: ["Uy manzili, telefon raqami va parollar", "Sevimli rang", "Dars jadvali mavzusi", "Ob-havo ma'lumoti"], c: 0 },
      { q: "Kompyuter qarshisida uzoq o'tirganda nima qilish kerak?", a: ["Tanaffus qilib, ko'z va jismoniy mashqlar bajarish", "Yana 5 soat o'yin o'ynash", "Monitorga yaqinroq o'tirish", "Chiroqni o'chirish"], c: 0 },
      { q: "Ochiq elektr simlari va qurilmalarning orqa tomoniga tegish mumkinmi?", a: ["Yo'q, bu hayot uchun xavfli", "Ha, bemalol", "Faqat kompyuter yoniq bo'lsa", "Faqat sichqoncha bilan"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Klaviatura va tezkor tugmalar (Hotkeys)",
    theory: "Klaviatura kompyuterga matnli va buyruqli axborot kiritishning asosiy vositasidir. U alifbo-raqamli klavishlar, funksional (F1-F12), boshqaruv (Ctrl, Alt, Shift, Win), kursor va raqamli klavishlar bloklaridan iborat. Tezkor tugmalar klaviatura yordamida ishlarni tez bajarishga xizmat qiladi.",
    formulaOrRule: "Ctrl + C (Nusxa olish), Ctrl + V (Qo'yish/Joylashtirish), Ctrl + X (Qirqib olish), Ctrl + Z (Oxirgi amalni bekor qilish), Ctrl + S (Saqlash).",
    example: "Misol: Matnni boshqa joyga ko'chirish uchun avval matn belgilanadi, Ctrl+C bosiladi, yangi joyga kursorni qo'yib Ctrl+V bosiladi.",
    summary: "Tezkor tugmalardan foydalanish kompyuterda ishlash unumdorligini 3-4 barobar oshiradi.",
    questions: [
      { q: "Matndan nusxa olish (Copy) uchun qaysi tezkor tugmalar bosiladi?", a: ["Ctrl + C", "Ctrl + V", "Ctrl + Z", "Alt + F4"], c: 0 },
      { q: "Nusxalangan matnni joylashtirish (Paste) tezkor tugmasi qaysi?", a: ["Ctrl + V", "Ctrl + P", "Ctrl + X", "Ctrl + A"], c: 0 },
      { q: "Oxirgi bajarilgan xato amalni bekor qilish (Undo) qaysi?", a: ["Ctrl + Z", "Ctrl + Y", "Ctrl + S", "Ctrl + D"], c: 0 },
      { q: "Hujjatni tezda xotiraga saqlash (Save) kombinatsiyasi:", a: ["Ctrl + S", "Ctrl + O", "Ctrl + N", "Ctrl + F"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Fayl va papkalar tizimi",
    theory: "Fayl — tashqi xotirada ma'lum bir nom bilan saqlangan baytlar to'plamidir. Har bir fayl o'z nomi va kengaytmasiga (.txt, .docx, .jpg, .mp3, .mp4) ega. Kengaytma faylning qaysi dasturda yaratilgani va uning turini bildiradi. Papka (Folder/Katalog) esa fayllarni tartibli saqlash uchun mo'ljallangan 'quti' vazifasini bajaradi.",
    formulaOrRule: "Fayl tuzilishi: [Fayl nomi].[Kengaytma] (Masalan: kitob.docx, rasm.jpg, video.mp4).",
    example: "Misol: 'manzara.png' — grafik rasm fayli, 'referat.docx' — Word matnli hujjati.",
    summary: "Papkalar yordamida daraxtsimon ierarxik tizim hosil qilinadi, bu esa kerakli ma'lumotni tez topish imkonini beradi.",
    questions: [
      { q: ".jpg va .png kengaytmali fayllar qanday turdagi fayllar?", a: ["Rasm (grafika) fayllari", "Musiqa fayllari", "Video fayllari", "Dastur kodi"], c: 0 },
      { q: "Fayllarni tartibli va tizimli saqlash uchun nima ishlatiladi?", a: ["Papka (Folder)", "Monitor", "Printer", "Klaviatura"], c: 0 },
      { q: ".mp3 kengaytmasi qanday ma'lumotni saqlaydi?", a: ["Ovoz va musiqa (Audio)", "Matnli hujjat", "Jadval", "Rasm"], c: 0 },
      { q: "Fayl nomini o'zgartirish uchun qaysi funksional klavish bosiladi?", a: ["F2", "F5", "F1", "F12"], c: 0 },
    ]
  },

  // 6-sinf
  {
    grade: "6-sinf",
    title: "Axborot o'lchov birliklari",
    theory: "Kompyuter faqat 0 va 1 (ikkilik kod) larni tushunadi. Axborotning eng kichik o'lchov birligi Bit (BInary digiT) deyiladi. 8 ta bit birlashib 1 Baytni hosil qiladi. 1 ta harf yoki belgi kompyuter xotirasida odatda 1 bayt joy egallaydi. Katta hajmdagi axborotlar uchun Kilobayt, Megabayt, Gigabayt va Terabayt ishlatiladi.",
    formulaOrRule: "1 Bayt = 8 bit\n1 KB (Kilobayt) = 1024 Bayt\n1 MB (Megabayt) = 1024 KB\n1 GB (Gigabayt) = 1024 MB\n1 TB (Terabayt) = 1024 GB",
    example: "Misol: 2 Megabaytda necha Kilobayt bor? 2 × 1024 = 2048 KB.",
    summary: "Axborot o'lchov birliklarida o'tish koeffitsiyenti 1000 emas, balki ikkining 10-darajasi bo'lgan 1024 ga tengdir.",
    questions: [
      { q: "1 Bayt necha bitdan iborat?", a: ["8 bit", "10 bit", "1024 bit", "4 bit"], c: 0 },
      { q: "1 Gigabayt (GB) necha Megabaytga (MB) teng?", a: ["1024 MB", "1000 MB", "100 MB", "512 MB"], c: 0 },
      { q: "Axborotning eng kichik o'lchov birligi nima?", a: ["Bit", "Bayt", "Kilobayt", "Gigabayt"], c: 0 },
      { q: "Xotirada 'SALOM' so'zi necha bayt joy egallaydi (1 belgi = 1 bayt)?", a: ["5 bayt (chunki 5 ta harf)", "10 bayt", "40 bayt", "1 bayt"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Operatsion tizimlar va ularning vazifalari",
    theory: "Operatsion tizim (OT) — foydalanuvchi, dasturlar va kompyuter qurilmalari o'rtasidagi muloqotni ta'minlovchi asosiy tizimli dasturiy ta'minotdir. OT kompyuter yoqilganda xotiraga yuklanadi va butun kompyuter resurslarini (protsessor, xotira, disk) boshqaradi.",
    formulaOrRule: "Mashhur OT lar: Shaxsiy kompyuterlar uchun (Windows, macOS, Linux); Smartfonlar uchun (Android, iOS).",
    example: "Misol: Windows 11 — qulay grafik interfeysga ega eng keng tarqalgan operatsion tizim.",
    summary: "Operatsion tizimsiz kompyuter shunchaki 'temir' qism bo'lib, hech qanday dasturni ishga tushirib bo'lmaydi.",
    questions: [
      { q: "Operatsion tizimning asosiy vazifasi nima?", a: ["Qurilmalar va dasturlar ishini boshqarish hamda foydalanuvchi bilan aloqa bog'lash", "Faqat kino ko'rish", "Kompyuterni elektrdan uzish", "Faqat rasm chizish"], c: 0 },
      { q: "Quyidagilardan qaysi biri mobil telefonlar operatsion tizimi?", a: ["Android", "Windows 10", "Linux Ubuntu", "MS DOS"], c: 0 },
      { q: "Ochiq kodli bepul operatsion tizim qaysi?", a: ["Linux", "Windows", "macOS", "iOS"], c: 0 },
      { q: "Kompyuterni o'chirish yoki qayta yuklash qaysi tizim orqali amalga oshiriladi?", a: ["Operatsion tizim", "Monitor", "Klaviatura", "Printer"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Matn muharriri (MS Word) va formatlash",
    theory: "Microsoft Word — turli murakkablikdagi matnli hujjatlarni yaratish, tahrirlash, bezash va chop etish uchun eng mashhur dasturdir. Unda shrift turi (Times New Roman, Arial), o'lchami, rangi, matnni tekislash (chap, markaz, o'ng, kenglik bo'yicha) va jadvallar qo'shish mumkin.",
    formulaOrRule: "Matn shrift stillari: Qalin (Bold - Ctrl+B), Qiya (Italic - Ctrl+I), Tagiga chizilgan (Underline - Ctrl+U).",
    example: "Misol: Referat sarlavhasi o'rtaga tekislanadi (Center), shrift o'lchami 16 pt va qalin (Bold) qilinadi.",
    summary: "MS Word da hujjat tayyorlashda imlo qoidalariga rioya qilish va matnni to'g'ri formatlash estetik ko'rinish beradi.",
    questions: [
      { q: "Matnni qalin (Bold) qilish uchun qaysi tezkor tugma ishlatiladi?", a: ["Ctrl + B", "Ctrl + I", "Ctrl + U", "Ctrl + K"], c: 0 },
      { q: "Word hujjatlarining standart kengaytmasi qanday bo'ladi?", a: [".docx", ".xlsx", ".pptx", ".mp3"], c: 0 },
      { q: "Matnni sahifa bo'ylab ikki chetiga teng tekislash qaysi?", a: ["Justify (Kenglik bo'yicha)", "Align Left", "Align Right", "Center"], c: 0 },
      { q: "Hujjatga rasm yoki jadval qo'shish qaysi menyu orqali bajariladi?", a: ["Vstavka (Insert)", "Glavnaya (Home)", "Fayl (File)", "Vid (View)"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Grafik muharrirlar: Rastrli va Vektorli grafika",
    theory: "Kompyuter grafikasi ikki asosiy turga bo'linadi: Rastrli va Vektorli. Rastrli grafika piksellar (mayda rangli nuqtalar) to'ridan iborat. Rasm kattalashtirilganda sifati buziladi (xiralashadi). Dasturlar: Paint, Photoshop. Kengaytmalar: .jpg, .png, .bmp. Vektorli grafika esa matematik formulalar (chiziq, nuqta, egri chiziqlar) asosida quriladi, kattalashtirilganda sifatini yo'qotmaydi. Dasturlar: CorelDraw, Adobe Illustrator.",
    formulaOrRule: "Piksel — ekrandagi tasvirning eng kichik bo'lagi. Rastr = Piksellar; Vektor = Matematik egri chiziqlar.",
    example: "Misol: Smartfon kamerasida olingan surat — rastrli grafika; Kompaniya logotipi va banneri — vektorli grafika.",
    summary: "Suratlarni qayta ishlashda rastrli, logotip va dizayn chizishda esa sifatini yo'qotmaydigan vektorli grafika tanlanadi.",
    questions: [
      { q: "Rastrli grafika nimalardan tashkil topgan?", a: ["Piksellardan (rangli nuqtalardan)", "Matematik formulalardan", "Faqat matnlardan", "Fayllardan"], c: 0 },
      { q: "Qaysi grafika turi masshtab kattalashtirilganda o'z sifatini yo'qotmaydi?", a: ["Vektorli grafika", "Rastrli grafika", "Pikselli grafika", "Foto grafika"], c: 0 },
      { q: "Adobe Photoshop dasturi asosan qaysi grafika bilan ishlaydi?", a: ["Rastrli grafika", "Vektorli grafika", "Faqat 3D grafika", "Faqat audio"], c: 0 },
      { q: "Ekrandagi tasvirning eng kichik nuqtasi nima deb ataladi?", a: ["Piksel", "Bit", "Bayt", "Kvadrat"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Internet tarmog'i va qidiruv tizimlari",
    theory: "Internet — butun dunyodagi millionlab kompyuterlarni yagona tarmoqqa birlashtiruvchi global axborot tizimidir. Veb-sahifalarni ko'rish uchun maxsus dasturlar — Brauzerlar (Google Chrome, Mozilla Firefox, Microsoft Edge) ishlatiladi. Dunyo bo'yicha axborot qidirish uchun esa Qidiruv tizimlari (Google, Yandex, Bing) xizmat qiladi.",
    formulaOrRule: "Veb-manzil tuzilishi: https://www.saytnomi.uz (http/https — protokol, www — tarmoq, .uz — domen).",
    example: "Misol: 'O'zbekiston tarixi' mavzusini qidirish uchun Google qidiruv maydoniga kalit so'zlar kiritiladi.",
    summary: "Internet orqali ta'lim olish, yangiliklar o'qish, video muloqot va bilim olish imkoniyatlari cheksizdir.",
    questions: [
      { q: "Veb-saytlarni ochish va ko'rish uchun mo'ljallangan dastur nima deyiladi?", a: ["Brauzer (Browser)", "Antivirus", "Matn muharriri", "Operatsion tizim"], c: 0 },
      { q: "Quyidagilardan qaysi biri mashhur brauzer hisoblanadi?", a: ["Google Chrome", "MS Word", "Photoshop", "Excel"], c: 0 },
      { q: "O'zbekiston milliy domen zonasi qaysi?", a: [".uz", ".com", ".ru", ".org"], c: 0 },
      { q: "Qidiruv tizimiga to'g'ri misolni toping:", a: ["Google.com", "Windows 11", "Telegram", "Paint"], c: 0 },
    ]
  },

  // 7-sinf
  {
    grade: "7-sinf",
    title: "Elektron jadvallar (MS Excel) va formulalar",
    theory: "Microsoft Excel — jadvallar tuzish, sonli ma'lumotlarni qayta ishlash, murakkab moliyaviy va matematik hisob-kitoblarni avtomatlashtirish dasturidir. Excel varag'i ustunlar (A, B, C...) va satrlardan (1, 2, 3...) iborat bo'lib, ularning kesishmasi katakcha (yacheyka) deyiladi. Har bir katakcha o'z manziliga ega (masalan: A1, B5, C10).",
    formulaOrRule: "Barcha formulalar '=' (tenglik) belgisi bilan boshlanadi. Masalan: =A1+B1, =A1*0.15.",
    example: "Misol: 5 ta sonning yig'indisini hisoblash formulasi: =SUM(A1:A5) yoki =A1+A2+A3+A4+A5.",
    summary: "Excel formulalari minglab sonlarni bir soniyada hisoblab beradi va xatolar ehtimolini yo'qotadi.",
    questions: [
      { q: "Excel dasturida har qanday formula qaysi belgidan boshlanadi?", a: ["= (tenglik)", "+ (qo'shish)", "# (panjara)", "@ (kuchukcha)"], c: 0 },
      { q: "Excelda A ustun va 5-satr kesishmasidagi katakcha manzili qanday yoziladi?", a: ["A5", "5A", "A-5", "cell5"], c: 0 },
      { q: "Bir nechta sonlarning yig'indisini topuvchi standart funksiya qaysi?", a: ["SUM (СУММ)", "AVERAGE", "COUNT", "MAX"], c: 0 },
      { q: "Excel fayllarining kengaytmasi qanday bo'ladi?", a: [".xlsx", ".docx", ".pptx", ".txt"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Excelda statistik funksiyalar va diagrammalar",
    theory: "Excelda katta hajmdagi ma'lumotlarni tahlil qilish uchun maxsus statistik funksiyalar mavjud: AVERAGE (o'rtacha arifmetik qiymat), MAX (eng katta son), MIN (eng kichik son), COUNT (raqamli kataklar soni). Sonli ma'lumotlarni ko'rgazmali va tushunarli qilish uchun esa Diagrammalar (Gistogramma, Doiraviy, Chiziqli grafiklar) chiziladi.",
    formulaOrRule: "=AVERAGE(B1:B10) — o'rtacha qiymat; =MAX(B1:B10) — maksimal qiymat; =MIN(B1:B10) — minimal qiymat.",
    example: "Misol: 10 ta o'quvchining baholaridan eng yuqorisini topish: =MAX(C2:C11).",
    summary: "Diagrammalar quruq raqamlardan ko'ra taqdimotlarda jarayonning o'sishini ancha yaqqol ko'rsatib beradi.",
    questions: [
      { q: "Berilgan kataklardagi o'rtacha qiymatni hisoblovchi funksiya qaysi?", a: ["AVERAGE (СРЗНАЧ)", "SUM", "MIN", "IF"], c: 0 },
      { q: "Eng kichik sonni aniqlovchi funksiyani toping:", a: ["MIN", "MAX", "AVERAGE", "SUM"], c: 0 },
      { q: "Jadval ma'lumotlarini grafik tarzda ko'rgazmali ko'rsatish vositasi nima?", a: ["Diagramma", "Matn", "Skript", "Fayl"], c: 0 },
      { q: "=MAX(10, 25, 5, 80, 42) funksiyaning natijasi nima bo'ladi?", a: ["80", "10", "5", "162"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Taqdimot dasturi (MS PowerPoint) va slaydlar",
    theory: "Microsoft PowerPoint — turli mavzularda taqdimotlar (prezentatsiyalar), hisobotlar va ko'rgazmali dars ishlanmalarini yaratish dasturidir. Taqdimot sahifalari Slaydlar deb ataladi. Slaydlarga matn, jadvallar, suratlar, audio, video va qiziqarli animatsiyalar qo'shish mumkin.",
    formulaOrRule: "Taqdimotni 1-slayddan boshlab to'liq ekranda namoyish qilish: F5 klavishi. Joriy slayddan namoyish: Shift + F5.",
    example: "Misol: Slaydlar dizayni uchun 3 ta rangdan oshmaslik va har bir slaydda 6-7 qatordan ko'p matn yozmaslik tavsiya etiladi.",
    summary: "Yaxshi taqdimot tinglovchilar diqqatini tortadi va mavzuni vizual tarzda tez tushunishga yordam beradi.",
    questions: [
      { q: "Taqdimotni boshidan to'liq ekranda ko'rsatish uchun qaysi tugma bosiladi?", a: ["F5", "F1", "F12", "Esc"], c: 0 },
      { q: "PowerPoint taqdimot sahifalari nima deb ataladi?", a: ["Slayd (Slide)", "Varaq", "Sahifa", "Hujjat"], c: 0 },
      { q: "PowerPoint fayllarining kengaytmasi qanday bo'ladi?", a: [".pptx", ".docx", ".xlsx", ".pdf"], c: 0 },
      { q: "Slayddagi obyektlarga harakatlanish effektini berish nima deyiladi?", a: ["Animatsiya", "Formatlash", "Chop etish", "Kengaytma"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Algoritm tushunchasi va uning xossalari",
    theory: "Algoritm — qo'yilgan maqsadga erishish yoki berilgan masalani yechish uchun ijrochi tomonidan bajarilishi lozim bo'lgan buyruqlarning aniq, ketma-ket tizimidir. Algoritm so'zi buyuk vatandoshimiz Muhammad al-Xorazmiy nomi bilan bog'liq.",
    formulaOrRule: "Algoritmning 4 ta asosiy xossasi:\n1) Aniqlik (Determinatsiyalanganlik);\n2) Tushunarlilik;\n3) Diskretlik (qadamma-qadamlik);\n4) Natijaviylik (Cheklilik) va Ommaviylik.",
    example: "Misol: Choy damlash algoritmi: 1) Choynakni chayish; 2) Choy solish; 3) Qaynagan suv quyish; 4) 5 daqiqa damlash.",
    summary: "Algoritm barcha dasturlash tillari va kompyuter dasturlarining mantiqiy asosini tashkil qiladi.",
    questions: [
      { q: "'Algoritm' atamasi qaysi buyuk alloma nomi bilan bog'liq?", a: ["Muhammad al-Xorazmiy", "Abu Ali ibn Sino", "Mirzo Ulug'bek", "Al-Farg'oniy"], c: 0 },
      { q: "Algoritm har doim chekli qadamlardan so'ng natija berishi qaysi xossasi?", a: ["Natijaviylik", "Ommaviylik", "Diskretlik", "Tushunarlilik"], c: 0 },
      { q: "Algoritmning alohida qadamlarga bo'linishi qanday ataladi?", a: ["Diskretlik", "Aniqlik", "Ommaviylik", "Natijaviylik"], c: 0 },
      { q: "Bir turdagi barcha masalalarni yecha olish xossasi nima?", a: ["Ommaviylik", "Diskretlik", "Aniqlik", "Tushunarlilik"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Algoritm turlari va Blok-sxemalar",
    theory: "Algoritmlar tuzilishiga ko'ra 3 turga bo'linadi: 1) Chiziqli algoritm (barcha buyruqlar ketma-ket bir marta bajariladi); 2) Tarmoqlanuvchi algoritm (shartga qarab u yoki bu tarmoq tanlanadi); 3) Takrorlanuvchi (siklik) algoritm (ma'lum buyruqlar bir necha marta takrorlanadi). Blok-sxema — algoritmni geometrik shakllar yordamida tasvirlash usulidir.",
    formulaOrRule: "Blok-sxema shakllari:\n- Oval (Boshlanish / Tugash)\n- Parallelogramm (Kiritish / Chiqarish)\n- To'g'ri to'rtburchak (Hisoblash / Jarayon)\n- Romb (Shart tekshirish / Tarmoqlanish).",
    example: "Misol: Agar havo yomg'irli bo'lsa (shart: Romb), soyabon ol, aks holda kepka kiy.",
    summary: "Blok-sxemalar dastur kodini yozishdan oldin uning butun mantiqiy strukturasini xatosiz chizib olish imkonini beradi.",
    questions: [
      { q: "Blok-sxemada shart tekshirish qaysi geometrik shakl bilan belgilanadi?", a: ["Romb", "To'g'ri to'rtburchak", "Oval", "Parallelogramm"], c: 0 },
      { q: "Algoritmning boshlanishi va tugallanishi qaysi shakl orqali ifodalanadi?", a: ["Oval (yoki ellips)", "Romb", "Kvadrat", "Uchburchak"], c: 0 },
      { q: "Qaysi algoritm turida buyruqlar ketma-ket, birin-ketin bajariladi?", a: ["Chiziqli algoritm", "Tarmoqlanuvchi algoritm", "Siklik algoritm", "Murakkab algoritm"], c: 0 },
      { q: "Ma'lumotlarni kiritish va chiqarish bloki qaysi shakl?", a: ["Parallelogramm", "To'g'ri to'rtburchak", "Romb", "Doira"], c: 0 },
    ]
  },

  // 8-sinf
  {
    grade: "8-sinf",
    title: "Python dasturlash tiliga kirish va sintaksis",
    theory: "Python — zamonaviy, o'qilishi oson, yuqori darajadagi va juda mashhur dasturlash tilidir. U sun'iy intellekt, ma'lumotlar tahlili, veb-dasturlash va avtomatlashtirishda keng qo'llaniladi. Python tilida kod bloklari jingalak qavslar bilan emas, balki qator boshidagi bo'sh joylar (Indentation - 4 ta bo'shliq) orqali ajratiladi.",
    formulaOrRule: "Ekranga chiqarish: print('Matn'); Foydalanuvchidan kiritish: input('Savol: ').",
    example: "Misol: ism = input('Ismingiz nima? '); print('Salom,', ism).",
    summary: "Python sodda sintaksisi va qulayligi sababli dasturlashni o'rganish uchun eng ideal birinchi tildir.",
    questions: [
      { q: "Python tilida ekranga matn yoki natija chiqaruvchi funksiya qaysi?", a: ["print()", "cout <<", "input()", "echo"], c: 0 },
      { q: "Python tilida foydalanuvchidan ma'lumot kiritish funksiyasi qaysi?", a: ["input()", "read()", "scan()", "get()"], c: 0 },
      { q: "Python fayllarining kengaytmasi qanday bo'ladi?", a: [".py", ".python", ".txt", ".exe"], c: 0 },
      { q: "Python dasturlash tili kim tomonidan yaratilgan?", a: ["Gvido van Rossum", "Bill Geyts", "Stiv Jobs", "Bjarne Straustrup"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Python'da o'zgaruvchilar va ma'lumot turlari",
    theory: "O'zgaruvchi — kompyuter tezkor xotirasidagi ma'lum bir qiymat saqlanadigan nomlangan katakcha. Python dinamik tiplashga ega, ya'ni turini o'zi avtomatik aniqlaydi. Asosiy ma'lumot turlari: int (butun sonlar: 5, -12), float (haqiqiy/o'nli sonlar: 3.14, 0.5), str (matnlar/satrlar: 'Salom'), bool (mantiqiy: True, False).",
    formulaOrRule: "Tur o'zgartirish: int('25') -> 25; str(100) -> '100'; float(5) -> 5.0; type(x) — turini aniqlaydi.",
    example: "Misol: yosh = 14 (int); narx = 12.5 (float); ism = 'Aziz' (str); talabami = True (bool).",
    summary: "Dasturda to'g'ri hisob-kitob qilish uchun har bir ma'lumotning o'z turini to'g'ri tanlash shart.",
    questions: [
      { q: "Python'da butun sonlar qaysi ma'lumot turi bilan belgilanadi?", a: ["int", "float", "str", "bool"], c: 0 },
      { q: "x = 3.14 o'zgaruvchining ma'lumot turi qaysi?", a: ["float", "int", "str", "char"], c: 0 },
      { q: "Mantiqiy (ha/yo'q) qiymatlar turi nima?", a: ["bool (True/False)", "string", "integer", "list"], c: 0 },
      { q: "'10' + '20' ifodaning Python'dagi natijasi nima bo'ladi?", a: ["'1020' (matnlar birlashadi)", "30", "200", "Xatolik"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Python'da shart operatorlari (if, elif, else)",
    theory: "Dasturda ma'lum bir shartga qarab har xil harakatlarni bajarish uchun shart operatorlari ishlatiladi. Taqqoslash amallari: == (teng), != (teng emas), > (katta), < (kichik), >= (katta yoki teng), <= (kichik yoki teng). Mantiqiy bog'lovchilar: and (va - ikkalasi ham to'g'ri bo'lishi kerak), or (yoki - kamida biri to'g'ri bo'lsa yetarli), not (inkor).",
    formulaOrRule: "if shart:\n    # shart bajarilsa\nelif boshqa_shart:\n    # boshqa shart bajarilsa\nelse:\n    # hech biri bajarilmasa",
    example: "Misol:\nball = 85\nif ball >= 90: print('A')\nelif ball >= 80: print('B')\nelse: print('C')",
    summary: "Shart operatorlari dasturlarga mantiqiy qarorlar qabul qilish qobiliyatini beradi.",
    questions: [
      { q: "Python'da tenglikni tekshirish amali qanday yoziladi?", a: ["==", "=", "!=", "<="], c: 0 },
      { q: "Bir nechta ketma-ket shartlarni tekshirish uchun qaysi kalit so'z ishlatiladi?", a: ["elif", "else if", "then", "switch"], c: 0 },
      { q: "Agar x = 10 bo'lsa, (x > 5 and x < 20) shartining qiymati nima?", a: ["True", "False", "None", "Error"], c: 0 },
      { q: "Teng emaslik amali qanday belgilanadi?", a: ["!=", "<>", "=!", "not="], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Python'da takrorlanish operatorlari (for va while sikllari)",
    theory: "Bir xil yoki o'xshash amallarni ko'p marta takrorlash uchun sikllar (loop) ishlatiladi. for sikli ma'lum bir sanoqli oraliqda yoki ketma-ketlikda (ro'yxat, satr) takrorlash uchun qo'llaniladi. range(start, stop, step) funksiyasi sonlar ketma-ketligini hosil qiladi. while sikli esa berilgan shart to'g'ri (True) bo'lib turguniga qadar takrorlanadi.",
    formulaOrRule: "for i in range(5): print(i) -> 0, 1, 2, 3, 4 sonlarini chiqaradi.\nbreak — siklni to'xtatadi, continue — keyingi qadamga o'tadi.",
    example: "Misol: 1 dan 10 gacha sonlar yig'indisi:\nyigindi = 0\nfor x in range(1, 11):\n    yigindi += x\nprint(yigindi) # Natija: 55",
    summary: "Sikllar yordamida millionlab hisob-kitoblar soniyaning ichida avtomatlashtiriladi.",
    questions: [
      { q: "range(1, 6) funksiyasi qaysi sonlarni o'z ichiga oladi?", a: ["1, 2, 3, 4, 5", "1, 2, 3, 4, 5, 6", "0, 1, 2, 3, 4, 5", "1 dan 6 gacha faqat juft"], c: 0 },
      { q: "Siklni muddatidan oldin to'xtatib chiqish uchun qaysi buyruq yoziladi?", a: ["break", "continue", "stop", "exit"], c: 0 },
      { q: "Shartga asoslangan cheksiz yoki shartli sikl operatori qaysi?", a: ["while", "for", "if", "loop"], c: 0 },
      { q: "Siklda joriy qadamni tashlab o'tib keyingisiga o'tish buyrug'i:", a: ["continue", "break", "pass", "return"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Python'da ro'yxatlar (List) va asosiy metodlar",
    theory: "Ro'yxat (List) — bir nechta elementlarni bitta o'zgaruvchida tartibli saqlash imkonini beruvchi ma'lumotlar to'plami. Ro'yxat elementlari to'rtburchak qavslar [] ichida vergul bilan yoziladi. Elementlar 0 dan boshlab indekslanadi (0-indeks birinchi element). Ro'yxat elementlarini o'zgartirish, qo'shish va o'chirish mumkin.",
    formulaOrRule: "Metodlar: .append(x) (oxiriga qo'shish); .pop(i) (o'chirish); .sort() (saralash); len(list) (uzunligini topish).",
    example: "Misol:\nmevalar = ['olma', 'anor', 'banan']\nmevalar.append('uzum')\nprint(mevalar[0]) # 'olma'\nprint(len(mevalar)) # 4",
    summary: "Ro'yxatlar dasturlashda ma'lumotlar bazasi, foydalanuvchilar ro'yxati va massivlar bilan ishlashda eng ko'p ishlatiladigan vositadir.",
    questions: [
      { q: "Ro'yxatning birinchi elementining indeksi necha bilan boshlanadi?", a: ["0", "1", "-1", "Aniqlanmagan"], c: 0 },
      { q: "Ro'yxat oxiriga yangi element qo'shuvchi metod qaysi?", a: [".append()", ".add()", ".insert()", ".push()"], c: 0 },
      { q: "a = [10, 20, 30] bo'lsa, len(a) nimaga teng?", a: ["3", "2", "30", "60"], c: 0 },
      { q: "Ro'yxat elementlarini o'sish tartibida saralovchi metod qaysi?", a: [".sort()", ".reverse()", ".clear()", ".index()"], c: 0 },
    ]
  }
];

// 20 Full Lessons for Fizika (6-8 sinflar)
export const FIZIKA_LESSONS: GradeLessonData[] = [
  // 6-sinf
  {
    grade: "6-sinf",
    title: "Fizika fani va o'lchov asboblari",
    theory: "Fizika — tabiatdagi eng umumiy qonuniyatlar, moddalar tuzilishi va harakat shakllarini o'rganuvchi asosiy tabiiy fandir. Tabiatdagi har qanday o'zgarish (yorug'lik tarqalishi, jism qizishi, yiqilishi) fizik hodisa deyiladi. Fizik kattaliklarni aniqlash uchun o'lchash asboblari (chizg'ich, termometr, tarozi, sekundomer) ishlatiladi.",
    formulaOrRule: "Xalqaro Birliklar Sistemasi (SI): Uzunlik — metr (m); Vaqt — sekund (s); Massa — kilogramm (kg).",
    example: "Misol: Xona haroratini termometr bilan o'lchab, 22 °C ekanligini aniqlash — bu fizik tajriba va o'lchashdir.",
    summary: "Fizika olamni tushunish, texnologiya, avtomobillar, samolyotlar va kosmik kemalarni yaratish poydevoridir.",
    questions: [
      { q: "SI xalqaro birliklar sistemasida vaqtning asosiy birligi qaysi?", a: ["Sekund (s)", "Minut (min)", "Soat (h)", "Sutka"], c: 0 },
      { q: "Jismning massasini aniqlash uchun qaysi asbob ishlatiladi?", a: ["Tarozi", "Termometr", "Sekundomer", "Dinamometr"], c: 0 },
      { q: "Quyidagilardan qaysi biri fizik hodisaga misol bo'ladi?", a: ["Muzning erishi va suvga aylanishi", "She'r yodlash", "Rasm chizish", "Pul sanash"], c: 0 },
      { q: "SI sistemasida uzunlikning asosiy o'lchov birligi nima?", a: ["Metr (m)", "Santimetr (sm)", "Kilometr (km)", "Millimetr (mm)"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Moddaning atom-molekulyar tuzilishi va diffuziya",
    theory: "Barcha moddalar uzluksiz emas, balki juda mayda zarrachalar — molekulalar va atomlardan tashkil topgan. Zarrachalar doimiy va tartibsiz harakatda bo'ladi, ularning orasida o'zaro tortishish va itarishish kuchlari mavjud. Bir modda zarrachalarining ikkinchi modda zarrachalari orasidagi bo'shliqlarga o'z-o'zidan kirib borishi diffuziya hodisasi deyiladi.",
    formulaOrRule: "Diffuziya tezligi haroratga bog'liq: Harorat qancha yuqori bo'lsa, molekulalar tezligi va diffuziya shuncha tezlashadi.",
    example: "Misol: Bir stakan issiq suvga qand tashlansa, choy qoshiqsiz ham tezda erib, suvning hamma joyiga shirin ta'm tarqaladi.",
    summary: "Diffuziya gazlarda juda tez, suyuqliklarda sekinroq, qattiq jismlarda esa juda sekin (yillab) kechadi.",
    questions: [
      { q: "Modda zarrachalarining bir-biriga o'z-o'zidan aralashib ketishi nima deyiladi?", a: ["Diffuziya", "Inersiya", "Konveksiya", "Deformatsiya"], c: 0 },
      { q: "Harorat ko'tarilganda diffuziya tezligi qanday o'zgaradi?", a: ["Tezlashadi", "Sekinlashadi", "O'zgarmaydi", "To'xtaydi"], c: 0 },
      { q: "Diffuziya qaysi modda holatida eng tez sodir bo'ladi?", a: ["Gazlarda", "Suyuqliklarda", "Qattiq jismlarda", "Muzda"], c: 0 },
      { q: "Moddaning kimyoviy xossalarini o'zida saqlab qoluvchi eng kichik zarracha nima?", a: ["Molekula", "Atom yadrosi", "Elektron", "Piksel"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Moddaning 3 xil agregat holati: qattiq, suyuq, gaz",
    theory: "Tabiatda moddalar 3 ta asosiy agregat holatda uchraydi: Qattiq, Suyuq va Gaz (to'rtinchisi Plazma). Qattiq jismlar o'z shakli va hajmini saqlaydi, molekulalari kristall panjara hosil qiladi. Suyuqliklar hajmini saqlaydi, lekin shaklini oson o'zgartiradi (quygan idish shaklini oladi). Gazlar esa na shaklini, na hajmini saqlaydi — butun berilgan hajmni to'ldiradi.",
    formulaOrRule: "Holat o'zgarishlari: Erish (Qattiq -> Suyuq), Qotish (Suyuq -> Qattiq), Bug'lanish (Suyuq -> Gaz), Kondensatsiya (Gaz -> Suyuq).",
    example: "Misol: Suvning 3 holati: Muz (qattiq), Suv (suyuq) va Suv bug'i (gaz).",
    summary: "Moddaning holati molekulalarning joylashuvi, harakat erkinligi va haroratga bevosita bog'liqdir.",
    questions: [
      { q: "Qaysi holatda modda o'z shaklini ham, hajmini ham saqlaydi?", a: ["Qattiq holatda", "Suyuq holatda", "Gaz holatida", "Plazmada"], c: 0 },
      { q: "Suyuqliklarning asosiy xususiyati qaysi?", a: ["Hajmini saqlaydi, lekin shaklini o'zgartiradi", "Shaklini saqlaydi", "Butun xonani to'ldiradi", "Siqiluvchan"], c: 0 },
      { q: "Gazsimon moddalarning molekulalari qanday joylashgan?", a: ["Bir-biridan uzoqda va erkin tartibsiz harakatda", "Juda qattiq jipslashgan", "Faqat bir joyda tebranadi", "Qator bo'lib tizilgan"], c: 0 },
      { q: "Muzning erib suvga aylanish jarayoni nima deyiladi?", a: ["Erish", "Qaynash", "Kondensatsiya", "Qotish"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Mexanik harakat, trayektoriya va yo'l",
    theory: "Vaqt o'tishi bilan jismning boshqa jismlarga nisbatan fazodagi vaziyatining o'zgarishi mexanik harakat deyiladi. Harakatlanayotgan jism chizgan chiziq trayektoriya deyiladi. Trayektoriya shakliga ko'ra to'g'ri chiziqli va egri chiziqli bo'ladi. Trayektoriyaning uzunligi bosib o'tilgan yo'l (s) deyiladi va skalyar kattalik hisoblanadi.",
    formulaOrRule: "Yo'l (s) — uzunlik o'lchovi bo'lib, birligi metr (m) dir. Harakat nisbiydir.",
    example: "Misol: Poyezdda ketayotgan yo'lovchi vagonga nisbatan tinch, lekin Yerga nisbatan harakatda bo'ladi.",
    summary: "Harakatni o'rganishda har doim sanoq jismi (nimaga nisbatan harakatlanayotgani) aniq tanlanishi shart.",
    questions: [
      { q: "Jism harakati davomida qoldirgan izi (chizig'i) nima deyiladi?", a: ["Trayektoriya", "Tezlik", "Yo'l", "Vektor"], c: 0 },
      { q: "Trayektoriyaning uzunligi nima deb ataladi?", a: ["Bosib o'tilgan yo'l", "Ko'chish", "Tezlanish", "Vaqt"], c: 0 },
      { q: "Avtomobilning to'g'ri tekis yo'ldagi harakati qanday harakat?", a: ["To'g'ri chiziqli harakat", "Aylanma harakat", "Tebranma harakat", "Egri chiziqli"], c: 0 },
      { q: "Harakatning nisbiyligi nimani anglatadi?", a: ["Jismning harakati qaysi sanoq jismiga nisbatan qaralayotganiga bog'liqligini", "Hamma narsa tinch turishini", "Faqat tezlik o'zgarishini", "Yo'l doim 0 bo'lishini"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Tezlik tushunchasi va o'lchov birliklari",
    theory: "Jismning vaqt birligi ichida bosib o'tgan yo'lini ko'rsatuvchi fizik kattalik tezlik (v) deyiladi. Agar jism teng vaqt oraliqlarida bir xil yo'l bosib o'tsa, bunday harakat tekis harakat deyiladi. Notekis harakatda esa o'rtacha tezlik hisoblanadi.",
    formulaOrRule: "Tezlik formulasi: v = s / t (Tezlik = Yo'l / Vaqt).\nYo'l: s = v × t; Vaqt: t = s / v.\nBirligi: m/s (metr taqsim sekund). O'tish: 1 m/s = 3.6 km/soat (yoki 36 km/soat = 10 m/s).",
    example: "Misol: Avtomobil 2 soatda 140 km yo'l bosdi. Uning tezligi: v = 140 / 2 = 70 km/soat.",
    summary: "Tezlik harakatning qanchalik tez yoki sekin kechayotganini miqdoriy ifodalovchi asosiy kattalikdir.",
    questions: [
      { q: "Tezlikni topish formulasini ko'rsating:", a: ["v = s / t", "v = s × t", "v = t / s", "v = s + t"], c: 0 },
      { q: "SI sistemasida tezlikning asosiy birligi qaysi?", a: ["m/s (metr/sekund)", "km/soat", "sm/minut", "m/soat"], c: 0 },
      { q: "Piyoda 15 metr yo'lni 3 sekundda bosib o'tdi. Uning tezligini toping:", a: ["5 m/s", "45 m/s", "12 m/s", "0.2 m/s"], c: 0 },
      { q: "72 km/soat tezlik necha m/s ga teng bo'ladi?", a: ["20 m/s (chunki 72 / 3.6 = 20)", "72 m/s", "10 m/s", "25 m/s"], c: 0 },
    ]
  },

  // 7-sinf
  {
    grade: "7-sinf",
    title: "Jismning massasi va moddaning zichligi",
    theory: "Massa (m) — jismning inertlik va gravitatsion xususiyatlarini ifodalovchi skalyar kattalikdir (birligi: kg). Bir xil hajmdagi turli moddalar har xil massaga ega bo'ladi. Birlik hajmdagi moddaning massasini ko'rsatuvchi fizik kattalik zichlik (ρ - ro) deyiladi.",
    formulaOrRule: "Zichlik formulasi: ρ = m / V (Zichlik = Massa / Hajm).\nMassa: m = ρ × V; Hajm: V = m / ρ.\nBirligi: kg/m³ yoki g/sm³ (1 g/sm³ = 1000 kg/m³). Suvning zichligi: 1000 kg/m³.",
    example: "Misol: Hajmi 2 m³ bo'lgan toshning massasi 5000 kg bo'lsa, zichligi: ρ = 5000 / 2 = 2500 kg/m³.",
    summary: "Zichlik moddaning turiga bog'liq o'zgarmas kattalik bo'lib, jismning yengil yoki og'irligini belgilaydi.",
    questions: [
      { q: "Moddaning zichligini topish formulasi qaysi?", a: ["ρ = m / V", "ρ = m × V", "ρ = V / m", "ρ = m + V"], c: 0 },
      { q: "Toza suvning zichligi qanchaga teng?", a: ["1000 kg/m³ (yoki 1 g/sm³)", "500 kg/m³", "100 kg/m³", "800 kg/m³"], c: 0 },
      { q: "Massasi 800 kg, hajmi 1 m³ bo'lgan kerosinning zichligi nechaga teng?", a: ["800 kg/m³", "400 kg/m³", "8000 kg/m³", "1.25 kg/m³"], c: 0 },
      { q: "SI xalqaro birliklar sistemasida zichlik birligi nima?", a: ["kg/m³", "g/sm³", "kg/litr", "tonna/m³"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Kuch va dinamometr. Og'irlik kuchi",
    theory: "Jismlarning bir-biriga o'zaro mexanik ta'siri o'lchovi kuch (F) deyiladi. Kuch — vektor kattalik bo'lib, uning son qiymati, yo'nalishi va qo'yilish nuqtasi mavjud. Kuchni o'lchovchi asbob dinamometr deyiladi. Yerning barcha jismlarni o'z markaziga tortish kuchi og'irlik kuchi (F_og') deb ataladi.",
    formulaOrRule: "Og'irlik kuchi: F = m × g (bunda m — massa, g ≈ 9.8 N/kg — erkin tushish tezlanishi).\nKuch birligi: Nyuton (N). 1 N = 1 kg·m/s².",
    example: "Misol: Massasi 50 kg bo'lgan o'quvchiga ta'sir qiluvchi og'irlik kuchi: F = 50 × 9.8 = 490 N (yoki g≈10 bo'lsa 500 N).",
    summary: "Og'irlik kuchi har doim vertikal pastga — Yer markaziga qarab yo'nalgan bo'ladi.",
    questions: [
      { q: "Kuchni o'lchaydigan asbob nima deb ataladi?", a: ["Dinamometr", "Barometr", "Manometr", "Termometr"], c: 0 },
      { q: "Kuchning asosiy o'lchov birligi qaysi?", a: ["Nyuton (N)", "Joul (J)", "Paskal (Pa)", "Vatt (W)"], c: 0 },
      { q: "Og'irlik kuchi qaysi formula orqali hisoblanadi?", a: ["F = m × g", "F = m / g", "F = k × x", "F = m × v"], c: 0 },
      { q: "Massasi 5 kg bo'lgan jismga ta'sir qiluvchi og'irlik kuchini toping (g = 10 N/kg):", a: ["50 N", "5 N", "0.5 N", "500 N"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Elastiklik kuchi va Guk qonuni",
    theory: "Tashqi kuch ta'sirida jism shakli va o'lchamlarining o'zgarishi deformatsiya deyiladi. Deformatsiya to'xtagach o'z holiga qaytsa elastik, qaytmasa plastik deyiladi. Deformatsiyalangan jismda uni dastlabki holatiga qaytarishga intiluvchi kuch elastiklik kuchi (F_el) deyiladi. Ingliz fizigi Robert Guk prujina cho'zilishi va kuch orasidagi qonunni yaratgan.",
    formulaOrRule: "Guk qonuni: F_el = -k × Δl (k — prujinaning bikrligi (N/m), Δl (yoki x) — mutlaq uzayish miqdori).",
    example: "Misol: Bikrligi k = 100 N/m bo'lgan prujina 0.05 m (5 sm) ga cho'zilsa: F = 100 × 0.05 = 5 N.",
    summary: "Guk qonuni dinamometrlar ishlashining va barcha prujinali mexanizmlarning asosiy tamoyilidir.",
    questions: [
      { q: "Guk qonunining to'g'ri formulasini toping:", a: ["F = k × Δl", "F = m × a", "F = p × S", "F = m × g"], c: 0 },
      { q: "Prujinaning bikrligi (k) qaysi birlikda o'lchanadi?", a: ["N/m (Nyuton taqsim metr)", "N×m", "Joul", "Paskal"], c: 0 },
      { q: "Tashqi kuch to'xtagach o'z shaklini to'liq tiklaydigan deformatsiya qaysi?", a: ["Elastik deformatsiya", "Plastik deformatsiya", "Qoldiq deformatsiya", "Buzilish"], c: 0 },
      { q: "Bikrligi 200 N/m bo'lgan prujinani 0.1 m ga cho'zish uchun qancha kuch kerak?", a: ["20 N (chunki 200 × 0.1 = 20)", "2000 N", "2 N", "0.2 N"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Ishqalanish kuchi va uning turlari",
    theory: "Bir jism ikkinchi jism sirtida harakatlanganda yoki harakatga intilganda ularning tutashish sirtida vujudga kelib, harakatga to'sqinlik qiluvchi kuch ishqalanish kuchi (F_ishq) deyiladi. 3 ta turi bor: Tinchlikdagi ishqalanish, Sirpanish ishqalanishi va Dumalanish ishqalanishi. Dumalanish ishqalanishi sirpanishdan ancha kichikdir (g'ildiraklar shuning uchun ixtiro qilingan).",
    formulaOrRule: "Sirpanish ishqalanish kuchi: F_ishq = μ × N (μ — ishqalanish koeffitsiyenti, N — tayanchning reaksiya kuchi).",
    example: "Misol: Qishda muz ustiga qum sepilishi ishqalanishni oshirish va sirpanishni kamaytirish uchundir.",
    summary: "Ishqalanish bo'lmaganda biz yura olmasdik, kiyimlar tutilmasdi, lekin u texnikada detallarni yeyilishiga sabab bo'ladi.",
    questions: [
      { q: "Qaysi ishqalanish kuchi eng kichik qiymatga ega?", a: ["Dumalanish ishqalanishi", "Sirpanish ishqalanishi", "Tinchlikdagi ishqalanish", "Hammasi bir xil"], c: 0 },
      { q: "Mashina detallari orasidagi zararli ishqalanishni kamaytirish uchun nima qilinadi?", a: ["Moy (lubrikant) quyiladi va podshipniklar o'rnatiladi", "Qum sepiladi", "Suv sepiladi", "Tezroq haydaladi"], c: 0 },
      { q: "Inson muz ustida yurganda nima uchun yiqilib tushishi oson?", a: ["Muzda ishqalanish kuchi juda kichik bo'lgani uchun", "Muz og'ir bo'lgani uchun", "Inersiya yo'qolgani uchun", "Gravitatsiya kuchaygani uchun"], c: 0 },
      { q: "Sirpanish ishqalanish kuchi formulasi qaysi?", a: ["F = μ × N", "F = k × x", "F = m × g", "F = p / S"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Bosim tushunchasi va qattiq jismlar bosimi",
    theory: "Sirtga tik ravishda ta'sir etuvchi kuchning shu sirt yuziga nisbati bilan o'lchanadigan fizik kattalik bosim (P) deyiladi. Kuch qancha katta va yuza qancha kichik bo'lsa, bosim shuncha yuqori bo'ladi. Fransuz olimi Blez Paskal sharafiga bosim birligi Paskal (Pa) deb atalgan.",
    formulaOrRule: "Bosim formulasi: P = F / S (Bosim = Kuch / Yuza).\nKuch: F = P × S; Yuza: S = F / P.\nBirligi: 1 Pa = 1 N/m². 1 kPa = 1000 Pa, 1 MPa = 1 000 000 Pa.",
    example: "Misol: Qorda piyoda yursa botadi, lekin chang'i kiysa yuzasi (S) kattalashgani sababli bosim kamayadi va botmaydi.",
    summary: "Pichoqni o'tkirlashda yuza kichraytirilib bosim oshiriladi; og'ir traktorlarda esa yuzani kengaytirish uchun gusenitsa o'rnatiladi.",
    questions: [
      { q: "Bosimni hisoblash formulasini ko'rsating:", a: ["P = F / S", "P = F × S", "P = S / F", "P = F + S"], c: 0 },
      { q: "SI sistemasida bosim birligi nima?", a: ["Paskal (Pa)", "Nyuton (N)", "Joul (J)", "Vatt (W)"], c: 0 },
      { q: "Sirt yuzasi 2 barobar kichraytirilsa, bosim qanday o'zgaradi?", a: ["2 barobar ortadi", "2 barobar kamayadi", "O'zgarmaydi", "4 barobar kamayadi"], c: 0 },
      { q: "100 N kuch 2 m² yuzaga tik ta'sir qilsa, hosil bo'lgan bosimni toping:", a: ["50 Pa", "200 Pa", "100 Pa", "25 Pa"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Suyuqlik va gazlar bosimi. Paskal qonuni",
    theory: "Suyuqlik va gaz molekulalarining harakatchanligi tufayli ularga berilgan tashqi bosim barcha yo'nalishlarda o'zgarishsiz teng uzatiladi. Bu qonun Paskal qonuni deyiladi. Suyuqlikning o'z og'irligi hisobiga hosil bo'lgan bosim gidrostatik bosim deyiladi va u chuqurlik hamda suyuqlik zichligiga bog'liq.",
    formulaOrRule: "Gidrostatik bosim formulasi: P = ρ × g × h (ρ — zichlik, g — erkin tushish tezlanishi, h — suyuqlik ustuni balandligi).",
    example: "Misol: Suv tubiga (h = 10 m) tushganda gidrostatik bosim: P = 1000 × 10 × 10 = 100 000 Pa (100 kPa ≈ 1 atmosfera).",
    summary: "Paskal qonuniga asoslanib gidravlik press, avtomobil tormozlari va gidravlik domkratlar ishlaydi.",
    questions: [
      { q: "Paskal qonuni nimani ta'riflaydi?", a: ["Suyuqlik va gazlarga berilgan bosim barcha yo'nalishlarda teng uzatiladi", "Og'irlik kuchi yo'qolishini", "Harakat tezligini", "Issiqlik tarqalishini"], c: 0 },
      { q: "Gidrostatik bosim formulasini toping:", a: ["P = ρ × g × h", "P = F / S", "P = m × g", "P = v × t"], c: 0 },
      { q: "Suv havzasining tubiga tushgan sari gidrostatik bosim qanday o'zgaradi?", a: ["Chuqurlik ortgani sari ortadi", "Kamayadi", "O'zgarmaydi", "Nolga tenglashadi"], c: 0 },
      { q: "Gidravlik press qaysi qonun asosida ishlaydi?", a: ["Paskal qonuni", "Guk qonuni", "Om qonuni", "Nyuton qonuni"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Arximed kuchi va jismlarning suzish shartlari",
    theory: "Suyuqlik yoki gazga botirilgan jismga pastdan yuqoriga yo'nalgan itaruvchi kuch ta'sir qiladi. Bu kuch qadimgi olim Arximed sharafiga Arximed kuchi (F_A) deyiladi. Arximed kuchi jism siqib chiqargan suyuqlik og'irligiga teng.",
    formulaOrRule: "Arximed kuchi: F_A = ρ_suyuqlik × g × V_botgan.\nSuzish shartlari:\n1) ρ_jism < ρ_suyuqlik (F_A > F_og') — jism suzib chiqadi (qalqiydi);\n2) ρ_jism = ρ_suyuqlik (F_A = F_og') — jism suyuqlik ichida muallaq turadi;\n3) ρ_jism > ρ_suyuqlik (F_A < F_og') — jism cho'kadi.",
    example: "Misol: Yog'ochning zichligi suvnikidan kichik bo'lgani uchun u suvda suzadi, temir mix esa cho'kadi.",
    summary: "Arximed qonuni asosida ulkan po'lat kemalar va suvosti qayiqlari okeanlarda suzadi.",
    questions: [
      { q: "Arximed kuchi qaysi formula orqali hisoblanadi?", a: ["F_A = ρ_s × g × V_b", "F = m × g", "P = ρ × g × h", "F = k × x"], c: 0 },
      { q: "Jism qachon suyuqlik tubiga cho'kadi?", a: ["Jism zichligi suyuqlik zichligidan katta bo'lsa (ρ_j > ρ_s)", "Jism zichligi kichik bo'lsa", "F_A katta bo'lsa", "Har doim"], c: 0 },
      { q: "Arximed kuchi qaysi tomonga yo'nalgan bo'ladi?", a: ["Vertikal yuqoriga (itaruvchi)", "Vertikal pastga", "Gorizontal", "Ixtiyoriy"], c: 0 },
      { q: "Kema suvdan daryoga o'tganda (chuchuk suv zichligi kamroq) botish chuqurligi qanday o'zgaradi?", a: ["Biroz ko'proq botadi", "Yuqoriga ko'tariladi", "O'zgarmaydi", "Cho'kib ketadi"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Mexanik ish va quvvat",
    theory: "Jismga kuch ta'sir etib, u kuch yo'nalishida ma'lum masofaga ko'chsa, mexanik ish (A) bajariladi. Agar kuch ta'sir etsa-yu, jism qo'zg'almasa (s = 0), ish bajarilmaydi (A = 0). Vaqt birligi ichida bajarilgan ishni ifodalovchi kattalik quvvat (N) deyiladi.",
    formulaOrRule: "Mexanik ish: A = F × s (Ish = Kuch × Masofa). Birligi: Joul (J). 1 J = 1 N·m.\nQuvvat: N = A / t (Quvvat = Ish / Vaqt). Birligi: Vatt (W). 1 W = 1 J/s. (1 kVt = 1000 W).",
    example: "Misol: 50 N kuch bilan aravachani 10 metr surishda bajarilgan ish: A = 50 × 10 = 500 J.",
    summary: "Quvvat ishning qanchalik tez bajarilishini bildiradi. Dvigatellar quvvati Vatt yoki Ot kuchi bilan baholanadi.",
    questions: [
      { q: "Mexanik ishning asosiy o'lchov birligi qaysi?", a: ["Joul (J)", "Vatt (W)", "Nyuton (N)", "Paskal (Pa)"], c: 0 },
      { q: "Quvvatni hisoblash formulasini toping:", a: ["N = A / t", "N = A × t", "N = F × s", "N = m × g"], c: 0 },
      { q: "100 J ish 5 sekundda bajarilsa, quvvat nechaga teng?", a: ["20 W", "500 W", "200 W", "10 W"], c: 0 },
      { q: "Agar jismga kuch ta'sir qilsa, lekin jism qimirlamasa, bajarilgan ish nimaga teng?", a: ["0 ga teng", "100 J", "Cheksiz", "Kuchga teng"], c: 0 },
    ]
  },

  // 8-sinf
  {
    grade: "8-sinf",
    title: "Energiya turlari: Kinetik va potensial energiya",
    theory: "Jismning ish bajara olish qobiliyati energiya (E) deyiladi. Birligi Joul (J). Mexanik energiya ikki turga bo'linadi: 1) Kinetik energiya (E_k) — harakatlanayotgan jism energiyasi; 2) Potensial energiya (E_p) — o'zaro ta'sirlashuvchi jismlar yoki ularning qismlari joylashuviga bog'liq energiya (masalan, balandlikka ko'tarilgan jism yoki siqilgan prujina).",
    formulaOrRule: "Kinetik energiya: E_k = (m × v²) / 2.\nPotensial energiya: E_p = m × g × h.\nEnergiyaning saqlanish qonuni: To'liq mexanik energiya (E = E_k + E_p) o'zgarmasdir.",
    example: "Misol: Massasi 2 kg, tezligi 4 m/s bo'lgan to'pning kinetik energiyasi: E_k = (2 × 4²) / 2 = 16 J.",
    summary: "Energiya yo'qdan bor bo'lmaydi va bordan yo'q bo'lmaydi, faqat bir turdan ikkinchi turga aylanadi.",
    questions: [
      { q: "Kinetik energiyaning hisoblash formulasi qaysi?", a: ["E_k = (m × v²) / 2", "E_p = m × g × h", "E = F × s", "E = m × c²"], c: 0 },
      { q: "Balandlikka ko'tarilgan jism qanday energiyaga ega bo'ladi?", a: ["Potensial energiya", "Faqat kinetik energiya", "Elektr energiya", "Yorug'lik energiyasi"], c: 0 },
      { q: "Jismning tezligi 2 barobar oshsa, kinetik energiyasi necha barobar ortadi?", a: ["4 barobar (chunki v²)", "2 barobar", "8 barobar", "O'zgarmaydi"], c: 0 },
      { q: "Mexanik energiyaning saqlanish qonuni nimani ifodalaydi?", a: ["Yopiq sistemada to'liq mexanik energiya o'zgarmas qoladi", "Energiya yo'qolib ketadi", "Faqat kinetik energiya saqlanadi", "Harakat to'xtaydi"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Issiqlik miqdori va solishtirma issiqlik sig'imi",
    theory: "Jism qizdirilganda oladigan yoki soviganda atrofga beradigan energiya issiqlik miqdori (Q) deyiladi. 1 kg moddani 1 °C ga qizdirish uchun kerak bo'ladigan issiqlik miqdori solishtirma issiqlik sig'imi (c) deb ataladi (birligi: J/(kg·°C)). Suv juda katta issiqlik sig'imiga ega (c = 4200 J/(kg·°C)).",
    formulaOrRule: "Issiqlik miqdori formulasi: Q = c × m × (t₂ - t₁) = c × m × Δt.\n(c — solishtirma issiqlik sig'imi, m — massa, Δt — harorat o'zgarishi).",
    example: "Misol: 2 kg suvni 10 °C dan 30 °C gacha qizdirish uchun: Q = 4200 × 2 × (30 - 10) = 4200 × 2 × 20 = 168 000 J = 168 kJ.",
    summary: "Suvning issiqlik sig'imi kattaligi sababli dengiz va okeanlar iqlimni yumshatib turadi.",
    questions: [
      { q: "Issiqlik miqdorini topish formulasini ko'rsating:", a: ["Q = c × m × Δt", "Q = m × v²", "Q = I × U × t", "Q = F × s"], c: 0 },
      { q: "Suvning solishtirma issiqlik sig'imi qanchaga teng?", a: ["4200 J/(kg·°C)", "1000 J/(kg·°C)", "500 J/(kg·°C)", "2100 J/(kg·°C)"], c: 0 },
      { q: "SI sistemasida issiqlik miqdori qaysi birlikda o'lchanadi?", a: ["Joul (J)", "Kaloriya", "Gradus", "Vatt"], c: 0 },
      { q: "1 kg jismni 1 °C ga qizdirish uchun kerak bo'lgan issiqlik nima deyiladi?", a: ["Solishtirma issiqlik sig'imi", "Ichki energiya", "Harorat", "Erish issiqligi"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Elektr zaryadi va Kulon qonuni",
    theory: "Tabiatda ikki turdagi elektr zaryadi mavjud: Musbat (+) va Manfiy (-). Bir xil ishorali zaryadlar bir-birini itaradi, har xil ishorali zaryadlar esa tortadi. Zaryad birligi Kulon (C). Fransuz fizigi Sharl Kulon tinch turgan ikki nuqtaviy zaryad orasidagi o'zaro ta'sir kuchini aniqlagan.",
    formulaOrRule: "Kulon qonuni: F = k × (|q₁| × |q₂|) / r²\n(k = 9×10⁹ N·m²/C² — proporsionallik koeffitsiyenti, q₁, q₂ — zaryadlar miqdori, r — oralaridagi masofa).",
    example: "Misol: Zaryadlar orasidagi masofa (r) 2 barobar oshirilsa, ularning o'zaro ta'sir kuchi 4 barobar kamayadi (chunki r²).",
    summary: "Elektr zaryadi materiyaning eng muhim xossasi bo'lib, atomlar va barcha elektronika unga tayanadi.",
    questions: [
      { q: "Bir xil ishorali zaryadlar (masalan + va +) bir-biriga qanday ta'sir qiladi?", a: ["Bir-birini itaradi", "Bir-birini tortadi", "Ta'sir qilmaydi", "Neytrallanadi"], c: 0 },
      { q: "SI sistemasida elektr zaryadining birligi qaysi?", a: ["Kulon (C)", "Amper (A)", "Volt (V)", "Om (Ω)"], c: 0 },
      { q: "Kulon qonuni formulasini toping:", a: ["F = k × (|q₁| × |q₂|) / r²", "F = m × g", "I = U / R", "F = G × (m₁m₂)/r²"], c: 0 },
      { q: "Zaryadlar orasidagi masofa 3 marta oshirilsa, ta'sir kuchi qanday o'zgaradi?", a: ["9 marta kamayadi", "3 marta kamayadi", "9 marta ortadi", "O'zgarmaydi"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Elektr toki va zanjir qismi uchun Om qonuni",
    theory: "Elektr zaryadlangan zarrachalarning tartibli (yo'naltirilgan) harakati elektr toki deyiladi. Tok hosil bo'lishi uchun erkin zaryadlar, elektr maydoni va berk zanjir bo'lishi shart. Tok kuchi (I) — Amperda (A), Kuchlanish (U) — Voltda (V), Qarshilik (R) — Omda (Ω) o'lchanadi. Nemis fizigi Georg Om ular orasidagi qonunni yaratgan.",
    formulaOrRule: "Om qonuni: I = U / R (Tok kuchi = Kuchlanish / Qarshilik).\nKuchlanish: U = I × R; Qarshilik: R = U / I.",
    example: "Misol: Zanjir qismidagi kuchlanish U = 220 V, qarshilik R = 44 Om bo'lsa, tok kuchi: I = 220 / 44 = 5 Amper.",
    summary: "Om qonuni barcha elektrotexnika, uy elektr jihozlari va zamonaviy sxemalarning asosiy qonunidir.",
    questions: [
      { q: "Zanjir qismi uchun Om qonunining to'g'ri formulasi qaysi?", a: ["I = U / R", "I = U × R", "R = I × U", "U = I / R"], c: 0 },
      { q: "Elektr tok kuchi qaysi asbob bilan o'lchanadi va qanday ulanadi?", a: ["Ampermetr (ketma-ket)", "Voltmetr (parallel)", "Ommetr", "Barometr"], c: 0 },
      { q: "Kuchlanish 12 V, qarshilik 4 Om bo'lgan o'tkazgichdan o'tayotgan tok kuchini toping:", a: ["3 A", "48 A", "8 A", "0.33 A"], c: 0 },
      { q: "Elektr qarshiligining o'lchov birligi nima?", a: ["Om (Ω)", "Volt (V)", "Amper (A)", "Vatt (W)"], c: 0 },
    ]
  }
];

// Helper to convert rich grade lesson data to the EducationLesson interface
function convertGradeLessonsToEducationLessons(subjectKey: string, lessons: GradeLessonData[]): EducationLesson[] {
  return lessons.map((item, idx) => {
    const n = idx + 1;
    const steps = [
      {
        h: `1. Mavzuning nazariy tushunchasi (${item.grade})`,
        t: item.theory,
      },
      {
        h: `2. Asosiy qoidalar, qonuniyatlar va formulalar`,
        t: item.formulaOrRule,
      },
      {
        h: `3. Amaliy hayotiy misollar va yechimlar`,
        t: item.example,
      },
      {
        h: `4. Dars xulosasi va muhim eslatma`,
        t: item.summary,
      },
    ];

    const questions: QuizQuestion[] = item.questions.map((qItem) => ({
      q: qItem.q,
      a: qItem.a,
      c: qItem.c,
      cat: subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1),
    }));

    return {
      id: `${subjectKey}-${idx + 1}`,
      title: `${n}-dars: ${item.title} (${item.grade})`,
      steps,
      questions,
      subject: subjectKey,
    };
  });
}

import { INGLIZ_TILI_LESSONS } from './englishLessonsData';

export function generateLessons(subjectKey: 'matematika' | 'informatika' | 'fizika' | 'ingliz' | 'ingliz-tili'): EducationLesson[] {
  if (subjectKey === 'matematika') {
    return convertGradeLessonsToEducationLessons('matematika', MATEMATIKA_LESSONS);
  }
  if (subjectKey === 'informatika') {
    return convertGradeLessonsToEducationLessons('informatika', INFORMATIKA_LESSONS);
  }
  if (subjectKey === 'fizika') {
    return convertGradeLessonsToEducationLessons('fizika', FIZIKA_LESSONS);
  }
  if (subjectKey === 'ingliz' || subjectKey === 'ingliz-tili') {
    return convertGradeLessonsToEducationLessons('ingliz-tili', INGLIZ_TILI_LESSONS);
  }
  return [];
}
