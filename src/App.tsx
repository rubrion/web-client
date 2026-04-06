import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import LoadingScreen from './components/LoadingScreen';
import AppRoutes from './routes/routes';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
      </Router>
    </>
  );
};

export default App;
