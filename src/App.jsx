import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Binary,
  CheckCircle2,
  ChevronRight,
  Cpu,
  ExternalLink,
  Lock,
  MapPinned,
  Radar,
  RefreshCcw,
  ScanLine,
  Shield,
  ShieldAlert,
  Siren,
  Skull,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';

const ACCESS_WORD = 'ACCESS';
const ACCESS_SHIFTED_HINT = 'CEEGUU';
const VECTOR_WORD = 'VECTOR';
const VECTOR_CLUES = ['Направление', 'Имеет модуль', 'Изучают в физике', '6 букв'];
const MEMORY_SEQUENCE = ['▲', '●', '■', '◆', '●', '▲'];
const MEMORY_RULE_TEXT = 'Начни и закончи одним символом. В центре — два разных знака. Круг появляется дважды.';
const MATRIX_CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=<>/';
const FINAL_COORDINATES = '56.282545, 43.979153';
const MAP_URL = `https://yandex.ru/maps/?text=${encodeURIComponent(FINAL_COORDINATES)}`;
const SAFE_PATH = [1, 6, 7, 12, 17, 18, 23];
const GRID = 5;
const DECOY_PACKETS = [
  { id: 'A1', value: '1101', parity: 'odd', valid: false },
  { id: 'B4', value: '0110', parity: 'even', valid: true },
  { id: 'C7', value: '1011', parity: 'odd', valid: false },
  { id: 'D2', value: '0101', parity: 'even', valid: true },
  { id: 'E9', value: '1110', parity: 'odd', valid: false },
  { id: 'F3', value: '0011', parity: 'even', valid: true },
];
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Какой месяц традиционно считается «плохим» для свадьбы?',
    options: ['Апрель', 'Июль', 'Май', 'Октябрь'],
    correct: 'Май',
  },
  {
    id: 2,
    question: 'Кто такой деверь?',
    options: ['Брат жены', 'Госслужащий', 'Брат мужа', 'Брат отца жены'],
    correct: 'Брат мужа',
  },
  {
    id: 3,
    question: 'Почему нельзя видеть невесту в свадебное платье до свадьбы?',
    options: [
      'Считается, что брак будет несчастливым, распадётся или будет обречён на неудачу',
      'По старым поверьям жениху нужно поглядеть на невесту в платье, чтобы попрощаться с беззаботной девушкой',
    ],
    correct: 'Считается, что брак будет несчастливым, распадётся или будет обречён на неудачу',
  },
  {
    id: 4,
    question: 'Как зовут твою тёщу?',
    options: ['Ольга Алексеевна', 'Ольга Александровна', 'Эльга Александровна', 'Эльга Алексеевна'],
    correct: 'Эльга Александровна',
  },
  {
    id: 5,
    question: 'Размер кольца невесты?',
    options: ['17', '17,5', '18,5', '19,5'],
    correct: '18,5',
  },
  {
    id: 6,
    question: 'Во сколько лет ты сломал передний зуб?',
    options: ['4', '5', '6', '7'],
    correct: '6',
  },
];

function pad(num) {
  return String(num).padStart(2, '0');
}

function useCountdown(initialSeconds, active) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, active]);

  return {
    seconds,
    reset: () => setSeconds(initialSeconds),
    isDanger: seconds <= 45,
    isCritical: seconds <= 20,
    isExpired: seconds <= 0,
    formatted: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
  };
}

function useTypewriter(lines, speed = 18) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    let mounted = true;
    let lineIndex = 0;
    let charIndex = 0;
    const rendered = Array(lines.length).fill('');

    const tick = () => {
      if (!mounted) return;
      if (lineIndex >= lines.length) return;
      rendered[lineIndex] = lines[lineIndex].slice(0, charIndex + 1);
      setVisibleLines([...rendered]);
      charIndex += 1;
      if (charIndex >= lines[lineIndex].length) {
        lineIndex += 1;
        charIndex = 0;
      }
      if (lineIndex < lines.length) setTimeout(tick, speed);
    };

    tick();
    return () => {
      mounted = false;
    };
  }, [lines, speed]);

  return visibleLines;
}

