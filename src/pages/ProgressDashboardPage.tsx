import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useVocab } from '../features/vocab/useVocab';
import { useGrammar } from '../features/grammar/useGrammar';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';

/* ── helpers ─────────────────────────────────────────────── */

/** Return Tailwind bg class for a 0-100 mastery score */
function masteryColor(score: number): string {
  if (score === 0) return 'bg-surface-alt text-secondary/40';
  if (score < 25) return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
  if (score < 50) return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300';
  if (score < 75) return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
  return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
}

function masteryRingColor(score: number): string {
  if (score === 0) return 'text-border-light';
  if (score < 25) return 'text-red-400';
  if (score < 50) return 'text-orange-400';
  if (score < 75) return 'text-yellow-400';
  return 'text-emerald-500';
}

function pct(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}

/* ── tiny ring progress ──────────────────────────────────── */

function RingProgress({ value, size = 80, label }: { value: number; size?: number; label: string }) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-border-light"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={masteryRingColor(value)}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary">
          {value}%
        </span>
      </div>
      <span className="text-xs text-secondary font-medium">{label}</span>
    </div>
  );
}

/* ── kana mastery grid ───────────────────────────────────── */

function KanaMasteryGrid({
  data,
  mastery,
  categoryLabel,
}: {
  data: Record<string, string>;
  mastery: Record<string, number>;
  categoryLabel: string;
}) {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
        {categoryLabel}
      </h4>
      <div className="flex flex-wrap gap-1">
        {entries.map(([char]) => {
          const score = mastery[char] ?? 0;
          return (
            <div
              key={char}
              title={`${char} — ${score}%`}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${masteryColor(score)}`}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── stat card ───────────────────────────────────────────── */

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-lg font-bold text-primary leading-tight">{value}</p>
        <p className="text-xs text-secondary">{label}</p>
        {sub && <p className="text-[10px] text-secondary/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── section wrapper ─────────────────────────────────────── */

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) {
  return (
    <section className="bg-surface rounded-2xl border border-border p-5 space-y-4">
      <h3 className="text-base font-semibold text-primary flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </section>
  );
}

/* ── legend ───────────────────────────────────────────────── */

function MasteryLegend() {
  const levels = [
    { label: 'Not started', cls: 'bg-surface-alt border border-border-light' },
    { label: '<25%', cls: 'bg-red-100 dark:bg-red-900/40' },
    { label: '25-49%', cls: 'bg-orange-100 dark:bg-orange-900/40' },
    { label: '50-74%', cls: 'bg-yellow-100 dark:bg-yellow-900/40' },
    { label: '75-100%', cls: 'bg-emerald-100 dark:bg-emerald-900/40' },
  ];
  return (
    <div className="flex flex-wrap gap-3 text-[11px] text-secondary">
      {levels.map((l) => (
        <span key={l.label} className="flex items-center gap-1">
          <span className={`w-3 h-3 rounded ${l.cls}`} />
          {l.label}
        </span>
      ))}
    </div>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────── */

export function ProgressDashboardPage() {
  const { state } = useApp();
  const { progress } = state;
  const vocab = useVocab();
  const grammar = useGrammar();

  /* ── kana stats ───────────────────────── */

  const hiraganaStats = useMemo(() => {
    const all = { ...hiraganaData.basic, ...hiraganaData.dakuten, ...hiraganaData.handakuten, ...hiraganaData.combinations };
    const total = Object.keys(all).length;
    const practiced = Object.keys(all).filter((c) => (progress.characterMastery[c] ?? 0) > 0).length;
    const mastered = Object.keys(all).filter((c) => (progress.characterMastery[c] ?? 0) >= 75).length;
    const avg = total > 0 ? Math.round(Object.keys(all).reduce((s, c) => s + (progress.characterMastery[c] ?? 0), 0) / total) : 0;
    return { total, practiced, mastered, avg };
  }, [progress.characterMastery]);

  const katakanaStats = useMemo(() => {
    const all = { ...katakanaData.basic, ...katakanaData.dakuten, ...katakanaData.handakuten, ...katakanaData.combinations };
    const total = Object.keys(all).length;
    const practiced = Object.keys(all).filter((c) => (progress.characterMastery[c] ?? 0) > 0).length;
    const mastered = Object.keys(all).filter((c) => (progress.characterMastery[c] ?? 0) >= 75).length;
    const avg = total > 0 ? Math.round(Object.keys(all).reduce((s, c) => s + (progress.characterMastery[c] ?? 0), 0) / total) : 0;
    return { total, practiced, mastered, avg };
  }, [progress.characterMastery]);

  /* ── emoji stats ──────────────────────── */

  const emojiStats = useMemo(() => {
    const entries = Object.entries(progress.emojiMastery);
    const total = entries.length;
    const mastered = entries.filter(([, v]) => v >= 75).length;
    const avg = total > 0 ? Math.round(entries.reduce((s, [, v]) => s + v, 0) / total) : 0;
    const totalAttempts = progress.emojiExerciseHistory.length;
    const correct = progress.emojiExerciseHistory.filter((e) => e.correct).length;
    return { total, mastered, avg, totalAttempts, correct };
  }, [progress.emojiMastery, progress.emojiExerciseHistory]);

  /* ── vocab stats ──────────────────────── */

  const vocabStats = useMemo(() => {
    const wp = vocab.state.wordProgress;
    const entries = Object.values(wp);
    const totalWords = entries.length;
    const totalAttempts = entries.reduce((s, e) => s + e.seen, 0);
    const totalCorrect = entries.reduce((s, e) => s + e.correct, 0);
    const mastered = entries.filter((e) => e.seen > 0 && e.correct / e.seen >= 0.75 && e.seen >= 3).length;
    const avgAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const dueNow = entries.filter((e) => e.dueAt && new Date(e.dueAt) <= new Date()).length;
    return { totalWords, totalAttempts, totalCorrect, mastered, avgAccuracy, dueNow };
  }, [vocab.state.wordProgress]);

  /* ── grammar stats ────────────────────── */

  const grammarStats = useMemo(() => {
    const prog = grammar.state.progress;
    let totalItems = 0;
    let totalCorrect = 0;
    let totalSeen = 0;
    for (const packId of Object.keys(prog)) {
      for (const mode of Object.keys(prog[packId])) {
        const items = prog[packId][mode];
        for (const itemId of Object.keys(items)) {
          totalItems++;
          totalSeen += items[itemId].seen;
          totalCorrect += items[itemId].correct;
        }
      }
    }
    const accuracy = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;
    return { totalItems, totalSeen, totalCorrect, accuracy };
  }, [grammar.state.progress]);

  /* ── overall stats ────────────────────── */

  const totalExercises =
    progress.exerciseHistory.length +
    progress.emojiExerciseHistory.length +
    progress.vocabularyExerciseHistory.length +
    grammarStats.totalSeen;

  const streakDays = progress.streak;

  /* ── format time helper ───────────────── */
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const totalTime = Object.values(progress.timeSpent).reduce((s, t) => s + t, 0);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="p-2 -ml-2 rounded-lg hover:bg-surface-alt transition-colors text-secondary"
          aria-label="Back to Home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">Progress Dashboard</h1>
          <p className="text-sm text-secondary">Your learning journey at a glance</p>
        </div>
      </div>

      {/* ── Overview rings ───────────────── */}
      <section className="bg-surface rounded-2xl border border-border p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          <RingProgress value={hiraganaStats.avg} label="Hiragana" />
          <RingProgress value={katakanaStats.avg} label="Katakana" />
          <RingProgress value={emojiStats.avg} label="Emoji" />
          <RingProgress value={vocabStats.avgAccuracy} label="Vocab" />
        </div>
      </section>

      {/* ── Quick stats ──────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon="🔥" label="Day streak" value={streakDays} />
        <StatCard icon="📝" label="Total exercises" value={totalExercises.toLocaleString()} />
        <StatCard icon="⏱️" label="Time practiced" value={formatTime(totalTime)} />
        <StatCard icon="📅" label="Last practiced" value={progress.lastPracticeDate ? new Date(progress.lastPracticeDate).toLocaleDateString() : '–'} />
      </div>

      {/* ── Hiragana ─────────────────────── */}
      <Section title="Hiragana Mastery" icon="あ">
        <div className="flex flex-wrap gap-4 text-sm text-secondary">
          <span><strong className="text-primary">{hiraganaStats.practiced}</strong>/{hiraganaStats.total} practiced</span>
          <span><strong className="text-primary">{hiraganaStats.mastered}</strong> mastered</span>
          <span>Avg <strong className="text-primary">{hiraganaStats.avg}%</strong></span>
        </div>
        <div className="space-y-4">
          <KanaMasteryGrid data={hiraganaData.basic} mastery={progress.characterMastery} categoryLabel="Basic (Gojūon)" />
          <KanaMasteryGrid data={hiraganaData.dakuten} mastery={progress.characterMastery} categoryLabel="Dakuten" />
          <KanaMasteryGrid data={hiraganaData.handakuten} mastery={progress.characterMastery} categoryLabel="Handakuten" />
          <KanaMasteryGrid data={hiraganaData.combinations} mastery={progress.characterMastery} categoryLabel="Combinations (Yōon)" />
        </div>
        <MasteryLegend />
      </Section>

      {/* ── Katakana ─────────────────────── */}
      <Section title="Katakana Mastery" icon="カ">
        <div className="flex flex-wrap gap-4 text-sm text-secondary">
          <span><strong className="text-primary">{katakanaStats.practiced}</strong>/{katakanaStats.total} practiced</span>
          <span><strong className="text-primary">{katakanaStats.mastered}</strong> mastered</span>
          <span>Avg <strong className="text-primary">{katakanaStats.avg}%</strong></span>
        </div>
        <div className="space-y-4">
          <KanaMasteryGrid data={katakanaData.basic} mastery={progress.characterMastery} categoryLabel="Basic (Gojūon)" />
          <KanaMasteryGrid data={katakanaData.dakuten} mastery={progress.characterMastery} categoryLabel="Dakuten" />
          <KanaMasteryGrid data={katakanaData.handakuten} mastery={progress.characterMastery} categoryLabel="Handakuten" />
          <KanaMasteryGrid data={katakanaData.combinations} mastery={progress.characterMastery} categoryLabel="Combinations (Yōon)" />
        </div>
        <MasteryLegend />
      </Section>

      {/* ── Vocabulary ───────────────────── */}
      <Section title="Vocabulary" icon="📚">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon="📖" label="Words studied" value={vocabStats.totalWords} />
          <StatCard icon="✅" label="Accuracy" value={`${vocabStats.avgAccuracy}%`} sub={`${vocabStats.totalCorrect}/${vocabStats.totalAttempts} correct`} />
          <StatCard icon="🏆" label="Mastered" value={vocabStats.mastered} sub="≥75% with 3+ attempts" />
        </div>
        {vocabStats.dueNow > 0 && (
          <Link
            to="/vocab"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:underline"
          >
            {vocabStats.dueNow} word{vocabStats.dueNow !== 1 ? 's' : ''} due for review →
          </Link>
        )}
      </Section>

      {/* ── Grammar ──────────────────────── */}
      <Section title="Grammar" icon="📝">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon="🧩" label="Items practiced" value={grammarStats.totalItems} />
          <StatCard icon="🔄" label="Total attempts" value={grammarStats.totalSeen} />
          <StatCard icon="🎯" label="Accuracy" value={`${grammarStats.accuracy}%`} sub={`${grammarStats.totalCorrect}/${grammarStats.totalSeen} correct`} />
        </div>
      </Section>

      {/* ── Emoji Quiz ───────────────────── */}
      <Section title="Emoji Quiz" icon="😄">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon="🎮" label="Emojis studied" value={emojiStats.total} />
          <StatCard icon="✅" label="Accuracy" value={`${pct(emojiStats.correct, emojiStats.totalAttempts)}%`} sub={`${emojiStats.correct}/${emojiStats.totalAttempts} correct`} />
          <StatCard icon="🏆" label="Mastered" value={emojiStats.mastered} sub="≥75% mastery" />
        </div>
      </Section>
    </main>
  );
}
