import { QuizQuestion } from '../types';

function shuffleQuestionOptions(item: QuizQuestion): QuizQuestion {
  const correctText = item.a[item.c];
  const arr = [...item.a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const newC = arr.indexOf(correctText);
  return { ...item, a: arr, c: newC >= 0 ? newC : 0 };
}

export function build500QuizQuestions(): QuizQuestion[] {
  const categories = ['Matematika', 'Informatika', 'Fizika', 'Mantiq', 'Geografiya', 'Tarix', 'Umumiy'];
  const list: QuizQuestion[] = [];

  const staticSeed: QuizQuestion[] = [
    {
      q: "O'zbekiston Respublikasining poytaxti qaysi shahar?",
      a: ["Toshkent", "Samarqand", "Buxoro", "Xiva"],
      c: 0,
      cat: "Geografiya",
    },
    {
      q: "Kompyuterning asosiy xotirasi (operativ) qisqartmasi nima?",
      a: ["RAM", "ROM", "CPU", "GPU"],
      c: 0,
      cat: "Informatika",
    },
    {
      q: "Fizikada tezlik formulasini ko'rsating:",
      a: ["v = s / t", "F = m * a", "E = m * c²", "P = U * I"],
      c: 0,
      cat: "Fizika",
    },
    {
      q: "25 ning kvadrati nechaga teng?",
      a: ["625", "525", "650", "600"],
      c: 0,
      cat: "Matematika",
    },
    {
      q: "Qaysi idishdan suv ichib bo'lmaydi?",
      a: ["Bo'sh idishdan", "Katta idishdan", "To'la idishdan", "Shisha idishdan"],
      c: 0,
      cat: "Mantiq",
    },
    {
      q: "Amir Temur nechanchi yilda tavallud topgan?",
      a: ["1336-yil", "1340-yil", "1370-yil", "1405-yil"],
      c: 0,
      cat: "Tarix",
    },
    {
      q: "Al-Xorazmiy qaysi fanning asoschisi hisoblanadi?",
      a: ["Algebra va algoritm", "Fizika", "Astronomiya", "Tibbiyot"],
      c: 0,
      cat: "Tarix",
    },
    {
      q: "Yer sharining necha foizini suv qoplagan?",
      a: ["Taxminan 71%", "Taxminan 50%", "Taxminan 85%", "Taxminan 60%"],
      c: 0,
      cat: "Geografiya",
    },
    {
      q: "Dasturlashda 'if' operatori nima uchun ishlatiladi?",
      a: ["Shartni tekshirish uchun", "Sikl takrorlash uchun", "Ekranni tozalash", "Faylni o'chirish"],
      c: 0,
      cat: "Informatika",
    },
    {
      q: "O'zbekiston Mustaqilligi qaysi yili e'lon qilingan?",
      a: ["1991-yil 1-sentyabr", "1990-yil 8-dekabr", "1992-yil 1-sentyabr", "1989-yil 21-oktyabr"],
      c: 0,
      cat: "Tarix",
    },
  ];

  list.push(...staticSeed);

  // Generate up to 500 systematic high-quality educational questions
  for (let i = list.length + 1; i <= 500; i++) {
    const cat = categories[i % categories.length];
    let q = '';
    let a: string[] = [];
    const c = 0;

    if (cat === 'Matematika') {
      const x = (i * 7) % 45 + 5;
      const y = (i * 3) % 25 + 3;
      const op = i % 3;
      if (op === 0) {
        const ans = x * y;
        q = `Matematika #${i}: ${x} * ${y} amalini bajaring:`;
        a = [`${ans}`, `${ans + 10}`, `${ans - 5}`, `${ans + y}`];
      } else if (op === 1) {
        const ans = x + y;
        q = `Matematika #${i}: ${x} + ${y} yig'indisini toping:`;
        a = [`${ans}`, `${ans + 2}`, `${ans - 3}`, `${ans + 10}`];
      } else {
        const ans = x * 2;
        q = `Matematika #${i}: ${x} sonining ikkilangani nechaga teng?`;
        a = [`${ans}`, `${ans - 2}`, `${ans + 4}`, `${x + 10}`];
      }
    } else if (cat === 'Informatika') {
      const qTypes = [
        {
          q: `Informatika #${i}: Veb-sahifalarni ko'rish uchun mo'ljallangan dastur nima deb ataladi?`,
          a: ["Brauzer (Browser)", "Antivirus", "Drayver", "Kompilyator"],
        },
        {
          q: `Informatika #${i}: 1 Kilobayt (KB) necha baytga teng?`,
          a: ["1024 bayt", "1000 bayt", "8 bayt", "256 bayt"],
        },
        {
          q: `Informatika #${i}: Ma'lumotlarni doimiy saqlovchi zamonaviy tezkor disk turi qaysi?`,
          a: ["SSD", "RAM", "Fleshka", "Kesh xotira"],
        },
        {
          q: `Informatika #${i}: URL qisqartmasi nimani bildiradi?`,
          a: ["Veb-manzil (Uniform Resource Locator)", "Internet tezligi", "Protsessor modeli", "Fayl kengaytmasi"],
        },
      ];
      const sel = qTypes[i % qTypes.length];
      q = sel.q;
      a = sel.a;
    } else if (cat === 'Fizika') {
      const qTypes = [
        {
          q: `Fizika #${i}: Kuch birligi Xalqaro SI sistemasida nima?`,
          a: ["Nyuton (N)", "Joul (J)", "Paskal (Pa)", "Vatt (W)"],
        },
        {
          q: `Fizika #${i}: Bosim birligi SI sistemasida qaysi?`,
          a: ["Paskal (Pa)", "Nyuton (N)", "Amper (A)", "Volt (V)"],
        },
        {
          q: `Fizika #${i}: Elektr toki qanday zarrachalarning tartibli harakatidir?`,
          a: ["Erkin elektronlarning", "Neytronlarning", "Molekulalarning", "Fotonlarning"],
        },
        {
          q: `Fizika #${i}: Yer sirtida erkin tushish tezlanishi (g) taxminan nechaga teng?`,
          a: ["9.8 m/s² (taxminan 10)", "5.5 m/s²", "15 m/s²", "1.6 m/s²"],
        },
      ];
      const sel = qTypes[i % qTypes.length];
      q = sel.q;
      a = sel.a;
    } else if (cat === 'Mantiq') {
      const qTypes = [
        {
          q: `Mantiq #${i}: Qaysi oyda 28 kun bor?`,
          a: ["Barcha oylarda", "Faqat fevralda", "Faqat yanvarda", "Faqat dekabrda"],
        },
        {
          q: `Mantiq #${i}: Odam qachon xonada boshsiz bo'ladi?`,
          a: ["Boshini derazadan tashqariga chiqarganda", "Uxlashdan oldin", "Qorong'ida", "Hech qachon"],
        },
        {
          q: `Mantiq #${i}: Suv tagida qaysi tosh quruq qoladi?`,
          a: ["Hech qanday tosh quruq qolmaydi", "Oq tosh", "Dumaloq tosh", "Katta tosh"],
        },
        {
          q: `Mantiq #${i}: Uni yeganingiz sari kattalashadigan narsa nima?`,
          a: ["Chuqurlik / o'ra", "Olma", "Non", "Tuxum"],
        },
      ];
      const sel = qTypes[i % qTypes.length];
      q = sel.q;
      a = sel.a;
    } else if (cat === 'Geografiya') {
      const qTypes = [
        {
          q: `Geografiya #${i}: Dunyodagi eng katta okean qaysi?`,
          a: ["Tinch okeani", "Atlantika okeani", "Hind okeani", "Shimoliy Muz okeani"],
        },
        {
          q: `Geografiya #${i}: Dunyodagi eng baland cho'qqi (Everest) qaysi tog' tizmasida joylashgan?`,
          a: ["Himolay tog'larida", "Alp tog'larida", "Tyan-Shan tog'larida", "And tog'larida"],
        },
        {
          q: `Geografiya #${i}: O'zbekiston hududidan o'tuvchi ikki yirik daryo qaysilar?`,
          a: ["Amudaryo va Sirdaryo", "Volga va Dnepr", "Nil va Amazonka", "Zarafshon va Chirchiq"],
        },
      ];
      const sel = qTypes[i % qTypes.length];
      q = sel.q;
      a = sel.a;
    } else if (cat === 'Tarix') {
      const qTypes = [
        {
          q: `Tarix #${i}: Mirzo Ulug'bek qaysi soha bo'yicha buyuk olim va rasadxona asoschisi bo'lgan?`,
          a: ["Astronomiya va matematika", "Biologiya", "Geologiya", "Kimyo"],
        },
        {
          q: `Tarix #${i}: Abu Ali ibn Sino qaysi asari bilan jahonga mashhur bo'lgan?`,
          a: ["Tib qonunlari (Al-Qonun fi at-tibb)", "Ziji jadidi Ko'ragoniy", "Boburnoma", "Xamsa"],
        },
        {
          q: `Tarix #${i}: Buyuk Ipak yo'lining markaziy savdo chorrahalaridan biri bo'lgan qadimiy shahar?`,
          a: ["Samarqand", "Parij", "London", "Madrid"],
        },
      ];
      const sel = qTypes[i % qTypes.length];
      q = sel.q;
      a = sel.a;
    } else {
      q = `Umumiy #${i}: O'zbekiston bayrog'ida nechta yulduz tasvirlangan?`;
      a = ["12 ta yulduz", "10 ta yulduz", "14 ta yulduz", "15 ta yulduz"];
    }

    list.push({ q, a, c, cat });
  }

  return list.map(shuffleQuestionOptions);
}
