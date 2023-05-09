import React from 'react';
import MovieList from './components/MovieList';

const App: React.FC = () => {
  return (
    <div>
      <h1>Movie Recommendation App</h1>
      <MovieList />
    </div>
  );
};

export default App;
