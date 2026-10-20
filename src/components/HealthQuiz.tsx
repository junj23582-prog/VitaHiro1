import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types/game';
import { HEALTH_QUIZ_DATA } from '../data/quizData';
import { soundFx } from '../utils/soundEffects';
import { addXPAndCoins, updateHighScore, unlockAchievement } from '../utils/storage';
import { HelpCircle, CheckCircle2, XCircle, Zap, Clock, Lightbulb, RotateCcw } from 'lucide-react';

interface HealthQuizProps {
  onBackToHome: () => void;
  onProfileUpdate: () => void;
}

export const HealthQuiz: React.FC<HealthQuizProps> = ({ onBackToHome, onProfileUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizFinished, setQuizFinished] = useState(false);
  const [lifelineHintUsed, setLifelineHintUsed] = useState(false);
  const [showHintText, setShowHintText] = useState<string | null>(null);
  const [highScore, setHighScore] = useState(0);

  const currentQ: QuizQuestion = HEALTH_QUIZ_DATA[currentIndex % HEALTH_QUIZ_DATA.length];

  // Load high score
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vitahero_player_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        setHighScore(parsed.highScores?.mythQuiz || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isAnswered || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, quizFinished]);

  const handleTimeOut = () => {
    soundFx.playError();
    setIsAnswered(true);
    setStreak(0);
  };

  const handleAnswer = (answer: number | boolean) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentQ.correctAnswer;

    if (isCorrect) {
      soundFx.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const multiplier = Math.min(3, 1 + newStreak * 0.25);
      const points = Math.round((100 + timeLeft * 5) * multiplier);
      const nextScore = score + points;
      setScore(nextScore);

      addXPAndCoins(40, 10);
      if (newStreak >= 5) {
        unlockAchievement('myth_slayer');
      }
      onProfileUpdate();
    } else {
      soundFx.playError();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex >= HEALTH_QUIZ_DATA.length - 1) {
      setQuizFinished(true);
      updateHighScore('mythQuiz', score);
      onProfileUpdate();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setShowHintText(null);
    }
  };

  const handleUseHint = () => {
    if (lifelineHintUsed || isAnswered) return;
    soundFx.playClick();
    setLifelineHintUsed(true);
    setShowHintText(`Kategori: ${currentQ.category}. Perhatikan prinsip dasar metabolisme & bukti klinis.`);
  };

  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(20);
    setQuizFinished(false);
    setLifelineHintUsed(false);
    setShowHintText(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Kuis Mitos vs Fakta Medis
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              SOAL {currentIndex + 1}/{HEALTH_QUIZ_DATA.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Uji pengetahuan seputar mitos nutrisi, kekebalan tubuh, dan fakta klinis berlandaskan sains kedokteran.
          </p>
        </div>

        {/* HUD Stats */}
        <div className="flex items-center gap-3 text-xs">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-400 animate-ping' : 'text-amber-400'}`} />
            <div className="flex flex-col">
              <span className="text-slate-400">Waktu</span>
              <span className={`font-bold font-mono tabular-nums ${timeLeft <= 5 ? 'text-rose-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-slate-400">Runtun (Streak)</span>
              <span className="font-bold text-amber-300 font-mono tabular-nums">{streak}x</span>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Skor:</span>
            <span className="font-bold text-emerald-300 font-mono tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          {/* Category Tag & Lifeline */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              TOPIK: <span className="text-emerald-400">{currentQ.category}</span>
            </span>

            {!lifelineHintUsed && !isAnswered && (
              <button
                onClick={handleUseHint}
                className="px-3 py-1 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Petunjuk Pakar</span>
              </button>
            )}
          </div>

          {/* Hint alert */}
          {showHintText && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{showHintText}</span>
            </div>
          )}

          {/* Question text */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
            "{currentQ.question}"
          </h3>

          {/* Answer Options */}
          {currentQ.type === 'myth_or_fact' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* MITOS Button */}
              <button
                onClick={() => handleAnswer(false)}
                disabled={isAnswered}
                className={`py-4 px-6 rounded-xl border font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  isAnswered
                    ? currentQ.correctAnswer === false
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : selectedAnswer === false
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-white hover:border-slate-500'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>MITOS</span>
              </button>

              {/* FAKTA Button */}
              <button
                onClick={() => handleAnswer(true)}
                disabled={isAnswered}
                className={`py-4 px-6 rounded-xl border font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  isAnswered
                    ? currentQ.correctAnswer === true
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : selectedAnswer === true
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-white hover:border-slate-500'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>FAKTA</span>
              </button>
            </div>
          ) : (
            // Multiple Choice Options
            <div className="space-y-3 mb-6">
              {currentQ.options?.map((opt, idx) => {
                const isCorrectOption = idx === currentQ.correctAnswer;
                const isSelected = selectedAnswer === idx;

                let optClass = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-white';
                if (isAnswered) {
                  if (isCorrectOption) {
                    optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                  } else if (isSelected) {
                    optClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                  } else {
                    optClass = 'bg-slate-900/50 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optClass}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Explanation Callout (Displayed once answered) */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 animate-fadeIn">
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                PENJELASAN ILMIAH & KLINIS:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-md"
            >
              {currentIndex < HEALTH_QUIZ_DATA.length - 1 ? 'Lanjut Soal Berikutnya →' : 'Lihat Hasil Akhir'}
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-800 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Kuis Mitos Medis Selesai!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Kamu telah menuntaskan seluruh tantangan edukasi mitos kesehatan dengan pemahaman klinis yang lebih baik.
          </p>

          <div className="flex items-center justify-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-sm mx-auto mb-6">
            <div>
              <span className="text-xs text-slate-400 block">Total Skor Kamu</span>
              <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">{score}</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400 block">Skor Tertinggi</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{Math.max(score, highScore)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onBackToHome();
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
