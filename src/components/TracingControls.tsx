import { speakJapanese } from '../utils/helpers';

interface TracingControlsProps {
  character: string;
  onClear: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMarkPracticed: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function TracingControls({
  character,
  onClear,
  onPrevious,
  onNext,
  onMarkPracticed,
  hasPrevious,
  hasNext,
}: TracingControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-surface-alt text-secondary hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous character"
      >
        ← Prev
      </button>

      <button
        onClick={onClear}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-error/10 text-error hover:bg-error/20"
        aria-label="Clear canvas"
      >
        Clear
      </button>

      <button
        onClick={() => speakJapanese(character)}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20"
        aria-label="Hear pronunciation"
      >
        🔊 Audio
      </button>

      <button
        onClick={onMarkPracticed}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-success/10 text-success hover:bg-success/20"
        aria-label="Mark as practiced"
      >
        ✓ Practiced
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-surface-alt text-secondary hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next character"
      >
        Next →
      </button>
    </div>
  );
}
