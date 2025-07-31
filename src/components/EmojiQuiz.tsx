import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllEmojis, getRandomEmoji } from '../data/emojiData';

interface EmojiQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
  questionCount?: number;
}

interface EmojiQuestion {
  id: string;
  emoji: string;
  correctAnswer: string;
  options: string[];
  type: 'emoji-to-japanese';
  showCorrectAnswer?: boolean;
}

type JapaneseDisplayMode = 'japanese' | 'hiragana' | 'romaji';

const EmojiQuiz: React.FC<EmojiQuizProps> = ({
  onComplete,
  questionCount = 10
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<EmojiQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<EmojiQuestion[]>([]);
  const [answeredIncorrectly, setAnsweredIncorrectly] = useState(false);
  const [japaneseMode, setJapaneseMode] = useState<JapaneseDisplayMode>('japanese');

  const generateRandomOptions = useCallback((correctAnswer: string) => {
    const allEmojis = getAllEmojis();
    let allOptions: string[] = [];
    
    // Use the selected Japanese display mode
    switch (japaneseMode) {
      case 'hiragana':
        allOptions = allEmojis.map(emoji => emoji.hiragana);
        break;
      case 'romaji':
        allOptions = allEmojis.map(emoji => emoji.romaji);
        break;
      case 'japanese':
      default:
        allOptions = allEmojis.map(emoji => emoji.japanese);
        break;
    }
    
    const wrongOptions = allOptions
      .filter(option => option !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
  }, [japaneseMode]);

  const generateQuestion = useCallback((): EmojiQuestion => {
    const emoji = getRandomEmoji();
    
    let correctAnswer: string;
    // Use the selected Japanese display mode
    switch (japaneseMode) {
      case 'hiragana':
        correctAnswer = emoji.hiragana;
        break;
      case 'romaji':
        correctAnswer = emoji.romaji;
        break;
      case 'japanese':
      default:
        correctAnswer = emoji.japanese;
        break;
    }

    const options = generateRandomOptions(correctAnswer);

    return {
      id: `${emoji.emoji}-${Date.now()}`,
      emoji: emoji.emoji,
      correctAnswer,
      options,
      type: 'emoji-to-japanese'
    };
  }, [generateRandomOptions, japaneseMode]);

  const generateQuestions = useCallback(() => {
    const newQuestions = Array.from({ length: questionCount }, generateQuestion);
    setQuestions(newQuestions);
    setCurrentQuestion(newQuestions[0]);
  }, [questionCount, generateQuestion]);

  useEffect(() => {
    generateQuestions();
    scoreRef.current = 0;
  }, [generateQuestions]);

  // Regenerate questions when Japanese mode changes
  useEffect(() => {
    if (questions.length > 0) {
      generateQuestions();
      setCurrentQuestionIndex(0);
      setScore(0);
      scoreRef.current = 0;
      setSelectedAnswer(null);
      setShowResult(false);
      setAnsweredIncorrectly(false);
    }
  }, [japaneseMode, generateQuestions, questions.length]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion?.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      scoreRef.current += 1;
      setAnsweredIncorrectly(false);
    } else {
      setAnsweredIncorrectly(true);
    }
    
    setShowResult(true);
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      onComplete?.(scoreRef.current, questions.length);
      return;
    }
    
    setCurrentQuestionIndex(nextIndex);
    setCurrentQuestion(questions[nextIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredIncorrectly(false);
  };

  const getQuestionText = () => {
    switch (japaneseMode) {
      case 'hiragana':
        return 'What is this in Hiragana?';
      case 'romaji':
        return 'What is this in Romaji?';
      case 'japanese':
      default:
        return 'What is this in Japanese?';
    }
  };

  const getCorrectAnswerEmoji = () => {
    if (!currentQuestion || !answeredIncorrectly) return null;
    
    const emoji = getAllEmojis().find(e => e.emoji === currentQuestion.emoji);
    if (!emoji) return null;
    
    return emoji;
  };

  if (!currentQuestion) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Score: {score}/{questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Japanese Display Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
            <button
              onClick={() => setJapaneseMode('japanese')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                japaneseMode === 'japanese'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              漢字/カナ
            </button>
            <button
              onClick={() => setJapaneseMode('hiragana')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                japaneseMode === 'hiragana'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              ひらがな
            </button>
            <button
              onClick={() => setJapaneseMode('romaji')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                japaneseMode === 'romaji'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Romaji
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          Choose how Japanese answers are displayed
        </p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
          {getQuestionText()}
        </h2>
        <div className="text-8xl mb-6">{currentQuestion.emoji}</div>
      </div>

      {answeredIncorrectly && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <div className="text-red-800 dark:text-red-200">
            <p className="font-medium mb-2">Incorrect! The correct answer is:</p>
            <div className="text-lg font-bold">{currentQuestion.correctAnswer}</div>
            {(() => {
              const emoji = getCorrectAnswerEmoji();
              if (emoji) {
                return (
                  <div className="mt-2 text-sm">
                    <p><strong>English:</strong> {emoji.english}</p>
                    <p><strong>Japanese:</strong> {emoji.japanese}</p>
                    <p><strong>Hiragana:</strong> {emoji.hiragana}</p>
                    <p><strong>Romaji:</strong> {emoji.romaji}</p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 mb-8">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
          
          if (showResult) {
            if (option === currentQuestion.correctAnswer) {
              buttonClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200";
            } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
              buttonClass += "bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200";
            } else {
              buttonClass += "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400";
            }
          } else {
            buttonClass += "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-400 text-gray-800 dark:text-gray-200";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult}
              className={buttonClass}
            >
              <span className="font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="text-center">
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            {currentQuestionIndex + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmojiQuiz;
