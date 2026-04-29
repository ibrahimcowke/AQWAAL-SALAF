export interface Question {
  id: string;
  text_ar: string;
  text_en: string;
  text_so: string;
  options_ar: string[];
  options_en: string[];
  options_so: string[];
  correctAnswer: number;
  explanation_ar: string;
  explanation_en: string;
  explanation_so: string;
}

export const quizQuestions: Question[] = [
  {
    id: 'q-001',
    text_ar: 'ابن آدمَ، إنما أنتَ أيامٌ، فكلما ذهبَ يومٌ ذهبَ بعضُك. من القائل؟',
    text_en: '"O son of Adam, you are but days..." Who said this?',
    text_so: '"Ina Aadamow, waxaad tahay maalmo kooban..." Waa kuma qofka yiri hadalkan?',
    options_ar: ['الحسن البصري', 'ابن القيم', 'الإمام الشافعي', 'عمر بن الخطاب'],
    options_en: ['Al-Hasan Al-Basri', 'Ibn Al-Qayyim', "Imam Al-Shafi'i", 'Umar ibn Al-Khattab'],
    options_so: ['Al-Xasan Al-Basri', 'Ibnu Qayyim', 'Imaam Al-Shaafici', 'Cumar bin Al-Khattaab'],
    correctAnswer: 0,
    explanation_ar: 'الحسن البصري هو القائل، وهو تذكير بقيمة الوقت.',
    explanation_en: 'Al-Hasan Al-Basri said this to remind us of the value of time.',
    explanation_so: 'Al-Xasan Al-Basri ayaa yiri si uu inoo xasuusiyo qiimaha waqtiga.'
  },
  {
    id: 'q-002',
    text_ar: 'من هو الصحابي الملقب بـ "حبر الأمة وترجمان القرآن"؟',
    text_en: 'Which companion is known as the "Scholar of the Ummah and Interpreter of the Quran"?',
    text_so: 'Waa kuma saxaabiga loo yaqaan "Caalimka ummadda iyo turjumaankii Quraanka"?',
    options_ar: ['عبد الله بن مسعود', 'عبد الله بن عباس', 'أبو بكر الصديق', 'علي بن أبي طالب'],
    options_en: ["Abdullah ibn Mas'ud", 'Abdullah ibn Abbas', 'Abu Bakr Al-Siddiq', 'Ali ibn Abi Talib'],
    options_so: ['Cabdullaahi bin Mascuud', 'Cabdullaahi bin Cabbaas', 'Abuu Bakar Al-Siddiiq', 'Cali bin Abii Daalib'],
    correctAnswer: 1,
    explanation_ar: 'عبد الله بن عباس رضي الله عنهما دعا له النبي ﷺ بالفقه والتأويل.',
    explanation_en: 'Abdullah ibn Abbas, the Prophet ﷺ prayed for him to understand the religion.',
    explanation_so: 'Cabdullaahi bin Cabbaas Alle ha ka raali noqdee.'
  },
  {
    id: 'q-003',
    text_ar: 'ليس العلمُ ما يُحفَظُ في الصدور، إنما العلمُ ما نفَعَ. من القائل؟',
    text_en: '"Knowledge is not what is memorized, knowledge is what benefits." Who said this?',
    text_so: '"Cilmigu maaha waxa laabta lagu xifdiyo..." Waa kuma qofka yiri hadalkan?',
    options_ar: ['الإمام مالك', 'الإمام الشافعي', 'الإمام أحمد', 'ابن تيمية'],
    options_en: ['Imam Malik', "Imam Al-Shafi'i", 'Imam Ahmad', 'Ibn Taymiyyah'],
    options_so: ['Imaam Maalik', 'Imaam Al-Shaafici', 'Imaam Axmed', 'Ibnu Taymiyah'],
    correctAnswer: 1,
    explanation_ar: 'الإمام الشافعي هو القائل، وهو يحث على العمل بالعلم.',
    explanation_en: "Imam Al-Shafi'i emphasized that knowledge must be put into action.",
    explanation_so: 'Imaam Al-Shaafici ayaa sheegay in cilmiga loogu talagalay in lagu camal falo.'
  },
  {
    id: 'q-004',
    text_ar: 'من هو مؤلف كتاب "الجامع الصحيح" (صحيح البخاري)؟',
    text_en: 'Who is the author of "Sahih Al-Bukhari"?',
    text_so: 'Waa kuma qoraaga kitaabka "Saxiixul Bukhaari"?',
    options_ar: ['الإمام مسلم', 'الإمام البخاري', 'ابن رجب', 'الإمام الشافعي'],
    options_en: ['Imam Muslim', 'Imam Al-Bukhari', 'Ibn Rajab', "Imam Al-Shafi'i"],
    options_so: ['Imaam Muslim', 'Imaam Al-Bukhaari', 'Ibnu Rajab', 'Imaam Al-Shaafici'],
    correctAnswer: 1,
    explanation_ar: 'الإمام البخاري رحمه الله هو جامع أصح كتاب بعد القرآن.',
    explanation_en: 'Imam Al-Bukhari compiled the most authentic book after the Quran.',
    explanation_so: 'Imaam Al-Bukhaari ayaa ururiyay kitaabka ugu saxsan Quraanka ka dib.'
  },
  {
    id: 'q-005',
    text_ar: 'نحنُ قومٌ أعزَّنا اللهُ بالإسلام، فمهما ابتغَينا العزةَ في غيرِه أذلَّنا الله. من القائل؟',
    text_en: '"We are a people whom Allah honored with Islam..." Who said this?',
    text_so: '"Anagu waxaan nahay qoom uu Alle kor ugu qaaday Islaamka..." Waa kuma qofka yiri hadalkan?',
    options_ar: ['أبو بكر الصديق', 'عمر بن الخطاب', 'علي بن أبي طالب', 'ابن تيمية'],
    options_en: ['Abu Bakr Al-Siddiq', 'Umar ibn Al-Khattab', 'Ali ibn Abi Talib', 'Ibn Taymiyyah'],
    options_so: ['Abuu Bakar Al-Siddiiq', 'Cumar bin Al-Khattaab', 'Cali bin Abii Daalib', 'Ibnu Taymiyah'],
    correctAnswer: 1,
    explanation_ar: 'عمر بن الخطاب رضي الله عنه قالها في فتح بيت المقدس.',
    explanation_en: 'Umar ibn Al-Khattab said this during the conquest of Jerusalem.',
    explanation_so: 'Cumar bin Al-Khattaab Alle ha ka raali noqdee.'
  }
];
