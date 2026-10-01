export interface ReadingArticle {
  id: string;
  subject: 'matematika' | 'informatika' | 'fizika' | 'ingliz';
  subjectTitle: string;
  title: string;
  readTime: string;
  level: string;
  summary: string;
  content: string[];
  keyFormulas: string[];
  interestingFacts: string[];
  questions: {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

export const READING_ARTICLES: ReadingArticle[] = [
  // MATEMATIKA
  {
    id: 'math-1',
    subject: 'matematika',
    subjectTitle: 'Matematika',
    title: 'Natural sonlar va Bo\'linish qoidalarining sehrli sirlari',
    readTime: '4 daqiqa',
    level: '5-6 sinf',
    summary: 'Katta sonlarni kalkulyatorsiz qaysi songa bo\'linishini soniyalar ichida aniqlash usullari.',
    content: [
      'Natural sonlar insoniyat paydo bo\'lganidan buyon narsalarni sanash vositasi bo\'lib kelgan. Qadimgi Bobil va Misrda natural sonlar hosil, mol-mulk va vaqtni hisoblashda qo\'llanilgan.',
      'Bo\'linish belgilari yordamida har qanday yirik sonni ustun shaklida bo\'lmasdan turib, uning 2, 3, 4, 5, 9, 10 ga qoldiqsiz bo\'linishini darhol aniqlash mumkin.',
      'Masalan: Sonning raqamlar yig\'indisi 3 ga bo\'linsa, butun son ham 3 ga bo\'linadi. Agar raqamlar yig\'indisi 9 ga bo\'linsa, son ham 9 ga bo\'linadi. Oxirgi ikki raqami 4 ga bo\'linsa, butun son ham 4 ga qoldiqsiz bo\'linadi.',
      'Bu qoidalar faqat imtihonda emas, balki bank hisob-kitoblarida, kompyuter algoritmlarida va xesh-funksiyalarni yaratishda poydevor hisoblanadi.'
    ],
    keyFormulas: [
      '2 ga bo\'linish: oxirgi raqam juft bo\'lsa (0, 2, 4, 6, 8)',
      '3 ga bo\'linish: barcha raqamlar yig\'indisi 3 ga karrali bo\'lsa',
      '4 ga bo\'linish: oxirgi ikki raqam 4 ga bo\'linsa (yoki 00)',
      '9 ga bo\'linish: barcha raqamlar yig\'indisi 9 ga karrali bo\'lsa',
      'Qoldiqli bo\'lish: a = b · q + r (bu yerda 0 ≤ r < b)'
    ],
    interestingFacts: [
      'Nol (0) natural son hisoblanmaydi, chunki sanash 1 dan boshlanadi.',
      'Eng katta ma\'lum tub son millionlab raqamlardan iborat bo\'lib, u kiberxavfsizlikda ma\'lumotlarni shifrlash uchun xizmat qiladi.'
    ],
    questions: [
      {
        q: '12 345 soni 3 ga qoldiqsiz bo\'linadimi?',
        options: ['Ha, chunki raqamlar yig\'indisi 15 (3 ga bo\'linadi)', 'Yo\'q, chunki toq son', 'Faqat 5 ga bo\'linadi', 'Aniq aytib bo\'lmaydi'],
        correct: 0,
        explanation: '1 + 2 + 3 + 4 + 5 = 15. 15 soni 3 ga bo\'linadi, demak butun son ham 3 ga qoldiqsiz bo\'linadi.'
      },
      {
        q: 'Qaysi sonlar 9 ga qoldiqsiz bo\'linadi?',
        options: ['Raqamlar yig\'indisi 9 ga bo\'linadigan sonlar', 'Faqat 9 bilan tugaydigan sonlar', 'Juft sonlar', 'Barcha 3 ga bo\'linadigan sonlar'],
        correct: 0,
        explanation: 'Qoidaga ko\'ra, faqat raqamlar yig\'indisi 9 ga karrali bo\'lgan sonlargina 9 ga qoldiqsiz bo\'linadi.'
      },
      {
        q: 'Qoldiqli bo\'lishda qoldiq (r) bo\'luvchi (b) dan qanday bo\'lishi shart?',
        options: ['Doimo kichik bo\'lishi shart (r < b)', 'Doimo katta bo\'lishi kerak', 'Teng bo\'lishi mumkin', 'Ahamiyatsiz'],
        correct: 0,
        explanation: 'Qoldiq hech qachon bo\'luvchidan katta yoki unga teng bo\'lolmaydi, aks holda bo\'lish to\'liq tugallanmagan bo\'ladi.'
      }
    ]
  },
  {
    id: 'math-2',
    subject: 'matematika',
    subjectTitle: 'Matematika',
    title: 'Kvadrat tenglamalar va Diskriminantning kuchi',
    readTime: '5 daqiqa',
    level: '8-9 sinf',
    summary: 'ax² + bx + c = 0 ko\'rinishidagi tenglamalarni yechish va ildizlar sonini oldindan bilish.',
    content: [
      'Kvadrat tenglama matematikaning eng mashhur va keng qo\'llaniladigan formulalaridan biridir. Raketaning uchish trayektoriyasini hisoblash, to\'pning tushish nuqtasini topish yoki iqtisodiy foydani maksimallashtirish kvadrat funksiya orqali ifodalanadi.',
      'ax² + bx + c = 0 tenglamada a ≠ 0 bo\'lishi shart. Bu yerda Diskriminant (D = b² - 4ac) deb ataluvchi maxsus son tenglamaning taqdirini belgilaydi.',
      'Agar D > 0 bo\'lsa, tenglama ikkita har xil haqiqiy ildizga ega. Agar D = 0 bo\'lsa, ikkita bir xil (bitta) ildiz bo\'ladi. Agar D < 0 bo\'lsa, haqiqiy sonlar to\'plamida ildiz mavjud bo\'lmaydi.',
      'Fransuz matematigi Fransua Viyet esa ajoyib qonuniyatni kashf etgan: keltirilgan kvadrat tenglamada ildizlar yig\'indisi ikkinchi koeffitsiyentning qarama-qarshisiga, ko\'paytmasi esa ozod hadga teng.'
    ],
    keyFormulas: [
      'Umumiy ko\'rinish: ax² + bx + c = 0 (a ≠ 0)',
      'Diskriminant: D = b² - 4ac',
      'Ildizlar formulasi: x₁,₂ = (-b ± √D) / (2a)',
      'Viyet teoremasi: x₁ + x₂ = -b/a  va  x₁ · x₂ = c/a'
    ],
    interestingFacts: [
      'Kvadrat tenglamalarni geometrik usulda yechish qadimgi Bobil va Al-Xorazmiy asarlarida batafsil bayon etilgan.',
      'Parabola shaklidagi sun\'iy yo\'ldosh antennalari kvadrat tenglama qonuniyatiga ko\'ra barcha to\'lqinlarni bitta fokus nuqtasiga yig\'adi.'
    ],
    questions: [
      {
        q: 'Agar kvadrat tenglamada D < 0 bo\'lsa, ildizlar soni nechta bo\'ladi?',
        options: ['Haqiqiy ildizlari yo\'q (0 ta)', '2 ta har xil ildiz', '1 ta ildiz', 'Cheksiz ko\'p'],
        correct: 0,
        explanation: 'Manfiy sondan kvadrat ildiz chiqarib bo\'lmagani sababli, D < 0 bo\'lganda haqiqiy ildizlar bo\'lmaydi.'
      },
      {
        q: 'x² - 5x + 6 = 0 tenglamaning ildizlari qaysilar?',
        options: ['x₁ = 2, x₂ = 3', 'x₁ = 1, x₂ = 6', 'x₁ = -2, x₂ = -3', 'Ildizi yo\'q'],
        correct: 0,
        explanation: 'Viyet teoremasiga ko\'ra: 2 + 3 = 5 va 2 · 3 = 6.'
      },
      {
        q: 'Diskriminant formulasi qaysi?',
        options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 2a + b', 'D = a² + b²'],
        correct: 0,
        explanation: 'Diskriminant D = b² - 4ac formulasi orqali hisoblanadi.'
      }
    ]
  },
  {
    id: 'math-3',
    subject: 'matematika',
    subjectTitle: 'Matematika',
    title: 'Pifagor teoremasi va Uchburchaklar geometriyasi',
    readTime: '4 daqiqa',
    level: '7-8 sinf',
    summary: 'To\'g\'ri burchakli uchburchakda katetlar va gipotenuza munosabati.',
    content: [
      'Pifagor teoremasi insoniyat tarixidagi eng buyuk kashfiyotlardan biridir. U to\'g\'ri burchakli uchburchakning tomonlari orasidagi bog\'lanishni ochib beradi.',
      'Teorema ta\'rifi: To\'g\'ri burchakli uchburchakda gipotenuzaning kvadrati katetlar kvadratlarining yig\'indisiga teng: c² = a² + b².',
      'Misr quruvchilari piramidalarni barpo etishda to\'g\'ri burchak (90 daraja) hosil qilish uchun 3-4-5 o\'lchamli arqonlardan foydalanishgan. Bu Misr uchburchagi deb ataladi (chunki 3² + 4² = 9 + 16 = 25 = 5²).',
      'Bugungi kunda GPS navigatorlari, smartfonlar xaritasi va 3D o\'yin grafikalari masofani aniqlashda aynan Pifagor teoremasi asosida ishlaydi.'
    ],
    keyFormulas: [
      'c² = a² + b² (c — gipotenuza, a va b — katetlar)',
      'Gipotenuzani topish: c = √(a² + b²)',
      'Katetni topish: a = √(c² - b²)',
      'Mashhur pifagor sonlari: (3, 4, 5), (5, 12, 13), (6, 8, 10)'
    ],
    interestingFacts: [
      'Pifagor teoremasining 400 dan ortiq xilma-xil isboti mavjud.',
      'Xaritada ikki nuqta orasidagi masofani hisoblash aynan ikki o\'lchamli koordinatalarda Pifagor formulasidir.'
    ],
    questions: [
      {
        q: 'Katetlari 6 sm va 8 sm bo\'lgan to\'g\'ri burchakli uchburchak gipotenuzasi necha sm?',
        options: ['10 sm', '14 sm', '12 sm', '7 sm'],
        correct: 0,
        explanation: 'c² = 6² + 8² = 36 + 64 = 100. c = √100 = 10 sm.'
      },
      {
        q: 'Pifagor teoremasi qaysi uchburchaklar uchun o\'rinli?',
        options: ['Faqat to\'g\'ri burchakli uchburchaklar uchun', 'Barcha ixtiyoriy uchburchaklar uchun', 'Faqat teng tomonli uchburchaklar uchun', 'O\'tmas burchakli uchburchaklar uchun'],
        correct: 0,
        explanation: 'Pifagor teoremasi qat\'iy ravishda faqat to\'g\'ri burchakli (bitta burchagi 90° bo\'lgan) uchburchaklar uchundir.'
      }
    ]
  },

  // INFORMATIKA
  {
    id: 'info-1',
    subject: 'informatika',
    subjectTitle: 'Informatika',
    title: 'Kompyuter qanday fikrlaydi? 0 va 1 (Binar dunyo)',
    readTime: '4 daqiqa',
    level: '5-9 sinf',
    summary: 'Kompyuter barcha ma\'lumotlar, rasm, video va o\'yinlarni faqat ikkita raqam yordamida qanday saqlaydi?',
    content: [
      'Insonlar kundalik hayotda 10 ta raqamdan iborat o\'nlik sanoq sistemasidan (0, 1, 2, ... 9) foydalanadi, chunki qo\'limizda 10 ta barmoq bor. Ammo kompyuter uchun faqat ikkita holat mavjud: elektr toki bor (1) yoki elektr toki yo\'q (0).',
      'Bu binar (ikkilik) sanoq sistemasi deyiladi. 0 yoki 1 bitta bit (binary digit) deb ataladi. 8 ta bit birlashib 1 baytni hosil qiladi.',
      'Siz ekranda ko\'rayotgan har bir harf, emoji va rang binar kodga aylanadi. Masalan, "A" harfi ASCII jadvalida 65 raqamiga to\'g\'ri keladi, bu esa ikkilik sanoq sistemasida 01000001 ko\'rinishida yoziladi.',
      'Raqamli texnologiyalarning mo\'jizasi shundaki, milliardlab 0 va 1 larni sekundiga milliard marta almashtiruvchi mitti tranzistorlar kompyuter miyasi (CPU) da joylashgan.'
    ],
    keyFormulas: [
      '1 Bit = 0 yoki 1 (Eng kichik o\'lchov)',
      '1 Bayt = 8 Bit (Bitta harf sig\'imi)',
      '1 Kilobayt (KB) = 1024 Bayt (2¹⁰)',
      '1 Megabayt (MB) = 1024 KB',
      '1 Gigabayt (GB) = 1024 MB'
    ],
    interestingFacts: [
      'Zamonaviy smartfon protsessorida barmoq tirnog\'idek joyda 15 milliarddan ortiq mitti tranzistorlar joylashgan!',
      'Nega 1000 emas, balki 1024? Chunki 2 ning 10-darajasi (2¹⁰) aynan 1024 ga teng bo\'lib, u kompyuter uchun eng tabiiy qulay hisobdir.'
    ],
    questions: [
      {
        q: '1 Bayt necha bitdan iborat?',
        options: ['8 bit', '10 bit', '1024 bit', '4 bit'],
        correct: 0,
        explanation: 'Standart arxitekturada 1 bayt doimo 8 ta bitdan tashkil topadi.'
      },
      {
        q: 'Kompyuterning ikkilik tizimidagi raqamlar qaysilar?',
        options: ['Faqat 0 va 1', '0 dan 9 gacha', '1 dan 10 gacha', 'A, B, C harflari'],
        correct: 0,
        explanation: 'Binar (ikkilik) tizim faqat 0 va 1 raqamlaridan foydalanadi.'
      }
    ]
  },
  {
    id: 'info-2',
    subject: 'informatika',
    subjectTitle: 'Informatika',
    title: 'Algoritmlar va Dasturlash: Muammoni qadam-baqadam yechish san\'ati',
    readTime: '5 daqiqa',
    level: '6-11 sinf',
    summary: 'Chiziqli, tarmoqlanuvchi va takrorlanuvchi algoritmlar orqali dastur yaratish.',
    content: [
      'Algoritm so\'zi buyuk vatandoshimiz Muhammad ibn Muso al-Xorazmiy nomidan kelib chiqqan. Algoritm — bu belgilangan maqsadga erishish yoki masalani yechish uchun bajarilishi kerak bo\'lgan aniq va tugallanuvchi ko\'rsatmalar ketma-ketligidir.',
      'Algoritmning 4 ta muhim xossasi bor: 1) Diskretlik (bo\'laklarga bo\'linishi); 2) Aniqlik (hech qanday noaniqlik bo\'lmasligi); 3) Natijaviylik (aniq natija bilan tugashi); 4) Ommaviylik (bir turdagi barcha masalalar uchun mos kelishi).',
      'Turlari: Chiziqli algoritmda qadamlar birin-ketin bajariladi. Tarmoqlanuvchi algoritmda shart tekshiriladi (agar yomg\'ir yog\'sa — soyabon ol, aks holda — soyabonsiz yur). Takrorlanuvchi algoritm (sikl)da esa ma\'lum harakat kerakli shart bajarilguncha takrorlanadi.',
      'C++, Python yoki JavaScript kabi dasturlash tillari ushbu mantiqiy algoritmlarni kompyuter tushunadigan kodga o\'girib beruvchi vositalardir.'
    ],
    keyFormulas: [
      'Chiziqli: 1-qadam → 2-qadam → 3-qadam',
      'Tarmoqlanuvchi: IF (shart) { amal_1 } ELSE { amal_2 }',
      'Takrorlanuvchi: FOR (i = 1; i <= n; i++) { amal }',
      'Blok-sxema shakllari: Oval (Boshlanish/Tugash), Romb (Shart), To\'rtburchak (Amal)'
    ],
    interestingFacts: [
      'Dunyodagi birinchi dasturchi ayol bo\'lgan — Ada Lavleys (1815–1852). U Charlz Bebbijning hisoblash mashinasi uchun dastlabki algoritmni yozgan.',
      'Google qidiruv tizimi asosida "PageRank" deb nomlanuvchi ulkan matematik algoritm yotadi.'
    ],
    questions: [
      {
        q: 'Blok-sxemada shart tekshirish (agar... aks holda) qaysi geometrik shakl bilan belgilanadi?',
        options: ['Romb', 'Oval', 'To\'g\'ri to\'rtburchak', 'Doira'],
        correct: 0,
        explanation: 'Blok-sxema standartida romb ichiga mantiqiy shart yoziladi va undan "Ha" hamda "Yo\'q" shoxlari chiqadi.'
      },
      {
        q: 'Algoritm atamasining kelib chiqishi qaysi buyuk olim nomi bilan bog\'liq?',
        options: ['Al-Xorazmiy', 'Ibn Sino', 'Mirzo Ulug\'bek', 'Al-Farg\'oniy'],
        correct: 0,
        explanation: 'Algoritm so\'zi Al-Xorazmiy (Algoritmi) nomining lotinchalashtirilgan shaklidir.'
      }
    ]
  },

  // FIZIKA
  {
    id: 'phys-1',
    subject: 'fizika',
    subjectTitle: 'Fizika',
    title: 'Isaak Nyuton va Harakatning Uch Buyuk Qonuni',
    readTime: '5 daqiqa',
    level: '6-9 sinf',
    summary: 'Nega avtobus tormoz berganda oldinga intilamiz? Harakat, inersiya va kuch sirlari.',
    content: [
      '1687-yilda ser Isaak Nyuton tabiatdagi harakat qonunlarini ta\'riflab, butun zamonaviy fizika asoslarini yaratdi. Uning uchta qonuni bugun poyezdlar, mashinalar, samolyotlar va kosmik kemalarni yaratishda bosh mezon hisoblanadi.',
      '1-Qonun (Inersiya qonuni): Agar jismga boshqa jismlar ta\'sir qilmasa yoki ularning ta\'siri bir-birini muvozanatlashtirsa, jism o\'zining tinch holatini yoki tekis to\'g\'ri chiziqli harakatini saqlaydi. Avtobus keskin to\'xtaganda odamlarning oldinga egilishi inersiya natijasidir.',
      '2-Qonun (Dinamika asosiy tenglamasi): Jismga ta\'sir etuvchi kuch uning massasi bilan tezlanishining ko\'paytmasiga teng: F = m · a. Jism qanchalik og\'ir bo\'lsa, uni tezlashtirish uchun shunchalik katta kuch talab etiladi.',
      '3-Qonun (Ta\'sir va aks ta\'sir): Har qanday ta\'sirga doimo miqdor jihatdan teng va yo\'nalishi qarama-qarshi bo\'lgan aks ta\'sir mavjud: F₁ = -F₂. Masalan, raketa gazlarni orqaga kuch bilan otib chiqaradi va buning evaziga o\'zi oldinga uchadi.'
    ],
    keyFormulas: [
      'Nyuton 2-qonuni: F = m · a (Kuch = massa · tezlanish)',
      'Kuch birligi: 1 Nyuton (N) = 1 kg · m / s²',
      'Og\'irlik kuchi: F_og = m · g (g ≈ 9.8 N/kg)',
      'Nyuton 3-qonuni: F₁ = -F₂'
    ],
    interestingFacts: [
      'Nyuton ushbu qonunlarni 1665-yilda vabo epidemiyasi sababli universitet yopilib, o\'z qishlog\'ida karantinda o\'tirgan paytda kashf etgan!',
      'Kosmosda vakuum bo\'lsa ham raketaning ucha olishi aynan Nyutonning 3-qonuni (reaktiv harakat) tufaylidir.'
    ],
    questions: [
      {
        q: 'Nyutonning ikkinchi qonuni formulasini ko\'rsating:',
        options: ['F = m · a', 'E = m · c²', 'v = s / t', 'p = F / S'],
        correct: 0,
        explanation: 'Nyutonning ikkinchi qonuni formulasi F = m · a hisoblanadi.'
      },
      {
        q: 'Avtomobil keskin tormozlaganda yo\'lovchilarning oldinga intilishi qaysi hodisa bilan izohlanadi?',
        options: ['Inersiya hodisasi (Nyuton 1-qonuni)', 'Arximed kuchi', 'Og\'irlik kuchi', 'Ishqalanish kuchi'],
        correct: 0,
        explanation: 'Inersiya — jismning o\'z harakat holatini saqlashga intilishidir.'
      }
    ]
  },
  {
    id: 'phys-2',
    subject: 'fizika',
    subjectTitle: 'Fizika',
    title: 'Elektr toki, Kuchlanish va Om Qonuni',
    readTime: '4 daqiqa',
    level: '8-10 sinf',
    summary: 'Elektronlarning tartibli harakati, rozetkadagi 220 Volt nima va tok kuchi qanday o\'lchanadi?',
    content: [
      'Elektr toki hayotimizning har bir jabhasini harakatga keltiruvchi quvvatdir. Fizik jihatdan elektr toki — erkin zaryadlangan zarrachalarning (metallarda elektronlarning) tartibli yo\'nalgan harakatidir.',
      'Elektr zanjirining uchta asosiy kattaligi mavjud: 1) Tok kuchi (I) — amperda o\'lchanadi, sekundiga o\'tayotgan zaryad miqdori. 2) Kuchlanish (U) — voltda o\'lchanadi, tokni harakatlantiruvchi elektr bosimi. 3) Qarshilik (R) — omda o\'lchanadi, moddaning tok o\'tishiga ko\'rsatadigan to\'sqinligi.',
      'Nemis fizigi Georg Om ushbu uchlik orasidagi bog\'liqlikni kashf etgan: Zanjir qismidagi tok kuchi kuchlanishga to\'g\'ri mutanosib, qarshilikka esa teskari mutanosibdir: I = U / R.',
      'Agar simning qarshiligi oshsa, tok kuchi kamayadi. Agar kuchlanish oshirilsa, tok kuchi ham ko\'payadi.'
    ],
    keyFormulas: [
      'Om qonuni: I = U / R',
      'Kuchlanishni topish: U = I · R',
      'Qarshilikni topish: R = U / I',
      'Elektr quvvati: P = U · I (Vatt birligida)'
    ],
    interestingFacts: [
      'Inson tanasi elektr tokini o\'tkazadi, shuning uchun elektr xavfsizlik qoidalariga qat\'iy rioya qilish va nam qo\'l bilan elektr jihozlariga tegmaslik shart!',
      'Yashin chaqnaganda tok kuchi 100 000 Ampergacha, kuchlanish esa millionlab voltgacha yetishi mumkin.'
    ],
    questions: [
      {
        q: 'Om qonuniga ko\'ra zanjirdagi tok kuchi (I) qanday topiladi?',
        options: ['I = U / R', 'I = U · R', 'I = R / U', 'I = U + R'],
        correct: 0,
        explanation: 'Om qonunining klassik formulasi: I = U / R (tok kuchi = kuchlanish / qarshilik).'
      },
      {
        q: 'Agar kuchlanish 12 Volt, qarshilik 4 Om bo\'lsa, tok kuchi necha Amper bo\'ladi?',
        options: ['3 Amper', '48 Amper', '16 Amper', '8 Amper'],
        correct: 0,
        explanation: 'I = U / R = 12 / 4 = 3 Amper.'
      }
    ]
  },

  // INGLIZ TILI (English Language)
  {
    id: 'eng-1',
    subject: 'ingliz',
    subjectTitle: 'Ingliz tili',
    title: '12 ta Ingliz Zamonlari Tizimini Oson Tushunish Usuli',
    readTime: '6 daqiqa',
    level: '5-8 sinflar',
    summary: 'Present, Past va Future zamonlarining 4 ta xilini (Simple, Continuous, Perfect, Perfect Continuous) mantiqiy matritsa orqali yodda saqlash formulalari.',
    content: [
      'Ingliz tilida 12 ta zamon shakli mavjud, lekin ularni 3 ta vaqt (Hozirgi - Present, O\'tgan - Past, Kelasi - Future) va 4 ta aspekt (Simple, Continuous, Perfect, Perfect Continuous) ning kombinatsiyasi sifatida ko\'rsangiz, tushunish juda osonlashadi.',
      '1. Simple (Oddiy) — faktlar, odatlar va doimiy holatlar uchun (I play football).',
      '2. Continuous (Davomli) — ma\'lum vaqtda ayni paytda davom etayotgan harakatlar uchun (I am playing football). Formulada doim to be + V-ing ishtirok etadi.',
      '3. Perfect (Tugallangan) — harakatning natijasi muhim bo\'lganda yoki ma\'lum nuqtagacha tugallangan bo\'lsa (I have played football). Formulada have/has/had + V3 ishlatiladi.',
      '4. Perfect Continuous (Tugallangan davomli) — harakat boshlanib, ma\'lum vaqt davomida to\'xtovsiz davom etganini ta\'kidlaydi (I have been playing football for 2 hours).',
      'Ushbu 3x4 jadvalni bir marta mantiqan tushunib olsangiz, chalkashib ketish xavfi butunlay yo\'qoladi.'
    ],
    keyFormulas: [
      'Present Simple: V1 / V-(s/es) | Past Simple: V2 (-ed) | Future Simple: Will + V1',
      'Continuous guruhi: be (am/is/are/was/were/will be) + V-ing',
      'Perfect guruhi: have/has/had/will have + V3 (Past Participle)',
      'Perfect Continuous guruhi: have/has/had been + V-ing',
      'Signal so\'zlar: Present (now, always) | Past (yesterday, ago) | Future (tomorrow, next)'
    ],
    interestingFacts: [
      'Ingliz tilida eng ko\'p ishlatiladigan fe\'l bu "to be" fe\'lidir.',
      'Ingliz tilidagi eng qisqa to\'liq gap: "I am." (Men mavjudman / Men shundayman).'
    ],
    questions: [
      {
        q: 'Ingliz tilida jami nechta asosiy zamon shakllari (Tenses) mavjud?',
        options: ['12 ta', '6 ta', '16 ta', '9 ta'],
        correct: 0,
        explanation: '3 ta vaqt (Present, Past, Future) x 4 ta aspekt (Simple, Continuous, Perfect, Perfect Continuous) = 12 ta zamon.'
      },
      {
        q: 'Barcha Continuous (Davomli) zamonlarda fe\'l qanday shaklda bo\'ladi?',
        options: ['to be + V-ing', 'have + V3', 'faqat V1', 'will + V2'],
        correct: 0,
        explanation: 'Har bir Continuous zamonda fe\'l oxiriga -ing qo\'shiladi va to be yordamchi fe\'li ishtirok etadi.'
      },
      {
        q: "'She has already finished her task' qaysi zamonda tuzilgan?",
        options: ['Present Perfect', 'Present Continuous', 'Past Simple', 'Future Perfect'],
        correct: 0,
        explanation: 'Has + V3 (finished) formulasi Present Perfect zamoniga xosdir.'
      }
    ]
  },
  {
    id: 'eng-2',
    subject: 'ingliz',
    subjectTitle: 'Ingliz tili',
    title: 'So\'z Boyligini (Vocabulary) 10 Barobar Tezroq Yodlash Texnikalari',
    readTime: '5 daqiqa',
    level: 'Barcha sinflar',
    summary: 'Mnemonika, Spaced Repetition (Interval takrorlash) va so\'zlarni kontekstda eslab qolishning ilmiy isbotlangan usullari.',
    content: [
      'Lug\'at yodlashda ko\'pchilik o\'quvchilar qiladigan eng katta xato — so\'zlarni shunchaki alifbo tartibida yoki alohida-alohida mexanik yodlashdir. Miyaning xotira tizimi kontekst va obrazlar orqali ishlaydi.',
      '1. Mnemonika (Assotsiatsiya) usuli — yangi inglizcha so\'zni o\'zbek tilidagi qiziqarli tovushdosh so\'z yoki kulgili tasvir bilan bog\'lash. Masalan: "Puddle" (ko\'lmak) — "Padal ko\'lmakka tushib ketdi".',
      '2. Spaced Repetition (Interval takrorlash) — yangi so\'zni o\'rgangach, 1-kuni, 3-kuni, 7-kuni va 30-kuni takrorlash uzoq muddatli xotiraga (Long-term memory) o\'tishini 90% ga oshiradi.',
      '3. Collocations (So\'z birikmalari) bilan yodlash — faqat "decision" so\'zini emas, "make a decision" (qaror qabul qilmoq) birikmasini birga o\'rganing.',
      'Har kuni atigi 10 ta sifatli so\'z o\'rgangan o\'quvchi 1 yilda 3 650 ta yangi so\'zni bemalol o\'zlashtiradi — bu B2 darajasiga teng!'
    ],
    keyFormulas: [
      'Mnemonika qoidasi: Yangi so\'z + O\'xshash obraz + Hissiyot = Mustahkam xotira',
      'Interval jadvali: 1 soat -> 1 kun -> 3 kun -> 7 kun -> 30 kun',
      'Collocation printsipi: Make a mistake, Do homework, Take a photo, Have fun'
    ],
    interestingFacts: [
      'Oxford lug\'atida 170 000 dan ortiq faol inglizcha so\'z bor, ammo oddiy kundalik suhbatning 80% i bor-yo\'g\'i 2 000 ta asosiy so\'zdan iborat!',
      'Ingliz tiliga eng ko\'p yangi so\'zlar hozirgi kunda texnologiya, dasturlash va ijtimoiy tarmoqlar sohasidan kirib kelmoqda.'
    ],
    questions: [
      {
        q: 'Spaced Repetition (Interval takrorlash) usulining asosiy maqsadi nima?',
        options: ['So\'zlarni uzoq muddatli xotiraga mustahkam o\'tkazish', 'Bir kunda 500 ta so\'z yodlash', 'Grammatika testlarini tez yechish', 'Faqat kitob o\'qish'],
        correct: 0,
        explanation: 'Vaqt oralig\'i bilan takrorlash unutish egri chizig\'ini yengib, so\'zni uzoq muddatli xotirada saqlab qoladi.'
      },
      {
        q: "'Make a decision' iborasining ma'nosi nima?",
        options: ['Qaror qabul qilmoq', 'Xato qilmoq', 'Rasmga olmoq', 'Sport bilan shug\'ullanmoq'],
        correct: 0,
        explanation: "'Decision' — qaror, 'make a decision' esa qaror qabul qilmoq demakdir."
      }
    ]
  },
  {
    id: 'eng-3',
    subject: 'ingliz',
    subjectTitle: 'Ingliz tili',
    title: 'Dasturchilar va IT Mutaxassislari Uchun Maxsus Ingliz Tili',
    readTime: '5 daqiqa',
    level: '6-8 sinf & IT',
    summary: 'Dasturlash, kompyuter ilmlari va xalqaro texnologik jamoalarda muloqot qilish uchun zarur bo\'lgan asosiy IT atamalar.',
    content: [
      'Zamonaviy dasturlash tillari (Python, JavaScript, C++, Java), hujjatlar (documentation), Stack Overflow va GitHub kabi barcha global manbalar ingliz tilida yuritiladi.',
      'Dasturchi uchun ingliz tilini bilish maoshni va xalqaro kompaniyalarda (Google, Meta, Amazon) ishlash imkoniyatini bir necha barobarga oshiradi.',
      'Eng muhim IT atamalari: Debugging (kod xatolarini qidirish va tuzatish), Deploy (loyihani serverga joylash), Refactor (kodni yaxshilash va soddalashtirish), Pull Request (kod o\'zgarishini tasdiqlash uchun yuborish), Framework (dastur skeleti).',
      'Algoritmlarda: Loop (takrorlanish/sikil), Condition (shart), Recursion (o\'zini o\'zi chaqiruvchi funksiya), Exception (kutilmagan xatolik/istisno).'
    ],
    keyFormulas: [
      'Syntax: Qoidalar to\'plami (Code structure rules)',
      'Variable: O\'zgaruvchi (Storage for values)',
      'Function / Method: Funksiya yoki amallar bloki',
      'API: Application Programming Interface (Tizimlararo aloqa ko\'prigi)'
    ],
    interestingFacts: [
      'Dunyodagi barcha dasturlash kodlari va ochiq manbali kutubxonalarning 95% dan ortig\'i ingliz tilida yozilgan.',
      '"Bug" (xato) so\'zi dasturchilikda birinchi marta 1947 yilda kompyuter ichiga kirib qolib nosozlik keltirib chiqargan haqiqiy hasharot (kapalak) tufayli paydo bo\'lgan!'
    ],
    questions: [
      {
        q: 'Dasturchilikda "Debugging" atamasi nimani anglatadi?',
        options: ['Dasturdagi xatolarni topish va tuzatish jarayoni', 'Yangi o\'yin o\'rnatish', 'Kompyuterni o\'chirib yoqish', 'Faylni o\'chirish'],
        correct: 0,
        explanation: 'Bug — xatolik, Debugging esa kod ichidagi xato va kamchiliklarni bartaraf etishdir.'
      },
      {
        q: "'Loop' atamasining o'zbekcha ma'nosi qaysi?",
        options: ['Sikl / Takrorlanuvchi harakat', 'O\'zgaruvchi nomi', 'Ekran o\'lchami', 'Xotira diski'],
        correct: 0,
        explanation: "'Loop' dasturlashda bir xil amalni bir necha marta takrorlash (sikl) tushunchasidir."
      }
    ]
  }
];
