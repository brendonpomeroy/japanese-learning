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
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous character"
      >
        ← Prev
      </button>

      <button
        onClick={onClear}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60"
        aria-label="Clear canvas"
      >
        Clear
      </button>

      <button
        onClick={() => speakJapanese(character)}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"
        aria-label="Hear pronunciation"
      >
        🔊 Audio
      </button>

      <button
        onClick={onMarkPracticed}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
        aria-label="Mark as practiced"
      >
        ✓ Practiced
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next character"
      >
        Next →
      </button>
    </div>
  );
}
