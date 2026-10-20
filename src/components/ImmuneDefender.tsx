import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundFx } from '../utils/soundEffects';
import { addXPAndCoins, updateHighScore, unlockAchievement } from '../utils/storage';
import { Play, RotateCcw, Volume2, ShieldCheck, Heart, Zap, Crosshair } from 'lucide-react';

interface ImmuneDefenderProps {
  onBackToHome: () => void;
  onProfileUpdate: () => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'WAVE_CLEARED' | 'GAME_OVER';

interface Enemy {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  hp: number;
  maxHp: number;
  type: 'virus' | 'bakteri' | 'radikal_bebas' | 'glukosa';
  label: string;
  color: string;
  angle: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
}

interface DropItem {
  id: number;
  x: number;
  y: number;
  type: 'vitamin_c' | 'h2o' | 'vaksin_shield';
  label: string;
  radius: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

const WAVE_HEALTH_FACTS = [
  "Leukosit memproduksi antibodi spesifik yang menempel pada protein lonjakan (spike) virus untuk menonaktifkannya.",
  "Hidrasi air putih yang cukup membantu melarutkan racun metabolik dan melancarkan aliran kelenjar getah bening (limfa).",
  "Vitamin C merangsang aktivitas fagositosis sel darah putih dalam memakan mikroorganisme patogen penyerang.",
  "Kurang tidur menurunkan jumlah sel Natural Killer (NK Cells) hingga 70% hanya dalam satu malam!",
  "Demam ringan sebenarnya adalah mekanisme alami tubuh untuk memperlambat laju replikasi virus dan bakteri.",
  "Vaksinasi melatih sistem imun mengenali patogen tiruan sebelum infeksi asli yang berbahaya menyerang.",
  "Stres berlebih memicu kortisol tinggi yang melumpuhkan sinyal komunikasi antar-sel darah putih.",
  "Konsumsi sayur warna-warni kaya antioksidan menetralkan radikal bebas sebelum merusak DNA sel.",
];

export const ImmuneDefender: React.FC<ImmuneDefenderProps> = ({ onBackToHome, onProfileUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [organHealth, setOrganHealth] = useState(100);
  const [defeatedCount, setDefeatedCount] = useState(0);
  const [waveTip, setWaveTip] = useState(WAVE_HEALTH_FACTS[0]);
  const [autoFire, setAutoFire] = useState(true);
  const [highScore, setHighScore] = useState(0);

  // Player state refs to avoid closure stale state in animation loop
  const playerRef = useRef({
    x: 400,
    y: 450,
    radius: 24,
    speed: 6,
    shieldTimer: 0,
    rapidFireTimer: 0,
  });

  const keysPressed = useRef<Record<string, boolean>>({});
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const dropsRef = useRef<DropItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastShotTime = useRef(0);
  const enemiesSpawnedThisWave = useRef(0);
  const targetEnemiesPerWave = useRef(15);
  const animationFrameId = useRef<number | null>(null);

  // Sync high score initially
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vitahero_player_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        setHighScore(parsed.highScores?.immuneDefender || 0);
      }
    } catch {
      // fallback
    }
  }, []);

  const spawnParticles = (x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        alpha: 1,
        color,
      });
    }
  };

  const spawnEnemy = useCallback((canvasWidth: number) => {
    const types: Enemy['type'][] = ['virus', 'bakteri', 'radikal_bebas', 'glukosa'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * (canvasWidth - 80) + 40;
    const y = -30;

    let hp = 1;
    let speed = 1.6 + wave * 0.25;
    let radius = 18;
    let color = '#ef4444';
    let label = 'Virus Flu';

    if (chosenType === 'bakteri') {
      hp = 3 + Math.floor(wave / 2);
      speed = 1.1 + wave * 0.15;
      radius = 24;
      color = '#f97316';
      label = 'Bakteri Patogen';
    } else if (chosenType === 'radikal_bebas') {
      hp = 2;
      speed = 2.0 + wave * 0.2;
      radius = 16;
      color = '#ec4899';
      label = 'Radikal Bebas';
    } else if (chosenType === 'glukosa') {
      hp = 4 + wave;
      speed = 0.9;
      radius = 26;
      color = '#eab308';
      label = 'Glukosa Toksik';
    }

    enemiesRef.current.push({
      id: Math.random(),
      x,
      y,
      radius,
      speed,
      hp,
      maxHp: hp,
      type: chosenType,
      label,
      color,
      angle: 0,
    });
    enemiesSpawnedThisWave.current += 1;
  }, [wave]);

  const shootBullet = useCallback(() => {
    const p = playerRef.current;
    const isRapid = p.rapidFireTimer > 0;
    soundFx.playLaser();

    if (isRapid) {
      // Triple spread
      bulletsRef.current.push(
        { x: p.x - 10, y: p.y - 15, vx: -1.5, vy: -10, radius: 4, damage: 2 },
        { x: p.x, y: p.y - 20, vx: 0, vy: -11, radius: 5, damage: 2 },
        { x: p.x + 10, y: p.y - 15, vx: 1.5, vy: -10, radius: 4, damage: 2 }
      );
    } else {
      bulletsRef.current.push({
        x: p.x,
        y: p.y - 20,
        vx: 0,
        vy: -9,
        radius: 4,
        damage: 1.5,
      });
    }
  }, []);

  const handleStartGame = () => {
    soundFx.playClick();
    setGameState('PLAYING');
    setScore(0);
    setWave(1);
    setOrganHealth(100);
    setDefeatedCount(0);
    enemiesRef.current = [];
    bulletsRef.current = [];
    dropsRef.current = [];
    particlesRef.current = [];
    enemiesSpawnedThisWave.current = 0;
    targetEnemiesPerWave.current = 14;
    playerRef.current = {
      x: 350,
      y: 420,
      radius: 24,
      speed: 6,
      shieldTimer: 0,
      rapidFireTimer: 0,
    };
  };

  const handleNextWave = () => {
    soundFx.playSuccess();
    setWave((prev) => {
      const nextWave = prev + 1;
      targetEnemiesPerWave.current = 14 + nextWave * 4;
      enemiesSpawnedThisWave.current = 0;
      enemiesRef.current = [];
      bulletsRef.current = [];
      setWaveTip(WAVE_HEALTH_FACTS[nextWave % WAVE_HEALTH_FACTS.length]);
      return nextWave;
    });
    setGameState('PLAYING');
  };

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' && gameState === 'PLAYING' && !autoFire) {
        shootBullet();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, autoFire, shootBullet]);

  // Mouse / Touch pointer control
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Smooth boundary clamp
    playerRef.current.x = Math.max(30, Math.min(canvas.width - 30, mouseX));
    playerRef.current.y = Math.max(50, Math.min(canvas.height - 40, mouseY));
  };

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let localDefeated = defeatedCount;

    const updateAndRender = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const p = playerRef.current;

      // Handle Keyboard Movement
      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
        p.x = Math.max(30, p.x - p.speed);
      }
      if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
        p.x = Math.min(canvas.width - 30, p.x + p.speed);
      }
      if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
        p.y = Math.max(40, p.y - p.speed);
      }
      if (keysPressed.current['arrowdown'] || keysPressed.current['s']) {
        p.y = Math.min(canvas.height - 40, p.y + p.speed);
      }

      // Decrement powerup timers
      if (p.shieldTimer > 0) p.shieldTimer -= 1;
      if (p.rapidFireTimer > 0) p.rapidFireTimer -= 1;

      // Auto Fire
      if (autoFire && now - lastShotTime.current > (p.rapidFireTimer > 0 ? 140 : 260)) {
        shootBullet();
        lastShotTime.current = now;
      }

      // Spawning enemies
      if (
        enemiesSpawnedThisWave.current < targetEnemiesPerWave.current &&
        Math.random() < 0.035 + wave * 0.005
      ) {
        spawnEnemy(canvas.width);
      }

      // Clear Canvas
      ctx.fillStyle = '#060e20';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle blood vessel grid lines & particles
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Host Organ Protection Zone at the bottom
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('ZONA ORGAN VITAL (JANTUNG & PARU-PARU) - LINDUNGI DARI PATOGEN!', canvas.width / 2, canvas.height - 12);

      // Update & Draw Bullets
      for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const b = bulletsRef.current[i];
        b.x += b.vx;
        b.y += b.vy;

        // Draw bullet glow
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (b.y < -10 || b.x < 0 || b.x > canvas.width) {
          bulletsRef.current.splice(i, 1);
        }
      }

      // Update & Draw Drops
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const d = dropsRef.current[i];
        d.y += d.vy;

        // Check collision with player
        const distToPlayer = Math.hypot(d.x - p.x, d.y - p.y);
        if (distToPlayer < d.radius + p.radius) {
          soundFx.playCollect();
          if (d.type === 'vitamin_c') {
            p.rapidFireTimer = 350; // Rapid fire ~6s
            spawnParticles(d.x, d.y, '#eab308', 12);
          } else if (d.type === 'h2o') {
            setOrganHealth((prev) => Math.min(100, prev + 25));
            spawnParticles(d.x, d.y, '#38bdf8', 12);
          } else if (d.type === 'vaksin_shield') {
            p.shieldTimer = 300; // Invulnerable ~5s
            spawnParticles(d.x, d.y, '#10b981', 14);
          }
          dropsRef.current.splice(i, 1);
          continue;
        }

        // Draw drop item
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = d.type === 'vitamin_c' ? '#f59e0b' : d.type === 'h2o' ? '#0ea5e9' : '#10b981';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText(d.label, d.x, d.y + 3);

        if (d.y > canvas.height + 20) {
          dropsRef.current.splice(i, 1);
        }
      }

      // Update & Draw Enemies
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const e = enemiesRef.current[i];
        e.y += e.speed;
        e.angle += 0.03;

        // Check bullet hits
        let enemyKilled = false;
        for (let j = bulletsRef.current.length - 1; j >= 0; j--) {
          const b = bulletsRef.current[j];
          const dist = Math.hypot(e.x - b.x, e.y - b.y);
          if (dist < e.radius + b.radius) {
            e.hp -= b.damage;
            bulletsRef.current.splice(j, 1);
            spawnParticles(b.x, b.y, e.color, 4);

            if (e.hp <= 0) {
              enemyKilled = true;
              break;
            }
          }
        }

        if (enemyKilled) {
          soundFx.playDamage();
          spawnParticles(e.x, e.y, e.color, 12);
          setScore((prev) => prev + (e.type === 'bakteri' ? 30 : e.type === 'glukosa' ? 40 : 20));
          localDefeated += 1;
          setDefeatedCount(localDefeated);

          // Chance to drop power-up
          if (Math.random() < 0.28) {
            const dropTypes: DropItem['type'][] = ['vitamin_c', 'h2o', 'vaksin_shield'];
            const chosenDrop = dropTypes[Math.floor(Math.random() * dropTypes.length)];
            dropsRef.current.push({
              id: Math.random(),
              x: e.x,
              y: e.y,
              type: chosenDrop,
              label: chosenDrop === 'vitamin_c' ? 'Vit C' : chosenDrop === 'h2o' ? 'H2O' : 'Vaksin',
              radius: 14,
              vy: 1.8,
            });
          }

          enemiesRef.current.splice(i, 1);
          continue;
        }

        // Check breach into host organ zone (bottom)
        if (e.y + e.radius >= canvas.height - 35) {
          soundFx.playDamage();
          spawnParticles(e.x, e.y, '#ef4444', 16);
          setOrganHealth((prev) => {
            const nextHp = prev - (e.type === 'glukosa' ? 18 : 12);
            if (nextHp <= 0) {
              setGameState('GAME_OVER');
              soundFx.playError();
            }
            return Math.max(0, nextHp);
          });
          enemiesRef.current.splice(i, 1);
          continue;
        }

        // Draw Enemy
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.angle);

        ctx.beginPath();
        ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw spikes / tentacles for virus/bacteria
        if (e.type === 'virus') {
          for (let s = 0; s < 6; s++) {
            const sAngle = (s * Math.PI) / 3;
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(Math.cos(sAngle) * e.radius, Math.sin(sAngle) * e.radius);
            ctx.lineTo(Math.cos(sAngle) * (e.radius + 6), Math.sin(sAngle) * (e.radius + 6));
            ctx.stroke();
          }
        }

        ctx.restore();

        // Draw Enemy HP bar
        if (e.maxHp > 1) {
          const barWidth = 26;
          const barHeight = 3;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(e.x - barWidth / 2, e.y - e.radius - 8, barWidth, barHeight);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(
            e.x - barWidth / 2,
            e.y - e.radius - 8,
            (e.hp / e.maxHp) * barWidth,
            barHeight
          );
        }
      }

      // Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.03;

        if (pt.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Player: Hero White Blood Cell (Leukosit Prima)
      ctx.save();
      ctx.translate(p.x, p.y);

      // Shield Aura
      if (p.shieldTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, p.radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // White blood cell body
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner nucleus (multilobed nucleus of neutrophil)
      ctx.beginPath();
      ctx.arc(-5, -3, 6, 0, Math.PI * 2);
      ctx.arc(5, -3, 6, 0, Math.PI * 2);
      ctx.arc(0, 5, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa';
      ctx.fill();

      // Cross symbol of health defense
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-2, -8, 4, 16);
      ctx.fillRect(-8, -2, 16, 4);

      ctx.restore();

      // Check Wave Completion
      if (
        enemiesSpawnedThisWave.current >= targetEnemiesPerWave.current &&
        enemiesRef.current.length === 0
      ) {
        setGameState('WAVE_CLEARED');
        soundFx.playSuccess();
        addXPAndCoins(100 + wave * 25, 20);
        unlockAchievement('first_defense');
        if (localDefeated >= 50) {
          unlockAchievement('virus_buster');
        }
        onProfileUpdate();
      }

      animationFrameId.current = requestAnimationFrame(updateAndRender);
    };

    animationFrameId.current = requestAnimationFrame(updateAndRender);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, wave, autoFire, shootBullet, spawnEnemy, onProfileUpdate, defeatedCount]);

  // Handle Game Over sync highscore
  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      const isNew = updateHighScore('immuneDefender', score);
      if (isNew) {
        setHighScore(score);
      }
      addXPAndCoins(Math.floor(score / 5), Math.floor(score / 20));
      onProfileUpdate();
    }
  }, [gameState, score, onProfileUpdate]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Top Game Header & HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Pertahanan Sel Imun
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              GELOMBANG {wave}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kendalikan Leukosit Prima untuk basmi patogen sebelum merusak organ vital tubuh!
          </p>
        </div>

        {/* HUD Stats */}
        <div className="flex items-center gap-4 text-xs">
          {/* Organ Vitality */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <div className="flex flex-col">
              <span className="text-slate-400">Vitalitas Organ</span>
              <span className="font-bold text-rose-400 font-mono tabular-nums">{organHealth}%</span>
            </div>
          </div>

          {/* Current Score */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-slate-400">Skor</span>
              <span className="font-bold text-amber-300 font-mono tabular-nums">{score}</span>
            </div>
          </div>

          {/* Auto Fire Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setAutoFire(!autoFire);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              autoFire
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{autoFire ? 'Tembak Otomatis: AKTIF' : 'Tembak Manual (Spasi)'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={520}
          onPointerMove={handlePointerMove}
          className="w-full h-full object-contain cursor-crosshair touch-none"
        />

        {/* Overlays by Game State */}

        {/* 1. TITLE MENU */}
        {gameState === 'TITLE_MENU' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center mb-4 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Pertahanan Sel Imun (Immune Defender)
            </h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              Kamu memimpin sel darah putih melawan invasi Virus Flu, Bakteri, dan Radikal Bebas. Ambil tetesan Vitamin C, Hidrasi H2O, dan Vaksin untuk memperkuat perisai imunitas!
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-left max-w-sm mb-6 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Navigasi Gerak:</span>
                <span className="text-white font-medium">Kursor Mouse / Sentuh / WASD</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tembak Antibodi:</span>
                <span className="text-white font-medium">Otomatis / Spasi</span>
              </div>
              <div>
                <span className="text-slate-400 block">Power-up:</span>
                <span className="text-amber-400 font-medium">Vit C (Triple Shot), H2O (Heal)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Skor Tertinggi:</span>
                <span className="text-emerald-400 font-mono font-bold tabular-nums">{highScore} Poin</span>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Mulai Pertahanan Tubuh</span>
            </button>
          </div>
        )}

        {/* 2. WAVE CLEARED */}
        {gameState === 'WAVE_CLEARED' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-1">
              Gelombang {wave} Berhasil Diatasi!
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Semua patogen dinetralkan. Vitalitas organ terjaga pada {organHealth}%.
            </p>

            {/* Medical Tip Card */}
            <div className="max-w-md bg-slate-900/90 border border-emerald-500/30 p-4 rounded-xl text-left mb-6">
              <span className="text-xs text-emerald-400 font-bold block mb-1">
                FAKTA KESEHATAN MEDIS:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{waveTip}</p>
            </div>

            <button
              onClick={handleNextWave}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <span>Lanjut Gelombang {wave + 1}</span>
            </button>
          </div>
        )}

        {/* 3. GAME OVER */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-2xl font-bold text-rose-500 mb-2">
              Vitalitas Organ Menurun!
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              Pertahanan tubuh kewalahan menghadapi gelombang patogen. Segera pulihkan stamina dan coba lagi!
            </p>

            <div className="flex items-center gap-6 bg-slate-900/90 px-6 py-3 rounded-xl border border-slate-800 mb-6">
              <div>
                <span className="text-xs text-slate-400 block">Skor Akhir</span>
                <span className="text-xl font-bold text-amber-300 font-mono tabular-nums">{score}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400 block">Patogen Dikalahkan</span>
                <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{defeatedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartGame}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onBackToHome();
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all text-sm"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-4">
          <span>Target: Cegah patogen menyentuh dasar layar</span>
          <span>·</span>
          <span>Ambil H2O untuk isi ulang darah</span>
        </div>
        <div>
          <span>Skor Tertinggi Kamu: <strong className="text-emerald-400 font-mono tabular-nums">{highScore}</strong></span>
        </div>
      </div>
    </div>
  );
};
