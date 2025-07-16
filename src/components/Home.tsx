function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Japanese Lessons</h1>
      <div className="text-center">
        <p className="text-lg mb-6">Welcome to your Japanese learning journey!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Hiragana</h3>
            <p className="text-gray-600">Learn the basic Japanese syllabary</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Katakana</h3>
            <p className="text-gray-600">Master the second syllabary</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Kanji</h3>
            <p className="text-gray-600">Explore Japanese characters</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
