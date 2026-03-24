import React, { useMemo } from 'react';
import { ToggleButton } from '../../components/ToggleButton';
import { getTopics } from '../../features/vocab/vocabData';
import { capitalize } from '../../utils/helpers';
import type {
  VocabMode,
  PracticeMode,
  DifficultyFilter,
  TopicFilter,
  VocabSettings,
} from '../../features/vocab/types';

interface VocabControlsProps {
  mode: VocabMode;
  practiceMode: PracticeMode;
  selectedDifficulty: DifficultyFilter;
  selectedTopic: TopicFilter;
  settings: VocabSettings;
  onSetMode: (mode: VocabMode) => void;
  onSetPracticeMode: (mode: PracticeMode) => void;
  onSetDifficulty: (difficulty: DifficultyFilter) => void;
  onSetTopic: (topic: TopicFilter) => void;
  onSetSettings: (settings: Partial<VocabSettings>) => void;
  onResetProgress: () => void;
}

export const VocabControls: React.FC<VocabControlsProps> = ({
  mode,
  practiceMode,
  selectedDifficulty,
  selectedTopic,
  settings,
  onSetMode,
  onSetPracticeMode,
  onSetDifficulty,
  onSetTopic,
  onSetSettings,
  onResetProgress,
}) => {
  const topics = useMemo(() => getTopics(), []);

  return (
    <div className="bg-surface rounded-lg shadow-soft-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Vocab Practice
      </h1>

      <div className="space-y-4">
        {/* Answer Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Answer Mode
          </label>
          <div className="flex gap-2">
            <ToggleButton
              active={mode === 'type'}
              onClick={() => onSetMode('type')}
            >
              Type It
            </ToggleButton>
            <ToggleButton
              active={mode === 'mcq'}
              onClick={() => onSetMode('mcq')}
            >
              Pick 1 of 3
            </ToggleButton>
          </div>
        </div>

        {/* Practice Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Practice Mode
          </label>
          <div className="flex gap-2">
            <ToggleButton
              active={practiceMode === 'auto'}
              onClick={() => onSetPracticeMode('auto')}
            >
              Auto
            </ToggleButton>
            <ToggleButton
              active={practiceMode === 'filtered'}
              onClick={() => onSetPracticeMode('filtered')}
            >
              Filtered
            </ToggleButton>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={e =>
                onSetDifficulty(e.target.value as DifficultyFilter)
              }
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary"
            >
              <option value="all">All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={e => onSetTopic(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {capitalize(topic)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Settings */}
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showRomaji}
              onChange={e => onSetSettings({ showRomaji: e.target.checked })}
              className="w-5 h-5 text-accent-blue rounded focus:ring-accent-blue"
            />
            <span className="ml-2 text-secondary">
              Show Romaji
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showHint}
              onChange={e => onSetSettings({ showHint: e.target.checked })}
              className="w-5 h-5 text-accent-blue rounded focus:ring-accent-blue"
            />
            <span className="ml-2 text-secondary">
              Show Hint
            </span>
          </label>
        </div>

        {/* Reset Progress */}
        <div>
          <button
            onClick={onResetProgress}
            className="px-4 py-2 bg-error hover:bg-error/90 text-white rounded-lg font-medium transition-colors"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};
