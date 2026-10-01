import { GradeLessonData } from './educationData';

// 20 Full Lessons for Ingliz tili (English Language) (5-8 sinflar)
export const INGLIZ_TILI_LESSONS: GradeLessonData[] = [
  // 5-sinf
  {
    grade: "5-sinf",
    title: "The Alphabet and Greetings (Alifbo va Salomlashish)",
    theory: "Ingliz alifbosida 26 ta harf mavjud: 5 ta unli (a, e, i, o, u) va 21 ta undosh harflar. Salomlashish rasmiy (formal) va norasmiy (informal) bo'ladi. Masalan: 'Good morning' (Xayrli tong), 'Good afternoon' (Xayrli kun), 'Hello / Hi' (Salom). Xayrlashishda: 'Goodbye', 'See you later'.",
    formulaOrRule: "Unli tovushdan boshlangan birlikdagi otlar oldidan 'an', undoshdan boshlanganda 'a' noaniq artikli qo'yiladi: a book, an apple.",
    example: "Example: 'Hello! My name is Anvar. Nice to meet you!' - Salom! Mening ismim Anvar. Tanishganimdan xursandman!",
    summary: "Ingliz tilida 26 ta harf bor. Har bir so'z talaffuziga diqqat qiling va muloqotni xushmuomala salomlashishdan boshlang.",
    questions: [
      { q: "Ingliz alifbosida nechta harf bor?", a: ["26 ta", "28 ta", "24 ta", "30 ta"], c: 0 },
      { q: "'Xayrli tong' iborasi ingliz tilida qanday bo'ladi?", a: ["Good morning", "Good afternoon", "Good night", "Good evening"], c: 0 },
      { q: "Qaysi so'z oldidan 'an' artikli ishlatiladi?", a: ["an orange", "an pen", "an car", "an dog"], c: 0 },
      { q: "'Nice to meet you' iborasi ma'nosi nima?", a: ["Tanishganimdan xursandman", "Xayr, ko'rishguncha", "Kechirasiz", "Rahmat"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Verb 'To Be': am, is, are (Bo'lmoq fe'li)",
    theory: "'To be' fe'li o'zbek tiliga 'bo'lmoq' deb tarjima qilinadi yoki shaxs va holatni bildirishda qo'shimcha vazifasini bajaradi. Hozirgi zamonda uch xil shaklga ega: I am (men ...man), He/She/It is (u ...dir), We/You/They are (biz/siz/ular ...dirlar). Inkor shakli 'not' yuklamasi bilan: I am not, is not (isn't), are not (aren't).",
    formulaOrRule: "Darak: Egasi + am/is/are + ot/sifat. So'roq: Am/Is/Are + Egasi + ...? Inkor: Egasi + am/is/are + not + ...",
    example: "Example: She is a teacher. (U o'qituvchi). We are happy students. (Biz baxtli o'quvchilarmiz). Is he at home? (U uydami?)",
    summary: "'To be' fe'li ingliz tilining tamal toshi hisoblanadi. Shaxsga qarab am, is yoki are tanlanadi.",
    questions: [
      { q: "'I ___ a student' gapidagi bo'sh o'ringa to'g'ri fe'lni qo'ying:", a: ["am", "is", "are", "be"], c: 0 },
      { q: "'They ___ from Uzbekistan' gapiga mos fe'l:", a: ["are", "is", "am", "was"], c: 0 },
      { q: "'He is not a doctor' gapining qisqartma shakli qaysi?", a: ["He isn't a doctor", "He aren't a doctor", "He amn't a doctor", "He don't doctor"], c: 0 },
      { q: "So'roq gap tuzishda 'is' yoki 'are' qayerga chiqadi?", a: ["Ega (Subject)dan oldinga", "Gapning eng oxiriga", "O'zgarishsiz qoladi", "Inkor yuklamasidan keyin"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Present Simple Tense (Oddiy Hozirgi Zamon)",
    theory: "Present Simple odatiy, doimiy takrorlanadigan ish-harakatlar yoki umumiy haqiqatlarni ifodalash uchun ishlatiladi (har kuni, odatda, har doim). Kalit so'zlari: always, usually, often, sometimes, never, every day.",
    formulaOrRule: "I/You/We/They + V (fe'lning o'zi). He/She/It + V-(s/es). Inkor: don't / doesn't + V. So'roq: Do / Does + Ega + V?",
    example: "Example: I play football every Sunday. (Men har yakshanba futbol o'ynayman). He watches cartoons every evening. (U har oqshom multfilm ko'radi).",
    summary: "Uchinchi shaxs birlikda (He, She, It) fe'lga -s yoki -es qo'shilishini aslo unutmang!",
    questions: [
      { q: "'She ___ (read) books every day' gapiga to'g'ri fe'l shakli:", a: ["reads", "read", "reading", "is read"], c: 0 },
      { q: "He/She/It uchun inkor shakli qaysi yordamchi fe'l bilan yasaladi?", a: ["doesn't", "don't", "isn't", "aren't"], c: 0 },
      { q: "'___ you speak English?' so'roq gapiga mos so'z:", a: ["Do", "Does", "Is", "Are"], c: 0 },
      { q: "Qaysi so'z Present Simple kalit so'zi hisoblanadi?", a: ["always", "yesterday", "tomorrow", "now"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Plural Nouns (Otlar ko'pligi)",
    theory: "Ingliz tilida otlarning ko'pligi odatda ot oxiriga -s yoki -es qo'shimchasini qo'shish bilan yasaladi (book - books, pen - pens). Agar so'z -s, -ss, -sh, -ch, -x, -o bilan tugasa -es qo'shiladi (box - boxes, watch - watches). Qoidadan mustasno (irregular) otlar ham mavjud.",
    formulaOrRule: "Muntazam: Noun + s/es. Qoidadan tashqari: child - children, man - men, woman - women, tooth - teeth, foot - feet, mouse - mice.",
    example: "Example: One cat -> three cats. One child -> many children. One city -> two cities (y harfi i ga aylanadi).",
    summary: "Ko'plik yasalishida harf birikmalariga va noto'g'ri (irregular) otlar shakliga e'tibor bering.",
    questions: [
      { q: "'Child' (bola) so'zining ko'plik shakli qaysi?", a: ["children", "childs", "childrens", "childes"], c: 0 },
      { q: "'Box' so'zining ko'pligi:", a: ["boxes", "boxs", "boxies", "boxen"], c: 0 },
      { q: "'City' so'zining ko'pligi qanday yoziladi?", a: ["cities", "citys", "cityes", "citiess"], c: 0 },
      { q: "'Man' (erkak) so'zining ko'pligi:", a: ["men", "mans", "mens", "manes"], c: 0 },
    ]
  },
  {
    grade: "5-sinf",
    title: "Possessive Pronouns & Have Got / Has Got",
    theory: "'Have got / Has got' biror narsaga egalik qilishni bildiradi ('menda bor'). I/You/We/They have got, He/She/It has got. Egalik olmoshlari: my (mening), your (sening), his (uning - o'g'il), her (uning - qiz), its (uning - jonsiz), our (bizning), their (ularning).",
    formulaOrRule: "Darak: Ega + have/has got + ot. Inkor: haven't / hasn't got. So'roq: Have/Has + Ega + got?",
    example: "Example: I have got a new computer. (Menda yangi kompyuter bor). He has got a cute cat. (Unda yoqimli mushuk bor). This is my school bag.",
    summary: "Egalikni ifodalashda have got (ko'plik va I) va has got (birlik uchinchi shaxs) ishlatiladi.",
    questions: [
      { q: "'She ___ got a bicycle' gapiga mos fe'l:", a: ["has", "have", "is", "are"], c: 0 },
      { q: "'Bizning' so'zining inglizcha tarjimasi:", a: ["our", "my", "your", "their"], c: 0 },
      { q: "'I haven't got any sisters' gapi ma'nosi:", a: ["Mening opam yoki singlim yo'q", "Mening ikki opam bor", "Men opam bilan yashayman", "Mening singlim talaba"], c: 0 },
      { q: "'He' olmoshining egalik shakli qaysi?", a: ["his", "her", "its", "him"], c: 0 },
    ]
  },

  // 6-sinf
  {
    grade: "6-sinf",
    title: "Present Continuous Tense (Hozirgi Davomli Zamon)",
    theory: "Ayni nutq paytida (hozir, ayni daqiqalarda) sodir bo'layotgan ish-harakatlarni ifodalash uchun ishlatiladi. Kalit so'zlari: now (hozir), at the moment (ayni damda), right now, Look! (Qara!), Listen! (Eshit!).",
    formulaOrRule: "Darak: Ega + am/is/are + V-ing. Inkor: Ega + am/is/are + not + V-ing. So'roq: Am/Is/Are + Ega + V-ing?",
    example: "Example: I am doing my English homework right now. (Men ayni paytda ingliz tili vazifamni bajaryapman). Look! The birds are flying.",
    summary: "Fe'l oxiriga -ing qo'shiladi va albatta am/is/are yordamchi fe'li ishtirok etadi.",
    questions: [
      { q: "'Listen! Somebody ___ (sing) a song' gapiga mos shakl:", a: ["is singing", "sings", "are singing", "sing"], c: 0 },
      { q: "Present Continuous zamonining kalit so'zi qaysi?", a: ["at the moment", "yesterday", "every year", "last night"], c: 0 },
      { q: "'They are playing tennis' gapining inkor shakli:", a: ["They aren't playing tennis", "They don't playing tennis", "They not playing tennis", "They isn't play tennis"], c: 0 },
      { q: "'Write' fe'liga -ing qo'shilganda qanday yoziladi?", a: ["writing", "writeing", "writting", "writtinge"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Past Simple: Was / Were (O'tgan Zamon Bo'lmoq Fe'li)",
    theory: "O'tgan zamonda holat yoki joylashuvni ifodalashda 'to be' fe'lining o'tgan zamon shakllari 'was' va 'were' ishlatiladi. I/He/She/It bilan 'was', You/We/They bilan 'were' qo'llanadi. Inkor shakli: was not (wasn't), were not (weren't).",
    formulaOrRule: "Darak: Ega + was/were + ... Inkor: Ega + wasn't / weren't + ... So'roq: Was/Were + Ega + ...?",
    example: "Example: Yesterday I was at school. (Kecha men maktabda edim). They were very happy last week. (Ular o'tgan hafta juda xursand edilar).",
    summary: "O'tgan zamon bo'lmoq fe'li: I/He/She/It - was; You/We/They - were.",
    questions: [
      { q: "'We ___ in Samarkand last month' gapiga mos so'z:", a: ["were", "was", "are", "is"], c: 0 },
      { q: "'Yesterday he ___ sick' gapiga to'g'ri fe'l:", a: ["was", "were", "is", "are"], c: 0 },
      { q: "'Were they at the cinema?' so'roq gapiga qisqa ijobiy javob:", a: ["Yes, they were", "Yes, they was", "Yes, they are", "Yes, they do"], c: 0 },
      { q: "'Was not' ning qisqartmasi:", a: ["wasn't", "weren't", "ain't", "aren't"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Past Simple: Regular & Irregular Verbs (O'tgan Zamon Fe'llari)",
    theory: "O'tgan zamonda tugallangan harakatlar uchun Past Simple ishlatiladi. Fe'llar 2 turga bo'linadi: To'g'ri fe'llar (Regular) oxiriga -ed qo'shiladi (play - played, watch - watched). Noto'g'ri fe'llar (Irregular) butunlay o'zgaradi (go - went, see - saw, buy - bought). Inkor va so'roqda 'did' yordamchi fe'li ishlatiladi.",
    formulaOrRule: "Darak: Ega + V2 (-ed yoki 2-ustun). Inkor: Ega + didn't + V1 (asosiy fe'l). So'roq: Did + Ega + V1?",
    example: "Example: I bought a new book yesterday. (Men kecha yangi kitob sotib oldim). Did you watch the match? (O'yinni tomosha qildingizmi?)",
    summary: "Inkor va so'roq gaplarda 'did/didn't' kelgach, asosiy fe'l o'zining boshlang'ich shakliga (V1) qaytadi!",
    questions: [
      { q: "'Go' fe'lining o'tgan zamon shakli (V2) qaysi?", a: ["went", "goed", "gone", "going"], c: 0 },
      { q: "'She didn't ___ (see) me yesterday' gapiga to'g'ri fe'l:", a: ["see", "saw", "seen", "seeing"], c: 0 },
      { q: "'Play' to'g'ri fe'lining o'tgan zamon shakli:", a: ["played", "playied", "playd", "plaid"], c: 0 },
      { q: "'Did you do your homework?' javobi:", a: ["Yes, I did", "Yes, I do", "Yes, I was", "Yes, I done"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Modal Verbs: Can, Must, Should (Modal Fe'llar)",
    theory: "Modal fe'llar harakatning o'zini emas, unga bo'lgan munosabatni (imkoniyat, majburiyat, maslahat) bildiradi. 'Can' - qobiliyat (qila olmoq); 'Must' - qat'iy majburiyat (kerak, shart); 'Should' - do'stona maslahat (qilsangiz yaxshi bo'lardi). Ulardan keyin fe'l 'to' siz keladi.",
    formulaOrRule: "Ega + can/must/should + V1 (to siz). Inkor: can't / mustn't / shouldn't + V1.",
    example: "Example: I can swim well. (Men yaxshi suza olaman). You must wear a helmet. (Siz shlem kiyishingiz shart). You should sleep early. (Ertaroq uxlasang yaxshi bo'lardi).",
    summary: "Modal fe'llardan keyin fe'llarga hech qanday qo'shimcha (-s, -ed, -ing) qo'shilmaydi!",
    questions: [
      { q: "'You ___ stop when the traffic light is red' (Majburiyat):", a: ["must", "can", "should", "may"], c: 0 },
      { q: "'I ___ speak three languages' (Qobiliyat):", a: ["can", "must", "should", "need"], c: 0 },
      { q: "Do'stona maslahat berishda qaysi modal fe'l qo'llanadi?", a: ["should", "must", "can", "have"], c: 0 },
      { q: "Modal fe'llardan keyin keluvchi fe'l qanday shaklda bo'ladi?", a: ["Boshlang'ich shaklda (V1, to siz)", "-ing qo'shimchasi bilan", "-ed qo'shimchasi bilan", "-s qo'shimchasi bilan"], c: 0 },
    ]
  },
  {
    grade: "6-sinf",
    title: "Comparative & Superlative Adjectives (Sifat Darajalari)",
    theory: "Sifatlar qiyosiy (Comparative - 'roq') va orttirma (Superlative - 'eng') darajaga ega. Qisqa (bir bo'g'inli) sifatlarga: -er va -est qo'shiladi (fast - faster - fastest). Uzun sifatlar oldiga: more va most qo'yiladi (beautiful - more beautiful - most beautiful). Noto'g'ri sifatlar: good - better - best, bad - worse - worst.",
    formulaOrRule: "Qiyosiy: Adjective-er + than / more + Adjective + than. Orttirma: the + Adjective-est / the most + Adjective.",
    example: "Example: An airplane is faster than a car. (Samolyot mashinadan tezroq). Mount Everest is the highest mountain in the world.",
    summary: "Orttirma daraja oldidan doimo 'the' aniqlik artikli qo'yiladi (the biggest, the most interesting).",
    questions: [
      { q: "'Good' (yaxshi) sifatining qiyosiy darajasi qaysi?", a: ["better", "gooder", "more good", "best"], c: 0 },
      { q: "'Tashkent is ___ than Bukhara' (katta):", a: ["bigger", "biggest", "more big", "the biggest"], c: 0 },
      { q: "'This is ___ (difficult) exam of all' (eng qiyin):", a: ["the most difficult", "more difficult", "difficultest", "the difficultest"], c: 0 },
      { q: "'Bad' sifatining orttirma (eng yomon) darajasi:", a: ["the worst", "worse", "baddest", "the baddest"], c: 0 },
    ]
  },

  // 7-sinf
  {
    grade: "7-sinf",
    title: "Present Perfect Tense (Tugallangan Hozirgi Zamon)",
    theory: "O'tmishda sodir bo'lgan, ammo natijasi hozirgi zamon bilan bevosita bog'liq bo'lgan yoki hayotiy tajribani ifodalovchi zamon. Kalit so'zlari: already (allaqachon), just (hozirgina), yet (hali - inkor va so'roqda), ever (hech qachon), never, since, for.",
    formulaOrRule: "Darak: Ega + have/has + V3 (Participle II). Inkor: haven't / hasn't + V3. So'roq: Have/Has + Ega + V3?",
    example: "Example: I have already finished my homework. (Men vazifamni allaqachon tugatdim - natijasi tayyor). Have you ever been to London?",
    summary: "Vaqt aniq aytilmasa va natija muhim bo'lsa Present Perfect; aniq vaqt (yesterday, in 2020) aytilsa Past Simple qo'llanadi.",
    questions: [
      { q: "'I have ___ (lose) my key, I can't open the door':", a: ["lost", "losed", "lose", "losing"], c: 0 },
      { q: "'Have you ___ eaten sushi?' (hayotingizda):", a: ["ever", "never", "yet", "already"], c: 0 },
      { q: "Inkor va so'roq gaplarning oxirida qaysi so'z ishlatiladi?", a: ["yet", "just", "already", "since"], c: 0 },
      { q: "'He ___ worked here for five years' gapiga mos fe'l:", a: ["has", "have", "is", "had"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Future Forms: Will vs Be Going To (Kelasi Zamon)",
    theory: "Kelasi zamonni ifodalashning ikki asosiy usuli bor. 'Will' - nutq paytida kutilmaganda qabul qilingan qarorlar, va'dalar yoki bashoratlarda (I will help you). 'Be going to' - oldindan rejalashtirilgan ishlar yoki hozirgi belgilarga asoslangan kelajakda (It is cloudy, it is going to rain).",
    formulaOrRule: "Will: Ega + will + V1. Be going to: Ega + am/is/are + going to + V1.",
    example: "Example: 'The phone is ringing. I will answer it!' (Hozir qaror qildim). 'I am going to visit my grandmother this Saturday' (Rejalashtirganman).",
    summary: "Reja va niyatlar uchun 'be going to', kutilmagan qaror va va'dalar uchun 'will' tanlang.",
    questions: [
      { q: "'I am thirsty. I ___ buy some water' (kutilmagan qaror):", a: ["will", "am going to", "am", "was"], c: 0 },
      { q: "'Look at those dark clouds! It ___ rain':", a: ["is going to", "will", "shall", "does"], c: 0 },
      { q: "'Will not' iborasining qisqartma shakli qaysi?", a: ["won't", "willn't", "shan't", "don't"], c: 0 },
      { q: "'They are going to ___ a new house next year':", a: ["build", "built", "building", "builds"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "First Conditional (Birinchi Tur Shart Mayli)",
    theory: "Kelajakda amalga oshishi mumkin bo'lgan real shart va uning natijasini ifodalaydi. Shart qismi 'If' (agar) bilan boshlanadi va Present Simple da bo'ladi, natija qismi esa Future Simple (will) da bo'ladi.",
    formulaOrRule: "If + Present Simple, Will + V1. (Agar if o'rtada kelsa vergul qo'yilmaydi: Will + V1 if + Present Simple).",
    example: "Example: If it rains tomorrow, we will stay at home. (Agar ertaga yomg'ir yog'sa, biz uyda qolamiz). You will pass the exam if you study hard.",
    summary: "Eslab qoling: 'If' dan keyin darhol 'will' qo'yilmaydi! If qismida doim hozirgi zamon (Present Simple) keladi.",
    questions: [
      { q: "'If she ___ (study) hard, she will win the olympiad':", a: ["studies", "will study", "study", "studied"], c: 0 },
      { q: "'We will go to the park if the weather ___ nice':", a: ["is", "will be", "was", "are"], c: 0 },
      { q: "First Conditional formulasini to'g'ri toping:", a: ["If + Present Simple, Will + V1", "If + Past Simple, Would + V1", "If + Will, Will", "If + Past, Past"], c: 0 },
      { q: "'If you don't hurry, you ___ miss the bus':", a: ["will", "do", "are", "have"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Prepositions of Time & Place: At, In, On",
    theory: "Vaqt va joy predloglari ingliz tilida juda muhim. 'At' - aniq vaqtlar va nuqtalar (at 5 o'clock, at night, at the bus stop). 'On' - kunlar va sanalar, sirtlar (on Monday, on May 9th, on the table). 'In' - oylar, fasllar, yillar, asrlar va yopiq hududlar (in July, in summer, in 2026, in Tashkent).",
    formulaOrRule: "Vaqt: at + soat/bayram; on + kun/sana; in + oy/yil/fasl. Joy: at + manzil; on + ko'cha/sirt; in + shahar/mamlakat.",
    example: "Example: The lesson starts at 9:00. I was born on October 15th. We travel to mountains in summer.",
    summary: "Eng kichikdan kattaga: At (aniq soat) -> On (kun va sana) -> In (oy, yil, asr).",
    questions: [
      { q: "'The match starts ___ 7:30 PM':", a: ["at", "on", "in", "by"], c: 0 },
      { q: "'We don't go to school ___ Sundays':", a: ["on", "in", "at", "for"], c: 0 },
      { q: "'Uzbekistan declared independence ___ 1991':", a: ["in", "on", "at", "to"], c: 0 },
      { q: "'___ the evening' iborasida qaysi predlog ishlatiladi?", a: ["in", "on", "at", "with"], c: 0 },
    ]
  },
  {
    grade: "7-sinf",
    title: "Countable and Uncountable Nouns (Much / Many / A lot of)",
    theory: "Sanash mumkin bo'lgan otlar (Countable) birlik va ko'plikda keladi (apple - apples). Sanalmaydigan otlar (Uncountable) faqat birlikda bo'lib, donalab sanalmaydi (water, milk, money, information). 'Many' sanaladigan ko'plik bilan, 'Much' sanalmaydigan otlar bilan ishlatiladi. 'A lot of' ikkalasi bilan ham qo'llanadi.",
    formulaOrRule: "Many + Countable plural (many books). Much + Uncountable (much water). A few (ozgina - sanaladigan), A little (ozgina - sanalmaydigan).",
    example: "Example: How many books have you got? How much sugar do you need in your tea? I have got a lot of friends.",
    summary: "Ko'plik shakli bo'lmagan narsalar (suyuqliklar, donador moddalar, mavhum tushunchalar) sanalmaydigan otlardir.",
    questions: [
      { q: "'How ___ water do you drink every day?':", a: ["much", "many", "few", "any"], c: 0 },
      { q: "'How ___ students are there in your class?':", a: ["many", "much", "little", "a lot"], c: 0 },
      { q: "Qaysi so'z sanalmaydigan ot (Uncountable noun) hisoblanadi?", a: ["milk", "apple", "car", "book"], c: 0 },
      { q: "Sanalmaydigan otlar bilan 'ozgina' ma'nosida nima ishlatiladi?", a: ["a little", "a few", "many", "few"], c: 0 },
    ]
  },

  // 8-sinf
  {
    grade: "8-sinf",
    title: "Past Continuous Tense (O'tgan Davomli Zamon)",
    theory: "O'tmishdagi ma'lum bir aniq vaqtda davom etayotgan bo'lgan ish-harakatni ifodalaydi. Ko'pincha 'While' (davomida) va 'When' (paytida) so'zlari bilan birgalikda, boshqa qisqa harakat (Past Simple) bilan parallel qo'llanadi.",
    formulaOrRule: "Ega + was/were + V-ing. While + Past Continuous, Past Simple. / When + Past Simple, Past Continuous.",
    example: "Example: Yesterday at 5 PM, I was doing my homework. While I was walking in the park, it started to rain.",
    summary: "O'tmishda uzoq davom etgan fon jarayoni uchun Past Continuous, uni bo'lib qo'ygan qisqa harakat uchun Past Simple ishlatiladi.",
    questions: [
      { q: "'While she was cooking dinner, the telephone ___ (ring)':", a: ["rang", "was ringing", "rings", "has rung"], c: 0 },
      { q: "'At 10 o'clock yesterday morning, they ___ tennis':", a: ["were playing", "played", "are playing", "was playing"], c: 0 },
      { q: "'When I came home, my brother ___ TV':", a: ["was watching", "watched", "watches", "is watching"], c: 0 },
      { q: "Past Continuous da I/He/She bilan qaysi yordamchi fe'l qo'llanadi?", a: ["was", "were", "is", "are"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Passive Voice: Present & Past Passive (Majhul Nisbat)",
    theory: "Majhul nisbatda ish-harakatni kim bajargani emas, harakat kim yoki nima ustida bajarilgani muhim hisoblanadi. Agar harakat bajaruvchisini aytish kerak bo'lsa, 'by' predlogi ishlatiladi.",
    formulaOrRule: "Present Passive: Object + am/is/are + V3. Past Passive: Object + was/were + V3.",
    example: "Example: English is spoken all over the world. (Ingliz tili butun dunyoda gapiriladi). This school was built in 2010 by builders.",
    summary: "Majhul nisbatning o'zgarmas formulasi: 'to be' fe'lining kerakli zamoni + 3-shakldagi asosiy fe'l (V3).",
    questions: [
      { q: "'This famous novel ___ by Abdulla Qodiriy' (yozilgan):", a: ["was written", "wrote", "is writing", "writes"], c: 0 },
      { q: "'Millions of cars ___ every year' (ishlab chiqariladi):", a: ["are produced", "is produced", "produced", "are producing"], c: 0 },
      { q: "Majhul nisbatda harakat bajaruvchisi qaysi predlog orqali ko'rsatiladi?", a: ["by", "with", "from", "at"], c: 0 },
      { q: "'The classroom ___ cleaned yesterday':", a: ["was", "were", "is", "are"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Gerund and Infinitive (Fe'l shakllari)",
    theory: "Ingliz tilida bir fe'ldan keyin ikkinchi fe'l kelganda, u yo Gerund (-ing) yoki Infinitive (to + V) bo'ladi. Masalan, enjoy, avoid, finish, suggest, mind dan keyin Gerund keladi. Want, decide, promise, hope, learn dan keyin Infinitive (to + V) keladi.",
    formulaOrRule: "Enjoy / love / like / dislike / finish + V-ing. Want / decide / hope / learn + to + V1.",
    example: "Example: I enjoy playing chess. (Men shaxmat o'ynashdan zavqlanaman). She decided to study IT. (U IT sohasini o'rganishga qaror qildi).",
    summary: "Har bir asosiy fe'l qaysi shaklni talab qilishini alohida yodlash muhimdir.",
    questions: [
      { q: "'I enjoy ___ (listen) to classical music':", a: ["listening", "to listen", "listen", "listened"], c: 0 },
      { q: "'He decided ___ (buy) a new smartphone':", a: ["to buy", "buying", "buy", "bought"], c: 0 },
      { q: "'She wants ___ (learn) how to code':", a: ["to learn", "learning", "learn", "learned"], c: 0 },
      { q: "'Thank you for ___ (help) me':", a: ["helping", "to help", "help", "helped"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Reported Speech Basics (Ko'chirma Gap)",
    theory: "Birovning aytgan gapini o'z so'zimiz bilan yetkazish 'Reported Speech' deyiladi. Agar muallif gapi o'tgan zamonda bo'lsa (said / told), ko'chirma gap zamoni bitta qadam orqaga suriladi: Present Simple -> Past Simple, am/is -> was, will -> would.",
    formulaOrRule: "Direct: 'I am tired' -> Reported: He said that he was tired. Direct: 'I will call you' -> She said she would call me.",
    example: "Example: Ali said: 'I like coding' -> Ali said that he liked coding. (Ali kod yozishni yoqtirishini aytdi).",
    summary: "Zamonlarning bir qadam o'tmishga o'zgarishini va olmoshlarning moslashishini nazorat qiling.",
    questions: [
      { q: "Direct: 'I live in Bukhara'. Reported: He said that he ___ in Bukhara:", a: ["lived", "lives", "will live", "living"], c: 0 },
      { q: "Direct gapdagi 'will' ko'chirma gapda nimaga aylanadi?", a: ["would", "can", "shall", "had"], c: 0 },
      { q: "Direct gapdagi 'am / is' ko'chirma gapda nima bo'ladi?", a: ["was", "were", "been", "is"], c: 0 },
      { q: "'He told ___ that he was ready' gapiga mos olmosh:", a: ["me", "to me", "I", "my"], c: 0 },
    ]
  },
  {
    grade: "8-sinf",
    title: "Essential Phrasal Verbs & Everyday Idioms",
    theory: "Phrasal verbs (iborali fe'llar) fe'l va predlogdan tashkil topib, asl ma'nosidan butunlay boshqa yangi ma'no hosil qiladi. Masalan: give up (taslim bo'lmoq, tashlamoq), look for (qidirmoq), turn on / off (yoqmoq / o'chirmoq), find out (aniqlamoq). Idiomalar esa xalqona ko'chma ma'noli iboralar (piece of cake = juda oson).",
    formulaOrRule: "Verb + Preposition/Adverb = Yangi idiomatik ma'no. Break down (buzilib qolmoq), wake up (uyg'onmoq).",
    example: "Example: Never give up on your dreams! (Orzularingizdan hech qachon voz kechmang). This test is a piece of cake. (Bu test suv qurg'oq, juda oson).",
    summary: "Phrasal fe'llar so'zlashuv nutqining asosini tashkil qiladi. Ularni gap ichida ma'nosi bilan yodlang.",
    questions: [
      { q: "'Give up' iborali fe'li ma'nosi nima?", a: ["Taslim bo'lmoq, voz kechmoq", "Sovg'a bermoq", "Yuqoriga qaramoq", "Boshlamoq"], c: 0 },
      { q: "'Look for' iborasi tarjimasi:", a: ["Qidirmoq", "Qaramoq", "O'xshamoq", "Kutmoq"], c: 0 },
      { q: "'A piece of cake' idiomsi qanday ma'noni bildiradi?", a: ["Juda oson ish", "Mazali pirojnoe", "Qiyin muammo", "Tug'ilgan kun"], c: 0 },
      { q: "'Turn off the light' nimani anglatadi?", a: ["Chiroqni o'chirishni", "Chiroqni yoqishni", "Chiroq sotib olishni", "Chiroqni tuzatishni"], c: 0 },
    ]
  },
];
