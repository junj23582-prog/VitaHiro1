import React, { useState, useEffect } from 'react';
import { FoodItem, MealOrder } from '../types/game';
import { FOOD_DATABASE, MEAL_ORDERS } from '../data/nutriFoodData';
import { soundFx } from '../utils/soundEffects';
import { addXPAndCoins, updateHighScore, unlockAchievement } from '../utils/storage';
import { Clock, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

interface NutriPlateGameProps {
  onBackToHome: () => void;
  onProfileUpdate: () => void;
}

export const NutriPlateGame: React.FC<NutriPlateGameProps> = ({ onBackToHome, onProfileUpdate }) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [plateItems, setPlateItems] = useState<FoodItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'karbohidrat' | 'sayuran' | 'protein' | 'buah' | 'junk_warning'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const currentOrder: MealOrder = MEAL_ORDERS[currentOrderIndex];

  // Reset timer on order switch
  useEffect(() => {
    setTimeLeft(currentOrder.timeLimitSeconds);
    setPlateItems([]);
    setIsSuccess(false);
    setIsGameOver(false);
    setFeedbackMessage(null);
  }, [currentOrderIndex, currentOrder.timeLimitSeconds]);

  // Countdown timer
  useEffect(() => {
    if (isGameOver || isSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundFx.playError();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isSuccess]);

  // Count items on plate by category
  const carbsCount = plateItems.filter((f) => f.category === 'karbohidrat').length;
  const veggiesCount = plateItems.filter((f) => f.category === 'sayuran').length;
  const proteinCount = plateItems.filter((f) => f.category === 'protein').length;
  const fruitCount = plateItems.filter((f) => f.category === 'buah').length;
  const junkCount = plateItems.filter((f) => f.category === 'junk_warning').length;

  const totalCalories = plateItems.reduce((acc, f) => acc + f.calories, 0);

  const handleAddFood = (food: FoodItem) => {
    if (isGameOver || isSuccess) return;

    if (food.category === 'junk_warning') {
      soundFx.playDamage();
      setFeedbackMessage(`Peringatan: ${food.penaltyWarning}`);
    } else {
      soundFx.playClick();
      setFeedbackMessage(null);
    }

    setPlateItems((prev) => [...prev, food]);
  };

  const handleRemoveItem = (index: number) => {
    if (isGameOver || isSuccess) return;
    soundFx.playClick();
    setPlateItems((prev) => prev.filter((_, i) => i !== index));
    setFeedbackMessage(null);
  };

  const handleClearPlate = () => {
    soundFx.playClick();
    setPlateItems([]);
    setFeedbackMessage(null);
  };

  const handleEvaluatePlate = () => {
    const carbsValid = carbsCount === currentOrder.requiredCarbs;
    const veggiesValid = veggiesCount === currentOrder.requiredVeggies;
    const proteinValid = proteinCount === currentOrder.requiredProtein;
    const fruitValid = fruitCount === currentOrder.requiredFruit;
    const noJunk = junkCount <= currentOrder.maxJunkAllowed;

    if (carbsValid && veggiesValid && proteinValid && fruitValid && noJunk) {
      // Success!
      soundFx.playSuccess();
      const pointsGained = 150 + timeLeft * 5;
      setScore((prev) => prev + pointsGained);
      setIsSuccess(true);
      addXPAndCoins(120, 25);
      unlockAchievement('master_chef_gizi');
      updateHighScore('nutriPlate', score + pointsGained);
      onProfileUpdate();
    } else {
      soundFx.playError();
      const issues: string[] = [];
      if (!carbsValid) issues.push(`Karbohidrat butuh ${currentOrder.requiredCarbs} porsi`);
      if (!veggiesValid) issues.push(`Sayuran butuh ${currentOrder.requiredVeggies} porsi`);
      if (!proteinValid) issues.push(`Protein butuh ${currentOrder.requiredProtein} porsi`);
      if (!fruitValid) issues.push(`Buah butuh ${currentOrder.requiredFruit} porsi`);
      if (!noJunk) issues.push(`Ada makanan olahan tinggi garam/gula/minyak trans yang harus disingkirkan!`);

      setFeedbackMessage(`Piring belum seimbang: ${issues.join(' · ')}`);
    }
  };

  const handleNextOrder = () => {
    if (currentOrderIndex < MEAL_ORDERS.length - 1) {
      setCurrentOrderIndex((prev) => prev + 1);
    } else {
      // Completed all orders!
      setIsGameOver(true);
      updateHighScore('nutriPlate', score);
      onProfileUpdate();
    }
  };

  const filteredFoods = activeCategory === 'all'
    ? FOOD_DATABASE
    : FOOD_DATABASE.filter((f) => f.category === activeCategory);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Top Banner & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              NutriPlate: Isi Piringku Sehat
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              TANTANGAN {currentOrderIndex + 1}/{MEAL_ORDERS.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Susun proporsi gizi seimbang sesuai anjuran klinis Kementerian Kesehatan RI (1/3 Karbohidrat, 1/3 Sayuran, 1/6 Lauk, 1/6 Buah).
          </p>
        </div>

        {/* Status Strip */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <div className="flex flex-col">
              <span className="text-slate-400">Sisa Waktu</span>
              <span className={`font-bold font-mono tabular-nums ${timeLeft <= 10 ? 'text-rose-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-slate-400">Total Skor</span>
              <span className="font-bold text-emerald-300 font-mono tabular-nums">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient / Client Case Card */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Konsultasi Pasien</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">{currentOrder.patientName}</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {currentOrder.condition}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {currentOrder.description}
            </p>
          </div>

          {/* Target checklist counts */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Karbo</span>
              <span className={`font-mono font-bold ${carbsCount === currentOrder.requiredCarbs ? 'text-emerald-400' : 'text-amber-400'}`}>
                {carbsCount}/{currentOrder.requiredCarbs}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Sayuran</span>
              <span className={`font-mono font-bold ${veggiesCount === currentOrder.requiredVeggies ? 'text-emerald-400' : 'text-amber-400'}`}>
                {veggiesCount}/{currentOrder.requiredVeggies}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Protein</span>
              <span className={`font-mono font-bold ${proteinCount === currentOrder.requiredProtein ? 'text-emerald-400' : 'text-amber-400'}`}>
                {proteinCount}/{currentOrder.requiredProtein}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Buah</span>
              <span className={`font-mono font-bold ${fruitCount === currentOrder.requiredFruit ? 'text-emerald-400' : 'text-amber-400'}`}>
                {fruitCount}/{currentOrder.requiredFruit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Active Plate, Right = Food Shelf */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Plate Assembly Workspace (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-300">Piring Sajian Aktif</span>
            <span className="text-slate-400 font-mono tabular-nums">
              Est. Kalori: <strong className="text-white">{totalCalories} kkal</strong>
            </span>
          </div>

          {/* Circular Plate Graphic / Drop Zone */}
          <div className="relative w-72 h-72 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-800 shadow-inner flex items-center justify-center p-3 mb-4">
            {plateItems.length === 0 ? (
              <div className="text-center p-6 text-xs text-slate-500">
                <span className="text-3xl block mb-2">🍽️</span>
                <span>Piring masih kosong. Pilih bahan makanan bergizi dari rak di samping.</span>
              </div>
            ) : (
              <div className="w-full h-full rounded-full grid grid-cols-2 grid-rows-2 gap-2 p-3 overflow-hidden">
                {plateItems.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => handleRemoveItem(idx)}
                    title="Klik untuk menghapus dari piring"
                    className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/60 transition-all group"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] text-slate-200 truncate w-full text-center mt-1">
                      {item.name}
                    </span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feedback or warning alert */}
          {feedbackMessage && (
            <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Plate action buttons */}
          <div className="w-full flex items-center gap-3">
            <button
              onClick={handleClearPlate}
              disabled={plateItems.length === 0 || isSuccess}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
            <button
              onClick={handleEvaluatePlate}
              disabled={plateItems.length === 0 || isSuccess}
              className="flex-1 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sajikan & Cek Nutrisi</span>
            </button>
          </div>

          {/* Success Overlay / Next Order Modal */}
          {isSuccess && (
            <div className="mt-4 w-full p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span>Gizi Sempurna Sesuai Standar!</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Kombinasi mikro dan makronutrien sesuai anjuran piring sehat pasien.
              </p>
              <button
                onClick={handleNextOrder}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{currentOrderIndex < MEAL_ORDERS.length - 1 ? 'Lanjut Pasien Berikutnya' : 'Selesaikan Sesi'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Food Category Shelves (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl p-5 border border-slate-800">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Menu
            </button>
            <button
              onClick={() => setActiveCategory('karbohidrat')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'karbohidrat'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Karbohidrat
            </button>
            <button
              onClick={() => setActiveCategory('sayuran')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'sayuran'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sayuran
            </button>
            <button
              onClick={() => setActiveCategory('protein')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'protein'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Protein
            </button>
            <button
              onClick={() => setActiveCategory('buah')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'buah'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Buah Segar
            </button>
            <button
              onClick={() => setActiveCategory('junk_warning')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'junk_warning'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Ultra-Processed (Hindari!)
            </button>
          </div>

          {/* Grid of Food Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredFoods.map((food) => {
              const isJunk = food.category === 'junk_warning';
              return (
                <div
                  key={food.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isJunk
                      ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60'
                      : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl p-2 rounded-lg bg-slate-950 shrink-0">
                      {food.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">
                          {food.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums block mt-0.5">
                        {food.calories} kkal
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {food.benefits}
                  </p>

                  <button
                    onClick={() => handleAddFood(food)}
                    className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      isJunk
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200'
                    }`}
                  >
                    <span>+ Masukkan ke Piring</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
