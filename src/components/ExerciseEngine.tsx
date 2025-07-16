import React, { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion, ExerciseType, HiraganaCategory } from '../types';
import { getRandomHiragana, getAllHiragana } from '../data/hiraganaData';
import { useApp } from '../hooks/useApp';

interface ExerciseEngineProps {
  exerciseType: ExerciseType;
  category?: HiraganaCategory;
  questionCount?: number;
  onComplete?: (score: number, totalQuestions: number) => void;
}

const ExerciseEngine: React.FC<ExerciseEngineProps> = ({
  exerciseType,
  category,
  questionCount = 10,
  onComplete
}) => {
  const { dispatch } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const generateRandomOptions = useCallback((correctAnswer: string, isRomaji: boolean) => {
    const allChars = getAllHiragana();
    const allOptions = isRomaji 
      ? Object.values(allChars)
      : Object.keys(allChars);
    
    const wrongOptions = allOptions
      .filter(option => option !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
  }, []);

  const generateQuestion = useCallback((): QuizQuestion => {
    const { character, romaji } = getRandomHiragana(category);
    
    let questionType: 'hiragana-to-romaji' | 'romaji-to-hiragana' | 'typing';
    
    if (exerciseType === 'mixed') {
      const rand = Math.random();
      questionType = rand < 0.33 ? 'hiragana-to-romaji' : rand < 0.66 ? 'romaji-to-hiragana' : 'typing';
    } else if (exerciseType === 'recognition') {
      questionType = 'hiragana-to-romaji';
    } else if (exerciseType === 'typing') {
      questionType = 'typing';
    } else {
      questionType = 'romaji-to-hiragana';
    }

    const options = questionType === 'typing' 
      ? [] // No options needed for typing
      : generateRandomOptions(
          questionType === 'hiragana-to-romaji' ? romaji : character,
          questionType === 'hiragana-to-romaji'
        );

    return {
      id: `${character}-${Date.now()}`,
      character,
      romaji,
      correctAnswer: questionType === 'hiragana-to-romaji' ? romaji : 
                     questionType === 'typing' ? romaji : character,
      options,
      type: questionType
    };
  }, [category, exerciseType, generateRandomOptions]);

  const generateQuestions = useCallback(() => {
    const newQuestions = Array.from({ length: questionCount }, generateQuestion);
    setQuestions(newQuestions);
    setCurrentQuestion(newQuestions[0]);
  }, [questionCount, generateQuestion]);

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
    
    if (exerciseType === 'speed') {
      setTimeLeft(30); // 30 seconds for speed challenge
    }
  }, [generateQuestions, exerciseType]);

  const handleComplete = useCallback(() => {
    onComplete?.(score, questions.length);
  }, [onComplete, score, questions.length]);

  useEffect(() => {
    let timer: number;
    if (timeLeft !== null && timeLeft > 0) {
      timer = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, handleComplete]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Record the exercise result
    if (currentQuestion) {
      dispatch({
        type: 'ADD_EXERCISE_RESULT',
        payload: {
          character: currentQuestion.character,
          romaji: currentQuestion.romaji,
          userAnswer: answer,
          correct: isCorrect,
          timeSpent: Date.now() - startTime
        }
      });
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleTypingSubmit = (answer: string) => {
    if (showResult) return;
    
    setTypedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer.toLowerCase().trim() === currentQuestion?.correctAnswer.toLowerCase();
    if (isCorrect) {
      setScore(score + 1);
    }

    // Record the exercise result
    if (currentQuestion) {
      dispatch({
        type: 'ADD_EXERCISE_RESULT',
        payload: {
          character: currentQuestion.character,
          romaji: currentQuestion.romaji,
          userAnswer: answer,
          correct: isCorrect,
          timeSpent: Date.now() - startTime
        }
      });
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !showResult) {
      handleTypingSubmit(typedAnswer);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      handleComplete();
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setCurrentQuestion(questions[nextIndex]);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setShowResult(false);
    setStartTime(Date.now());
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getQuestionDisplay = () => {
    if (currentQuestion.type === 'hiragana-to-romaji') {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Select the correct romaji for:</p>
          <div className="text-6xl font-japanese font-bold text-gray-800 mb-6">
            {currentQuestion.character}
          </div>
        </div>
      );
    } else if (currentQuestion.type === 'typing') {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Type the romaji for:</p>
          <div className="text-6xl font-japanese font-bold text-gray-800 mb-6">
            {currentQuestion.character}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Select the correct hiragana for:</p>
          <div className="text-4xl font-mono font-bold text-gray-800 mb-6">
            {currentQuestion.romaji}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-sm text-gray-600">
          Score: {score}/{questions.length}
        </div>
        {timeLeft !== null && (
          <div className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </div>
        )}
      </div>

      <div className="mb-8">
        {getQuestionDisplay()}
      </div>

      {currentQuestion.type === 'typing' ? (
        <div className="mb-6">
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type the romaji here..."
              disabled={showResult}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
              autoFocus
            />
            <button
              onClick={() => handleTypingSubmit(typedAnswer)}
              disabled={showResult || !typedAnswer.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 font-medium
                ${showResult && option === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-100 text-green-800'
                  : showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer
                    ? 'border-red-500 bg-red-100 text-red-800'
                    : showResult
                      ? 'border-gray-300 bg-gray-100 text-gray-500'
                      : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                }
              `}
            >
              <span className={currentQuestion.type === 'romaji-to-hiragana' ? 'text-2xl font-japanese' : 'text-xl font-mono'}>
                {option}
              </span>
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <p className={`text-lg font-medium ${
            (currentQuestion.type === 'typing' ? 
              typedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() : 
              selectedAnswer === currentQuestion.correctAnswer) 
            ? 'text-green-600' : 'text-red-600'
          }`}>
            {(currentQuestion.type === 'typing' ? 
              typedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() : 
              selectedAnswer === currentQuestion.correctAnswer) 
            ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {(currentQuestion.type === 'typing' ? 
            typedAnswer.toLowerCase().trim() !== currentQuestion.correctAnswer.toLowerCase() : 
            selectedAnswer !== currentQuestion.correctAnswer) && (
            <p className="text-sm text-gray-600 mt-2">
              The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseEngine;
