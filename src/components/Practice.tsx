function Practice() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Practice</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>
          <p className="text-gray-600 mb-4">Practice with interactive flashcards</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Start Flashcards
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Quiz</h2>
          <p className="text-gray-600 mb-4">Test your knowledge with quizzes</p>
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Take Quiz
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Writing Practice</h2>
          <p className="text-gray-600 mb-4">Practice writing Japanese characters</p>
          <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">
            Start Writing
          </button>
        </div>
      </div>
    </div>
  );
}

export default Practice;