function MatrixRain() {
  const columns = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        text: Array.from({ length: 34 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join(' '),
        left: `${(i / 26) * 100}%`,
        duration: 8 + (i % 9),
        delay: (i % 6) * 0.45,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12] sm:opacity-[0.16]">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute top-[-25%] text-[9px] sm:text-[10px] whitespace-nowrap text-emerald-400/60"
          style={{ left: col.left }}
          animate={{ y: ['0%', '160%'] }}
          transition={{ duration: col.duration, repeat: Infinity, ease: 'linear', delay: col.delay }}
        >
          <div className="rotate-90 origin-top-left">{col.text}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ScannerLine() {
  return (
    <motion.div
      className="absolute inset-x-0 h-24 sm:h-28 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent pointer-events-none"
      animate={{ y: ['-15%', '115%'] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function GlitchText({ children, className = '' }) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={{ x: [0, -1, 1, 0], opacity: [1, 0.9, 1, 1] }}
      transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 2.8 }}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 translate-x-[1px] text-emerald-300/35 blur-[1px]">{children}</span>
      <span className="absolute inset-0 -translate-x-[1px] text-cyan-300/20 blur-[1px]">{children}</span>
    </motion.div>
  );
}

function StatusChip({ active, danger, children }) {
  return (
    <div
      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.28em] ${
        danger
          ? 'border-red-300/30 bg-red-500/10 text-red-200'
          : active
          ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
          : 'border-emerald-400/10 bg-black/30 text-emerald-500/50'
      }`}
    >
      {children}
    </div>
  );
}

function CoordinateReveal({ count }) {
  const chars = FINAL_COORDINATES.split('');
  let revealBudget = count * 3;
  const shown = chars
    .map((ch) => {
      if (ch === ' ' || ch === ',' || ch === '.') return ch;
      if (revealBudget > 0) {
        revealBudget -= 1;
        return ch;
      }
      return '•';
    })
    .join('');

  return <div className="text-xl sm:text-2xl lg:text-4xl text-emerald-100 tracking-[0.08em] sm:tracking-[0.12em] break-all">{shown}</div>;
}

function FinalReveal({ active }) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    if (!active) return;
    let index = 0;
    const id = setInterval(() => {
      index += 1;
      setShown(FINAL_COORDINATES.slice(0, index));
      if (index >= FINAL_COORDINATES.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="mt-3 text-2xl sm:text-4xl lg:text-6xl text-emerald-100 break-all tracking-[0.08em] sm:tracking-[0.14em] min-h-[68px] font-semibold">
      {shown}
      {active && shown.length < FINAL_COORDINATES.length ? <span className="animate-pulse">|</span> : null}
    </div>
  );
}

function TerminalBlock({ lines }) {
  return (
    <div className="rounded-2xl border border-emerald-400/15 bg-black/35 p-4 space-y-2 text-sm text-emerald-100/72 min-h-[120px]">
      {lines.filter(Boolean).map((line, idx) => (
        <div key={idx} className="flex gap-3 items-start">
          <span className="text-emerald-500 shrink-0">&gt;</span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}

function GlassPanel({ children, className = '' }) {
  return (
    <div className={`rounded-[24px] sm:rounded-[30px] border border-emerald-400/20 bg-black/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 ${className}`}>
      {children}
    </div>
  );
}

export default function HackerBachelorQuest() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [firstMistakeUsed, setFirstMistakeUsed] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [hardLock, setHardLock] = useState(false);
  const [meltdown, setMeltdown] = useState(false);
  const [shake, setShake] = useState(false);
  const [restarting, setRestarting] = useState(false);

  const [terminalInput, setTerminalInput] = useState('');
  const [bootSolved, setBootSolved] = useState(false);
  const [bootError, setBootError] = useState(false);

  const [cipherSelection, setCipherSelection] = useState([]);
  const [cipherSolved, setCipherSolved] = useState(false);
  const [cipherError, setCipherError] = useState(false);

  const [packetSelection, setPacketSelection] = useState([]);
  const [packetSolved, setPacketSolved] = useState(false);
  const [packetError, setPacketError] = useState(false);

  const [memoryInput, setMemoryInput] = useState([]);
  const [memorySolved, setMemorySolved] = useState(false);
  const [memoryError, setMemoryError] = useState(false);

  const [gridSolved, setGridSolved] = useState(false);
  const [gridError, setGridError] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [quizSolved, setQuizSolved] = useState(false);
  const [quizError, setQuizError] = useState(false);

  const [falseUnlock, setFalseUnlock] = useState(false);
  const [falseUnlockDismissed, setFalseUnlockDismissed] = useState(false);
  const [finalUnlocked, setFinalUnlocked] = useState(false);

  const timer = useCountdown(480, started && !finalUnlocked && !restarting);

  const introLines = useTypewriter(
    [
      'ROUTE.EXTRACTION.PROTOCOL // ENCRYPTED',
      'Внутри системы найден скрытый маршрут.',
      'Для извлечения точки назначения требуется пройти все контуры защиты.',
      'Первая критическая ошибка будет прощена, но система перейдёт в аварийный режим.',
    ],
    18
  );

  const heroStatusLines = useMemo(() => {
    const base = [
      'route core: locked',
      'signal channel: unstable',
      'failsafe: armed',
      'destination: redacted',
    ];

    if (started && phase === 0) return ['terminal link: online', 'key decoder: waiting', 'failsafe: armed', 'destination: redacted'];
    if (started && phase === 1) return ['vector scan: active', 'semantic parser: online', firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: redacted'];
    if (started && phase === 2) return ['packet filter: active', 'decoy purge: engaged', firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: redacted'];
    if (started && phase === 3) return ['signal memory: active', 'pattern validator: online', firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: redacted'];
    if (started && phase === 4) return ['route mesh: active', 'safe path search: online', firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: redacted'];
    if (started && phase === 5) return ['wedding protocol: active', `reconstruction: ${quizCorrectCount}/${QUIZ_QUESTIONS.length}`, firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: partially restored'];
    if (started && phase >= 6 && !finalUnlocked) return ['hidden firewall: breached', 'route core: almost extracted', firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: pending'];
    if (finalUnlocked) return ['route core: extracted', 'navigation handoff: ready', firstMistakeUsed ? 'failsafe: spent' : 'failsafe: armed', 'destination: confirmed'];
    return base;
  }, [started, phase, firstMistakeUsed, finalUnlocked, quizCorrectCount]);

  const cipherGrid = useMemo(
    () => ['V', 'Q', 'E', 'T', 'K', 'C', 'O', 'R', 'A', 'L', 'N', 'M'].map((letter, index) => ({ id: index, letter })),
    []
  );

  const tacticalGrid = useMemo(
    () => Array.from({ length: GRID * GRID }, (_, i) => ({ id: i, isSafe: SAFE_PATH.includes(i) })),
    []
  );

  useEffect(() => {
    if (bootSolved && phase === 0) setPhase(1);
  }, [bootSolved, phase]);

  useEffect(() => {
    if (cipherSolved && phase === 1) setPhase(2);
  }, [cipherSolved, phase]);

  useEffect(() => {
    if (packetSolved && phase === 2) setPhase(3);
  }, [packetSolved, phase]);

  useEffect(() => {
    if (memorySolved && phase === 3) setPhase(4);
  }, [memorySolved, phase]);

  useEffect(() => {
    if (gridSolved && phase === 4) setPhase(5);
  }, [gridSolved, phase]);

  useEffect(() => {
    if (quizSolved && phase === 5 && !falseUnlockDismissed) {
      setPhase(6);
      setFalseUnlock(true);
    }
    if (quizSolved && phase === 5 && falseUnlockDismissed) {
      setPhase(7);
    }
  }, [quizSolved, phase, falseUnlockDismissed]);

  useEffect(() => {
    if (falseUnlockDismissed && quizSolved && phase === 6) {
      setPhase(7);
    }
  }, [falseUnlockDismissed, quizSolved, phase]);

  const progress = ((Number(bootSolved) + Number(cipherSolved) + Number(packetSolved) + Number(memorySolved) + Number(gridSolved) + Number(quizSolved) + Number(finalUnlocked)) / 7) * 100;

  const triggerVisualFailure = () => {
    setShake(true);
    setMeltdown(true);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setMeltdown(false), 1600);
  };

  const triggerHardCrash = () => {
    setShake(true);
    setMeltdown(true);
    setHardLock(true);
    setTimeout(() => setShake(false), 700);
  };

  const handleMistake = (setter, resetFn) => {
    setter(true);
    const nextMistakeCount = mistakeCount + 1;
    setMistakeCount(nextMistakeCount);

    if (nextMistakeCount >= 3) {
      triggerHardCrash();
      setTimeout(() => setter(false), 900);
      return 'crash';
    }

    const isForgiven = !firstMistakeUsed;

    if (isForgiven) {
      setFirstMistakeUsed(true);
      triggerVisualFailure();
      setTimeout(() => setter(false), 900);
      return 'forgiven';
    }

    setShake(true);
    setTimeout(() => setShake(false), 420);
    setTimeout(() => setter(false), 700);
    if (resetFn) setTimeout(resetFn, 320);
    return 'strict';
  };

  const resetAll = () => {
    setStarted(false);
    setMistakeCount(0);
    setHardLock(false);
    setPhase(0);
    setFirstMistakeUsed(false);
    setMeltdown(false);
    setShake(false);
    setTerminalInput('');
    setBootSolved(false);
    setBootError(false);
    setCipherSelection([]);
    setCipherSolved(false);
    setCipherError(false);
    setPacketSelection([]);
    setPacketSolved(false);
    setPacketError(false);
    setMemoryInput([]);
    setMemorySolved(false);
    setMemoryError(false);
    setGridSolved(false);
    setGridError(false);
    setSelectedCells([]);
    setQuizIndex(0);
    setQuizCorrectCount(0);
    setQuizSolved(false);
    setQuizError(false);
    setFalseUnlock(false);
    setFalseUnlockDismissed(false);
    setFinalUnlocked(false);
    timer.reset();
  };

  const restartMission = () => {
    setRestarting(true);
    setTimeout(() => {
      resetAll();
      setRestarting(false);
    }, 650);
  };

  const handleBootSubmit = () => {
    if (terminalInput.trim().toUpperCase() === ACCESS_WORD) {
      setBootSolved(true);
      setBootError(false);
    } else {
      setTerminalInput('');
      handleMistake(setBootError, null);
    }
  };

  const toggleCipherLetter = (letter) => {
    if (cipherSolved || hardLock) return;
    setCipherSelection((prev) => {
      const next = [...prev, letter].slice(0, 6);
      const joined = next.join('');
      if (!VECTOR_WORD.startsWith(joined)) {
        const result = handleMistake(setCipherError, () => setCipherSelection([]));
        if (result === 'forgiven') return prev;
        return [];
      }
      if (joined === VECTOR_WORD) setCipherSolved(true);
      return next;
    });
  };

  const togglePacket = (packet) => {
    if (packetSolved || hardLock) return;
    let next;
    if (packetSelection.includes(packet.id)) {
      next = packetSelection.filter((id) => id !== packet.id);
    } else {
      next = [...packetSelection, packet.id];
    }

    const invalidPicked = next.some((id) => !DECOY_PACKETS.find((p) => p.id === id)?.valid);
    if (invalidPicked) {
      const result = handleMistake(setPacketError, () => setPacketSelection([]));
      if (result === 'strict' || result === 'crash') setPacketSelection([]);
      return;
    }

    setPacketSelection(next);
    const validSet = DECOY_PACKETS.filter((p) => p.valid).map((p) => p.id).sort().join('|');
    const currentSet = [...next].sort().join('|');
    if (currentSet === validSet) setPacketSolved(true);
  };

  const pushMemory = (shape) => {
    if (memorySolved || hardLock) return;
    const next = [...memoryInput, shape].slice(0, MEMORY_SEQUENCE.length);
    const partial = MEMORY_SEQUENCE.slice(0, next.length).join('');
    if (next.join('') !== partial) {
      const result = handleMistake(setMemoryError, () => setMemoryInput([]));
      if (result === 'strict' || result === 'crash') setMemoryInput([]);
      return;
    }
    setMemoryInput(next);
    if (next.length === MEMORY_SEQUENCE.length) setMemorySolved(true);
  };

  const toggleCell = (cell) => {
    if (gridSolved || hardLock) return;
    const next = [...selectedCells, cell.id];
    const expected = SAFE_PATH.slice(0, next.length);
    if (!cell.isSafe || JSON.stringify(next) !== JSON.stringify(expected)) {
      const result = handleMistake(setGridError, () => setSelectedCells([]));
      if (result === 'strict' || result === 'crash') setSelectedCells([]);
      return;
    }
    setSelectedCells(next);
    if (next.length === SAFE_PATH.length) setGridSolved(true);
  };

  const answerQuiz = (option) => {
    if (hardLock) return;
    const current = QUIZ_QUESTIONS[quizIndex];
    if (!current) return;

    if (option === current.correct) {
      const nextCorrect = quizCorrectCount + 1;
      setQuizCorrectCount(nextCorrect);
      setQuizError(false);
      if (quizIndex === QUIZ_QUESTIONS.length - 1) {
        setQuizSolved(true);
      } else {
        setQuizIndex((v) => v + 1);
      }
      return;
    }

    handleMistake(setQuizError, null);
  };

  const handleFinalUnlock = () => {
    if (bootSolved && cipherSolved && packetSolved && memorySolved && gridSolved && quizSolved) setFinalUnlocked(true);
  };

  const currentQuestion = QUIZ_QUESTIONS[quizIndex];
  const finalPanelVisible = phase === 7 && finalUnlocked;

  const systemLines = [
    phase === 0 ? 'Подготовка терминала доступа.' : '',
    phase === 1 ? 'Активна логическая дешифровка вектора.' : '',
    phase === 2 ? 'Сканируются настоящие и ложные пакеты.' : '',
    phase === 3 ? 'Система ждёт корректную сигнальную последовательность.' : '',
    phase === 4 ? 'Прокладывается безопасный маршрут.' : '',
    phase === 5 ? 'Ответы постепенно восстанавливают координату.' : '',
    phase >= 6 ? 'Ядро маршрута почти извлечено.' : '',
  ].filter(Boolean);

  const steps = [
    { title: 'Стартовый терминал', hint: 'Введи команду доступа.', done: bootSolved },
    { title: 'Кодовый вектор', hint: 'Собери код без ошибок.', done: cipherSolved },
    { title: 'Фильтрация пакетов', hint: 'Отдели реальные сигналы от ложных.', done: packetSolved },
    { title: 'Память сигнала', hint: 'Повтори цепочку символов.', done: memorySolved },
    { title: 'Тактическая сетка', hint: 'Найди безопасный путь.', done: gridSolved },
    { title: 'Свадебный протокол', hint: 'Ответы открывают координаты по частям.', done: quizSolved },
    { title: 'Извлечение маршрута', hint: 'Активируй выдачу точки.', done: finalUnlocked },
  ];

  return (
    <div className="min-h-screen bg-[#020907] text-emerald-300 font-mono relative overflow-hidden">
      <MatrixRain />
      <ScannerLine />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_25%)] pointer-events-none" />
      <AnimatePresence>
        {meltdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.45, 0.15, 0.4, 0] }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none bg-red-500/20 mix-blend-screen"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,0,0,0.18),rgba(255,0,0,0.18)_2px,transparent_2px,transparent_6px)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {restarting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="rounded-full border border-emerald-400/20 p-6">
              <RefreshCcw size={40} className="text-emerald-300" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hardLock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl rounded-[28px] border border-red-400/30 bg-black/80 p-6 sm:p-8 shadow-[0_0_80px_rgba(255,0,0,0.14)]"
            >
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-red-300/70">critical system failure</div>
              <h2 className="mt-4 text-2xl sm:text-4xl font-bold text-red-200">Система заблокирована</h2>
              <p className="mt-4 text-sm sm:text-base text-red-100/75 leading-relaxed max-w-xl">
                Допущено слишком много ошибок. Маршрут потерян, текущая сессия аварийно завершена. Чтобы попробовать снова, нужно перезапустить квест с самого начала.
              </p>
              <div className="mt-4 rounded-2xl border border-red-400/15 bg-red-500/5 p-4 text-sm text-red-100/75">
                Ошибок: <span className="font-bold text-red-200">{mistakeCount}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={restartMission}
                className="mt-6 rounded-2xl border border-red-300/30 bg-red-500/10 px-6 py-4 text-xs sm:text-sm uppercase tracking-[0.28em] text-red-200"
              >
                начать сначала
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={shake ? { x: [0, -10, 10, -8, 8, 0], y: [0, 1, -1, 1, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 lg:py-10">
          <AnimatePresence>
            {finalPanelVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.72))] backdrop-blur-[2px]"
              />
            )}
          </AnimatePresence>
          <GlassPanel className={`p-4 sm:p-6 lg:p-8 ${meltdown ? 'border-red-400/35 shadow-red-950/40' : ''}`}>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 sm:gap-6">
              <div className="max-w-4xl">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.35em] ${meltdown ? 'border-red-300/30 text-red-200 bg-red-500/10' : 'border-emerald-400/20 text-emerald-400/70'}`}>
                  <ShieldAlert size={14} /> {meltdown ? 'system instability' : 'encrypted route interface'}
                </div>
                <h1 className={`mt-4 text-2xl sm:text-4xl lg:text-6xl font-bold leading-tight ${meltdown ? 'text-red-200' : 'text-emerald-200'}`}>
                  <GlitchText>PROJECT: FINAL COORDINATE</GlitchText>
                </h1>
                <div className={`mt-4 sm:mt-5 grid lg:grid-cols-[1fr_280px] gap-5 items-start ${meltdown ? 'text-red-100/80' : 'text-emerald-100/75'}`}>
                  <div className="space-y-1 text-xs sm:text-sm lg:text-base min-h-[120px] sm:min-h-[140px]">
                    {introLines.map((line, i) => (
                      <div key={i} className="flex gap-3">
                        <span className={meltdown ? 'text-red-400' : 'text-emerald-500'}>&gt;</span>
                        <span>{line}</span>
                      </div>
                    ))}
                    {firstMistakeUsed && (
                      <div className="flex gap-3 text-red-300">
                        <span>&gt;</span>
                        <span>FAILSAFE TRIGGERED // первая ошибка прощена, система нестабильна</span>
                      </div>
                    )}
                  </div>
                  <div className={`rounded-2xl border p-4 bg-black/30 min-h-[140px] ${meltdown ? 'border-red-400/25' : 'border-emerald-400/15'}`}>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-500/70">Core status</div>
                    <div className="mt-4 space-y-2 text-xs sm:text-sm">
                      {heroStatusLines.map((line, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className={meltdown ? 'text-red-400' : 'text-emerald-500'}>&gt;</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`w-full xl:w-[390px] rounded-[22px] sm:rounded-[26px] border p-4 sm:p-5 ${meltdown ? 'border-red-400/35 bg-red-500/5' : timer.isCritical ? 'border-red-400/35 bg-red-500/5' : timer.isDanger ? 'border-yellow-300/30 bg-yellow-500/5' : 'border-emerald-400/20 bg-emerald-500/5'}`}>
                <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-400/70">
                  <span>Mission timer</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <motion.div animate={timer.isCritical || meltdown ? { opacity: [1, 0.55, 1] } : { opacity: 1 }} transition={{ duration: 0.8, repeat: Infinity }} className={`mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold ${meltdown || timer.isCritical ? 'text-red-300' : timer.isDanger ? 'text-yellow-200' : 'text-emerald-200'}`}>
                  {timer.formatted}
                </motion.div>
                <div className="mt-3 sm:mt-4 h-3 rounded-full bg-black/50 overflow-hidden border border-emerald-400/10">
                  <motion.div className={`h-full rounded-full ${meltdown || timer.isCritical ? 'bg-gradient-to-r from-red-500 via-yellow-300 to-red-500' : timer.isDanger ? 'bg-gradient-to-r from-yellow-500 via-yellow-200 to-orange-500' : 'bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500'}`} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusChip active={started && !finalUnlocked} danger={false}>LIVE</StatusChip>
                  <StatusChip active={firstMistakeUsed} danger={firstMistakeUsed}>FAILSAFE</StatusChip>
                  <StatusChip active={timer.isCritical || meltdown} danger={timer.isCritical || meltdown}>CRITICAL</StatusChip>
                </div>
              </div>
            </div>
          </GlassPanel>

          <main className="mt-4 sm:mt-8 grid xl:grid-cols-[1.25fr_0.75fr] gap-4 sm:gap-6">
            <GlassPanel className={`p-4 sm:p-6 lg:p-8 min-h-[760px] sm:min-h-[860px] relative overflow-hidden ${meltdown ? 'border-red-400/30' : ''} ${finalPanelVisible ? 'z-40' : ''}`}>
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:100%_30px] opacity-35 pointer-events-none" />

              {!started ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex flex-col items-center justify-center text-center min-h-[680px] sm:min-h-[780px]">
                  <motion.div animate={{ rotate: 360, boxShadow: ['0 0 0 rgba(16,185,129,0.08)', '0 0 40px rgba(16,185,129,0.2)', '0 0 0 rgba(16,185,129,0.08)'] }} transition={{ rotate: { duration: 9, repeat: Infinity, ease: 'linear' }, boxShadow: { duration: 2.5, repeat: Infinity } }} className="mb-6 sm:mb-8 rounded-full border border-emerald-400/20 p-5 sm:p-7 bg-emerald-500/5">
                    <ScanLine size={44} className="text-emerald-300 sm:w-[52px] sm:h-[52px]" />
                  </motion.div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-500/5 px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.35em] text-yellow-200 mb-4 sm:mb-5">
                    <Siren size={13} /> unauthorized access
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-emerald-200">Маршрут заблокирован</h2>
                  <p className="mt-4 sm:mt-5 max-w-2xl text-emerald-100/70 leading-relaxed text-sm sm:text-base">
                    Перед тобой защищённый интерактивный маршрут. Первая ошибка будет прощена, но сайт перейдёт в аварийный режим. В отдельной фазе правильные ответы постепенно раскроют итоговые координаты.
                  </p>
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(16,185,129,0.22)' }} whileTap={{ scale: 0.98 }} onClick={() => setStarted(true)} className="mt-7 sm:mt-8 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.28em] sm:tracking-[0.34em] text-emerald-200">
                    initiate extraction
                  </motion.button>
                </motion.div>
              ) : timer.isExpired && !finalUnlocked ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex flex-col justify-center min-h-[680px] sm:min-h-[780px] text-center items-center">
                  <div className="rounded-full border border-red-400/20 bg-red-500/5 p-5 sm:p-6 mb-5 sm:mb-6">
                    <Skull size={42} className="text-red-300 sm:w-[46px] sm:h-[46px]" />
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-red-200">Система закрыла маршрут</h2>
                  <p className="mt-4 max-w-2xl text-red-100/70 leading-relaxed text-sm sm:text-base">Таймер обнулился, выдача маршрута отменена. Можно перезапустить всю миссию и пройти всё заново.</p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={restartMission} className="mt-7 rounded-2xl border border-red-300/30 bg-red-500/10 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.26em] sm:tracking-[0.3em] text-red-200">
                    restart mission
                  </motion.button>
                </motion.div>
              ) : (
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {phase === 0 && (
                      <motion.div key="boot" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><TerminalSquare className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Фаза 01</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Стартовый терминал</h2></div></div>
                        <div className={`rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 ${bootError ? 'border-red-400/30 bg-red-500/5' : 'border-emerald-400/15 bg-emerald-500/5'}`}>
                          <TerminalBlock lines={['route.init --secure', 'command key required', 'hint: шифр сдвига +2', `encoded key: ${ACCESS_SHIFTED_HINT}`]} />
                          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                            <input value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Введите команду доступа" className="flex-1 rounded-2xl border border-emerald-400/20 bg-black/50 px-4 py-3.5 sm:py-4 outline-none text-emerald-200 placeholder:text-emerald-500/35" />
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleBootSubmit} className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-6 py-3.5 sm:py-4 uppercase tracking-[0.22em] sm:tracking-[0.24em] text-xs sm:text-sm">execute</motion.button>
                          </div>
                          <AnimatePresence>{bootError && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-red-300">ACCESS DENIED // команда не распознана</motion.div>}</AnimatePresence>
                          {bootSolved && <div className="mt-4 text-sm text-emerald-200">Ключ принят. Первый контур снят.</div>}
                        </div>
                      </motion.div>
                    )}

                    {phase === 1 && (
                      <motion.div key="cipher" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><Binary className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Фаза 02</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Кодовый вектор</h2></div></div>
                        <div className={`rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 ${cipherError ? 'border-red-400/30 bg-red-500/5' : 'border-emerald-400/15 bg-emerald-500/5'}`}>
                          <p className="text-sm sm:text-base text-emerald-100/72 leading-relaxed">Собери кодовое слово по смысловым подсказкам. Оно связано с направлением и движением. Ошибка мгновенно очищает ввод.</p>
                          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-black/30 p-4"><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Подсказки</div><div className="mt-3 flex flex-wrap gap-2">{VECTOR_CLUES.map((clue) => <div key={clue} className="rounded-full border border-emerald-400/10 bg-black/40 px-3 py-2 text-[11px] sm:text-xs text-emerald-100/70">{clue}</div>)}</div></div>
                          <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">{cipherGrid.map((item) => <motion.button key={item.id} whileHover={{ y: -3, boxShadow: '0 0 18px rgba(16,185,129,0.14)' }} whileTap={{ scale: 0.96 }} onClick={() => toggleCipherLetter(item.letter)} className={`rounded-2xl border p-4 sm:p-5 text-xl sm:text-2xl font-bold ${cipherSelection[cipherSelection.length - 1] === item.letter ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100' : 'border-emerald-400/15 bg-black/40 text-emerald-400'}`}>{item.letter}</motion.button>)}</div>
                          <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-black/30 p-4"><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Текущий вектор</div><div className="mt-2 text-xl sm:text-2xl tracking-[0.24em] sm:tracking-[0.34em] text-emerald-200 min-h-[32px]">{cipherSelection.join('')}</div></div>
                          {cipherSolved && <div className="mt-4 text-sm text-emerald-200">Вектор распознан. Дешифровка завершена.</div>}
                        </div>
                      </motion.div>
                    )}

                    {phase === 2 && (
                      <motion.div key="packets" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><Cpu className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Фаза 03</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Фильтрация пакетов</h2></div></div>
                        <div className={`rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 ${packetError ? 'border-red-400/30 bg-red-500/5' : 'border-emerald-400/15 bg-emerald-500/5'}`}>
                          <TerminalBlock lines={['packet.scan --depth=3', 'real packets have even parity signature', 'если число единиц чётное — пакет настоящий']} />
                          <p className="mt-5 text-sm sm:text-base text-emerald-100/72 leading-relaxed">Выбери только реальные пакеты. Здесь не нужна сложная математика: у настоящего пакета количество единиц в коде чётное. Один неверный пакет вызывает purge.</p>
                          <div className="mt-5 grid md:grid-cols-2 gap-3">{DECOY_PACKETS.map((packet) => { const active = packetSelection.includes(packet.id); return <motion.button key={packet.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => togglePacket(packet)} className={`rounded-2xl border p-4 text-left ${active ? 'border-emerald-300/40 bg-emerald-400/10' : 'border-emerald-400/15 bg-black/35'}`}><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-emerald-500/70">packet {packet.id}</div><div className="mt-2 text-xl sm:text-2xl tracking-[0.16em] sm:tracking-[0.25em] text-emerald-100">{packet.value}</div></motion.button>; })}</div>
                          <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-black/30 p-4"><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Выбрано</div><div className="mt-2 text-base sm:text-lg text-emerald-200 min-h-[28px]">{packetSelection.join(', ')}</div></div>
                          {packetSolved && <div className="mt-4 text-sm text-emerald-200">Шум очищен. Остался только реальный трафик маршрута.</div>}
                        </div>
                      </motion.div>
                    )}

                    {phase === 3 && (
                      <motion.div key="memory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><Radar className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Фаза 04</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Память сигнала</h2></div></div>
                        <div className={`rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 ${memoryError ? 'border-red-400/30 bg-red-500/5' : 'border-emerald-400/15 bg-emerald-500/5'}`}>
                          <div className="grid lg:grid-cols-2 gap-5"><div className="rounded-2xl border border-emerald-400/15 bg-black/30 p-4"><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Правило сигнала</div><div className="mt-4 text-sm md:text-base text-emerald-100/75 leading-relaxed">{MEMORY_RULE_TEXT}</div></div><div className="rounded-2xl border border-emerald-400/15 bg-black/30 p-4"><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Твой сигнал</div><div className="mt-4 text-2xl sm:text-3xl md:text-5xl tracking-[0.2em] sm:tracking-[0.35em] text-emerald-200 min-h-[60px]">{memoryInput.join(' ')}</div></div></div>
                          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">{['▲', '●', '■', '◆'].map((shape) => <motion.button key={shape} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => pushMemory(shape)} className="rounded-2xl border border-emerald-400/15 bg-black/40 p-4 sm:p-5 text-2xl sm:text-3xl text-emerald-200">{shape}</motion.button>)}</div>
                          {memorySolved && <div className="mt-4 text-sm text-emerald-200">Сигнал подтверждён. Сетка маршрута открыта.</div>}
                        </div>
                      </motion.div>
                    )}

                    {phase === 4 && (
                      <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><Shield className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Фаза 05</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Тактическая сетка</h2></div></div>
                        <div className={`rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 ${gridError ? 'border-red-400/30 bg-red-500/5' : 'border-emerald-400/15 bg-emerald-500/5'}`}>
                          <p className="text-sm sm:text-base text-emerald-100/72 leading-relaxed">Выбери единственный безопасный путь. Система не прощает ложных маршрутов: любой неверный шаг = сброс.</p>
                          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-black/30 p-4 max-w-[420px]"><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-emerald-500/70">Логика маршрута</div><div className="mt-3 text-sm text-emerald-100/72 leading-relaxed">Безопасный путь всегда идёт вниз или вправо. Нельзя возвращаться назад. Финальная точка находится в нижнем ряду.</div></div>
                          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3 max-w-[420px]">{tacticalGrid.map((cell) => { const selected = selectedCells.includes(cell.id); return <motion.button key={cell.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => toggleCell(cell)} className={`aspect-square rounded-xl sm:rounded-2xl border text-sm sm:text-lg ${selected ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100' : 'border-emerald-400/15 bg-black/40 text-emerald-500/40'}`}>{selected ? '●' : '○'}</motion.button>; })}</div>
                          <div className="mt-4 text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-emerald-500/60">Безопасный путь содержит 7 точек и не делает шагов назад</div>
                          {gridSolved && <div className="mt-4 text-sm text-emerald-200">Маршрут найден. Открыт свадебный протокол.</div>}
                        </div>
                      </motion.div>
                    )}

                    {phase === 5 && currentQuestion && (
                      <motion.div key={`quiz-${quizIndex}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><MapPinned className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Фаза 06</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Свадебный протокол</h2></div></div>
                        <div className={`rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 ${quizError ? 'border-red-400/30 bg-red-500/5' : 'border-emerald-400/15 bg-emerald-500/5'}`}>
                          <div className="grid xl:grid-cols-[1fr_0.92fr] gap-5">
                            <div>
                              <div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Вопрос {quizIndex + 1} / {QUIZ_QUESTIONS.length}</div>
                              <div className="mt-4 text-lg sm:text-2xl text-emerald-100 leading-relaxed">{currentQuestion.question}</div>
                              <div className="mt-5 grid gap-3">{currentQuestion.options.map((option) => <motion.button key={option} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => answerQuiz(option)} className="rounded-2xl border border-emerald-400/15 bg-black/35 p-4 text-left text-sm sm:text-base text-emerald-100/80">{option}</motion.button>)}</div>
                            </div>
                            <div className="rounded-2xl border border-emerald-400/15 bg-black/30 p-4 sm:p-5">
                              <div className="flex items-center gap-2 text-emerald-300"><Sparkles size={16} /><div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Координата восстанавливается</div></div>
                              <div className="mt-4"><CoordinateReveal count={quizCorrectCount} /></div>
                              <div className="mt-5 text-sm text-emerald-100/70 leading-relaxed">Каждый правильный ответ открывает ещё часть финальной точки. До финального unlock здесь нет полного спойлера.</div>
                              <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-black/35 p-4 text-sm text-emerald-100/75">Правильных ответов: <span className="text-emerald-200 font-bold">{quizCorrectCount}</span></div>
                            </div>
                          </div>
                          {quizSolved && <div className="mt-5 text-sm text-emerald-200">Протокол пройден. Ядро координаты почти собрано.</div>}
                        </div>
                      </motion.div>
                    )}

                    {phase === 6 && falseUnlock && (
                      <motion.div key="false-final" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><Lock className="text-yellow-200" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-yellow-200/70">Ложная фаза</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-yellow-100">Декойный финал</h2></div></div>
                        <div className="rounded-[22px] sm:rounded-[26px] border border-yellow-300/25 bg-yellow-500/5 p-5 sm:p-8">
                          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-500/10 px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.35em] text-yellow-100/80"><AlertTriangle size={13} /> decoy firewall detected</div>
                          <p className="mt-5 text-sm sm:text-base text-yellow-50/80 leading-relaxed max-w-2xl">Ты дошёл до подставного финала. Система специально показала ложный допуск, чтобы отсечь тех, кто расслабляется раньше времени. Настоящая выдача маршрута ещё глубже.</p>
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => { setFalseUnlock(false); setFalseUnlockDismissed(true); }} className="mt-7 rounded-2xl border border-yellow-300/30 bg-yellow-500/10 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.26em] sm:tracking-[0.3em] text-yellow-100">breach hidden layer</motion.button>
                        </div>
                      </motion.div>
                    )}

                    {phase === 7 && (
                      <motion.div key="final" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <div className="flex items-center gap-3 mb-5 sm:mb-6"><MapPinned className="text-emerald-300" /><div><div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Финальная фаза</div><h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-200">Извлечение маршрута</h2></div></div>
                        <div className="rounded-[22px] sm:rounded-[26px] border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 via-black/30 to-cyan-500/5 p-5 sm:p-8 overflow-hidden relative">
                          <motion.div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_35%)]" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
                          <div className="relative z-10">
                            <div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">All firewalls bypassed</div>
                            <p className="mt-4 text-sm sm:text-base text-emerald-100/72 leading-relaxed max-w-2xl">Все контуры защиты сняты. Ниже откроется полностью восстановленная точка назначения.</p>
                            {!finalUnlocked && (
                              <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(16,185,129,0.24)' }} whileTap={{ scale: 0.98 }} onClick={handleFinalUnlock} className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.34em] text-emerald-200">unlock route</motion.button>
                            )}
                            <AnimatePresence>
                              {finalUnlocked && (
                                <motion.div
                                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.55 }}
                                  className="mt-8 rounded-[26px] sm:rounded-[30px] border border-emerald-300/30 bg-black/85 p-5 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.14)] relative overflow-hidden z-50 ring-1 ring-emerald-300/10"
                                >
                                  <motion.div
                                    className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_45%)]"
                                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                                    transition={{ duration: 2.8, repeat: Infinity }}
                                  />
                                  <div className="relative z-10">
                                    <div className="flex items-center gap-3 text-emerald-200"><CheckCircle2 /><span className="uppercase tracking-[0.22em] sm:tracking-[0.25em] text-xs sm:text-sm">Destination extracted</span></div>
                                    <div className="mt-6 text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-emerald-500/70">Координаты назначения</div>
                                    <FinalReveal active={finalUnlocked} />
                                    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                                    <p className="mt-6 text-sm sm:text-base text-emerald-100/72 leading-relaxed max-w-2xl">Маршрут восстановлен полностью. Следующая точка готова к открытию в навигации.</p>
                                    <div className="mt-7 grid sm:grid-cols-2 gap-3 max-w-2xl">
                                      <motion.a
                                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16,185,129,0.22)' }}
                                        whileTap={{ scale: 0.98 }}
                                        href={MAP_URL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/35 bg-emerald-400/12 px-5 sm:px-6 py-4 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.3em] text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                                      >
                                        <ExternalLink size={16} /> Открыть в Яндекс Картах
                                      </motion.a>
                                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={restartMission} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/5 px-5 sm:px-6 py-4 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.3em] text-emerald-200">Пройти ещё раз</motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </GlassPanel>

            <div className="space-y-4 sm:space-y-6">
              <GlassPanel className="p-4 sm:p-6">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Mission map</div>
                <div className="mt-4 space-y-4">
                  {steps.map((step, idx) => {
                    const isCurrent = ((phase === 6 || phase === 7) ? idx === 6 : idx === phase) && started && !finalUnlocked;
                    const isDone = step.done;
                    return <motion.div key={step.title} animate={isCurrent ? { boxShadow: ['0 0 0 rgba(16,185,129,0)', '0 0 26px rgba(16,185,129,0.08)', '0 0 0 rgba(16,185,129,0)'] } : {}} transition={{ duration: 2, repeat: Infinity }} className={`rounded-2xl border p-4 ${isDone ? 'border-emerald-400/20 bg-emerald-500/10' : isCurrent ? 'border-yellow-300/30 bg-yellow-500/5' : 'border-emerald-400/10 bg-black/30'}`}><div className="flex items-start gap-3"><div className="mt-0.5 rounded-xl border border-emerald-400/15 p-2 bg-black/40 shrink-0">{isDone ? <CheckCircle2 size={18} className="text-emerald-300" /> : <ChevronRight size={18} className="text-emerald-300" />}</div><div><div className="text-sm text-emerald-200">{step.title}</div><div className="mt-1 text-xs text-emerald-100/55 leading-relaxed">{step.hint}</div></div></div></motion.div>;
                  })}
                </div>
              </GlassPanel>

              <GlassPanel className="p-4 sm:p-6">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">System status</div>
                <div className="mt-4 rounded-2xl border border-emerald-400/10 bg-black/30 p-4">
                  <TerminalBlock lines={systemLines.length ? systemLines : ['Ожидание запуска маршрута.']} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-emerald-400/10 bg-black/30 p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-500/70">Failsafe</div>
                    <div className={`mt-2 text-sm ${firstMistakeUsed ? 'text-red-300' : 'text-emerald-200'}`}>{firstMistakeUsed ? 'used' : 'armed'}</div>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/10 bg-black/30 p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-500/70">Route core</div>
                    <div className="mt-2 text-sm text-emerald-200">{finalUnlocked ? 'extracted' : 'locked'}</div>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel className="p-4 sm:p-6">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.3em] text-emerald-500/70">Легенда маршрута</div>
                <div className="mt-4 space-y-3 text-sm text-emerald-100/70 leading-relaxed">
                  <div className="rounded-2xl border border-emerald-400/10 bg-black/30 p-4">Это закрытый цифровой маршрут с несколькими уровнями допуска и ложными следами.</div>
                  <div className="rounded-2xl border border-emerald-400/10 bg-black/30 p-4">Каждый этап приближает к точке назначения: сначала доступ, затем фильтрация, потом восстановление маршрута.</div>
                  <div className="rounded-2xl border border-emerald-400/10 bg-black/30 p-4">Одна ошибка будет прощена, но после этого система станет заметно более нестабильной.</div>
                </div>
              </GlassPanel>
            </div>
          </main>
        </div>
      </motion.div>
    </div>
  );
}