import { useState } from 'react';
import { Link } from 'react-router-dom';
import ExerciseEngine from './ExerciseEngine';
import ProgressTracker from './ProgressTracker';
import type { ExerciseType, HiraganaCategory } from '../types';

function Practice() {
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<HiraganaCategory>('basic');
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState<{
    score: number;
    total: number;
  } | null>(null);

  const exercises: {
    type: ExerciseType;
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      type: 'recognition',
      title: 'Recognition Quiz',
      description: 'See hiragana → select romaji',
      icon: '👁️',
    },
    {
      type: 'production',
      title: 'Production Quiz',
      description: 'See romaji → select hiragana',
      icon: '✍️',
    },
    {
      type: 'typing',
      title: 'Typing Quiz',
      description: 'See hiragana → type romaji',
      icon: '⌨️',
    },
    {
      type: 'speed',
      title: 'Speed Challenge',
      description: 'Fast-paced recognition test',
      icon: '⚡',
    },
    {
      type: 'mixed',
      title: 'Mixed Practice',
      description: 'Random mix of all exercise types',
      icon: '🎯',
    },
  ];

  const categories: { key: HiraganaCategory; title: string }[] = [
    { key: 'basic', title: 'Basic' },
    { key: 'dakuten', title: 'Dakuten' },
    { key: 'handakuten', title: 'Handakuten' },
    { key: 'combinations', title: 'Combinations' },
  ];

  const handleExerciseComplete = (score: number, total: number) => {
    setLastScore({ score, total });
    setShowResults(true);
    setCurrentExercise(null);
  };

  const handleStartExercise = (exerciseType: ExerciseType) => {
    setCurrentExercise(exerciseType);
    setShowResults(false);
  };

  if (currentExercise) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setCurrentExercise(null)}
            className="text-accent-blue hover:text-accent-blue/80 mb-4 inline-flex items-center"
          >
            ← Back to Practice Menu
          </button>
        </div>

        <ExerciseEngine
          exerciseType={currentExercise}
          category={selectedCategory}
          onComplete={handleExerciseComplete}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="text-accent-blue hover:text-accent-blue/80 mb-4 inline-flex items-center"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-primary mb-4">
          Practice Exercises
        </h1>
        <p className="text-lg text-secondary">
          Test your hiragana knowledge with different types of exercises
        </p>
      </div>

      {showResults && lastScore && (
        <div className="bg-success/10 border border-success/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-success mb-2">
            Exercise Complete!
          </h2>
          <p className="text-success">
            You scored {lastScore.score} out of {lastScore.total} (
            {((lastScore.score / lastScore.total) * 100).toFixed(1)}%)
          </p>
          <button
            onClick={() => setShowResults(false)}
            className="mt-3 text-success hover:text-success/80 font-medium"
          >
            Continue practicing →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface rounded-lg shadow-soft-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Select Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(category => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-accent-blue text-white'
                      : 'bg-surface-alt text-secondary hover:bg-border'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-soft-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Choose Exercise Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map(exercise => (
                <button
                  key={exercise.type}
                  onClick={() => handleStartExercise(exercise.type)}
                  className="group bg-accent-blue/5 hover:bg-accent-blue/10 rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-accent-blue"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl">{exercise.icon}</span>
                    <h3 className="text-xl font-bold text-primary">
                      {exercise.title}
                    </h3>
                  </div>
                  <p className="text-secondary mb-4">
                    {exercise.description}
                  </p>
                  <div className="flex items-center text-accent-blue group-hover:text-accent-blue/80">
                    <span className="mr-2">Start exercise</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ProgressTracker />
        </div>
      </div>
    </div>
  );
}

export default Practice;
