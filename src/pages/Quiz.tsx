import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Trophy, CheckCircle, XCircle, RefreshCw, ChevronLeft, Award, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quizQuestions } from '../data/quizData';

export default function Quiz() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const isSomali = i18n.language === 'so';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);

  const q = quizQuestions[currentQuestion];

  const getQuestionText = () => {
    if (isSomali && q.text_so) return q.text_so;
    if (isArabic) return q.text_ar;
    return q.text_en;
  };

  const getOptions = () => {
    if (isSomali && q.options_so) return q.options_so;
    if (isArabic) return q.options_ar;
    return q.options_en;
  };

  const getExplanation = () => {
    if (isSomali && q.explanation_so) return q.explanation_so;
    if (isArabic) return q.explanation_ar;
    return q.explanation_en;
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === q.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([...answers, {
      questionId: q.id,
      selectedIndex: index,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const getRank = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return { ar: 'عالم', en: 'Scholar', so: 'Caalim' };
    if (percentage >= 60) return { ar: 'طالب علم', en: 'Seeker of Knowledge', so: 'Arday Cilmi' };
    return { ar: 'مبتدئ', en: 'Beginner', so: 'Bilaabe' };
  };

  const getRankText = () => {
    const rank = getRank();
    if (isSomali) return rank.so;
    if (isArabic) return rank.ar;
    return rank.en;
  };

  return (
    <div className="page-container pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`section-title text-2xl m-0 ${isArabic || isSomali ? 'arabic-text' : ''}`}>
            {isSomali ? 'Kediska Salafka' : isArabic ? 'اختبار المعرفة' : 'Knowledge Quiz'}
          </h1>
          <p className={`text-xs opacity-50 ${isArabic || isSomali ? 'arabic-text' : ''}`}>
            {isSomali ? 'Tijaabi aqoontaada ku saabsan Salafka' : isArabic ? 'اختبر معرفتك بسير وأقوال السلف الصالح' : 'Test your knowledge about the righteous predecessors'}
          </p>
        </div>
        <Link to="/" className={`neu-btn p-3 rounded-full text-[var(--color-primary)] hover:scale-105 transition-transform`}>
          <ChevronLeft size={20} className={isArabic || isSomali ? '' : 'rotate-180'} />
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            {/* Progress */}
            <div className="flex justify-between items-center mb-4 text-xs font-bold opacity-60">
              <span>{isSomali ? `Su'aasha ${currentQuestion + 1} ee ${quizQuestions.length}` : isArabic ? `السؤال ${currentQuestion + 1} من ${quizQuestions.length}` : `Question ${currentQuestion + 1} of ${quizQuestions.length}`}</span>
              <span>{isSomali ? `Dhibcaha: ${score}` : isArabic ? `النقاط: ${score}` : `Score: ${score}`}</span>
            </div>
            
            <div className="w-full h-2 bg-[var(--color-bg-alt)] rounded-full overflow-hidden mb-8">
              <motion.div 
                className="h-full bg-[var(--color-primary)]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question Card */}
            <div className="neu-card p-6 md:p-8 mb-8 relative islamic-pattern-gold">
              <div className="absolute top-4 right-4 text-[var(--color-gold)] opacity-20">
                <HelpCircle size={40} />
              </div>
              <h2 className={`text-xl md:text-2xl leading-relaxed font-bold mb-6 ${isArabic || isSomali ? 'arabic-text text-right' : 'text-left'}`} style={{ direction: isArabic || isSomali ? 'rtl' : 'ltr' }}>
                {getQuestionText()}
              </h2>

              {/* Options */}
              <div className="grid grid-cols-1 gap-4">
                {getOptions().map((option, index) => {
                  const isCorrect = index === q.correctAnswer;
                  const isSelected = selectedOption === index;
                  
                  let bgClass = 'bg-[var(--color-bg-alt)]';
                  let borderClass = 'border-transparent';
                  let textClass = 'text-[var(--color-text)]';
                  let icon = null;

                  if (isAnswered) {
                    if (isCorrect) {
                      bgClass = 'bg-green-500/10';
                      borderClass = 'border-green-500';
                      textClass = 'text-green-600 dark:text-green-400 font-bold';
                      icon = <CheckCircle className="text-green-500" size={18} />;
                    } else if (isSelected) {
                      bgClass = 'bg-red-500/10';
                      borderClass = 'border-red-500';
                      textClass = 'text-red-600 dark:text-red-400 font-bold';
                      icon = <XCircle className="text-red-500" size={18} />;
                    } else {
                      bgClass = 'bg-[var(--color-bg-alt)] opacity-50';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-[var(--color-primary)]';
                    bgClass = 'bg-[var(--color-primary)]/5';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border-2 text-sm text-right flex items-center justify-between transition-all ${bgClass} ${borderClass} ${textClass} ${isArabic || isSomali ? 'flex-row' : 'flex-row-reverse'} hover:scale-[1.01] active:scale-[0.99]`}
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className={`font-bold ${isArabic || isSomali ? 'arabic-text' : ''}`}>{option}</span>
                      </div>
                      <span className="text-[10px] opacity-40 font-mono">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 rounded-xl bg-[var(--color-primary)]/5 border-l-4 border-[var(--color-gold)] text-xs leading-relaxed"
                  >
                    <p className={`font-bold text-[var(--color-gold)] mb-1 ${isArabic || isSomali ? 'arabic-text text-right' : 'text-left'}`}>
                      {isSomali ? 'Sharaxaad:' : isArabic ? 'توضيح:' : 'Explanation:'}
                    </p>
                    <p className={`opacity-80 ${isArabic || isSomali ? 'arabic-text text-right' : 'text-left'}`}>
                      {getExplanation()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Button */}
            {isAnswered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                className={`w-full py-4 rounded-2xl neu-btn-primary flex items-center justify-center gap-2 font-bold shadow-lg transition-all active:scale-95 ${isArabic || isSomali ? 'arabic-text' : ''}`}
              >
                {currentQuestion < quizQuestions.length - 1 
                  ? (isSomali ? 'Su\'aasha Xigta' : isArabic ? 'السؤال التالي' : 'Next Question')
                  : (isSomali ? 'Eeg Natiijada' : isArabic ? 'عرض النتيجة' : 'See Results')}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto neu-card p-8 text-center relative overflow-hidden islamic-pattern"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
            
            <div className="w-20 h-20 mx-auto bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Trophy size={40} />
            </div>

            <h2 className={`text-2xl font-bold mb-2 ${isArabic || isSomali ? 'arabic-text' : ''}`}>
              {isSomali ? 'Waa laguu hambalyeynayaa!' : isArabic ? 'تم اكتمال الاختبار!' : 'Quiz Completed!'}
            </h2>
            <p className={`text-sm opacity-60 mb-6 ${isArabic || isSomali ? 'arabic-text' : ''}`}>
              {isSomali ? 'Waxaad dhamaysatay kediska.' : isArabic ? 'لقد أكملت اختبار المعرفة بنجاح.' : 'You have successfully completed the quiz.'}
            </p>

            {/* Score Display */}
            <div className="bg-[var(--color-bg-alt)] rounded-2xl p-6 mb-6 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">
                {isSomali ? 'Natiijadaada' : isArabic ? 'درجتك' : 'Your Score'}
              </span>
              <span className="text-5xl font-black text-[var(--color-primary)] mb-2 font-mono">
                {score} / {quizQuestions.length}
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-gold)]">
                <Award size={16} />
                <span className={isArabic || isSomali ? 'arabic-text' : ''}>{getRankText()}</span>
              </div>
            </div>

            {/* Button Actions */}
            <div className="space-y-4">
              <button
                onClick={handleRestart}
                className={`w-full py-4 rounded-2xl neu-btn-primary flex items-center justify-center gap-2 font-bold shadow-lg transition-all active:scale-95 ${isArabic || isSomali ? 'arabic-text' : ''}`}
              >
                <RefreshCw size={18} />
                {isSomali ? 'Mar Kale Bilow' : isArabic ? 'إعادة الاختبار' : 'Restart Quiz'}
              </button>
              
              <Link
                to="/"
                className={`w-full py-4 rounded-2xl neu-btn flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 ${isArabic || isSomali ? 'arabic-text' : ''}`}
              >
                {isSomali ? 'Ku Noqo Hoyga' : isArabic ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
