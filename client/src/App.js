import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import StartPage from './StartPage.js';
import Footer from './Footer';
import Header from './Header';

function App() {
  return (
    <Router>
      <>
        <Header />

        <StartPage />

        <Footer />

      </>
    </Router>


  )
}

export default App;
