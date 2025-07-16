import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Lessons() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to phrases page
    navigate('/phrases');
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}

export default Lessons;
