function Lessons() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lessons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Beginner</h2>
          <ul className="space-y-2">
            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Basic Greetings</li>
            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Numbers 1-10</li>
            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Days of the Week</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Intermediate</h2>
          <ul className="space-y-2">
            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Verb Conjugations</li>
            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Adjectives</li>
            <li className="text-blue-600 hover:text-blue-800 cursor-pointer">Particle Usage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Lessons;
