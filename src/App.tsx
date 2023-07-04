import React from 'react';
import logo from './logo.svg';
import Typography from '@mui/material/Typography';
import './App.css';
import Search from './Search';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h2" component="h1">IO Quote Board 
        Database</Typography>
      </header>
      <Search></Search>
    </div>
  );
}

export default App;
