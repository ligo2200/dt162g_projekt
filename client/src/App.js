import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import StartPage from './StartPage.js';
import Footer from './Footer';
import Header from './Header';

function App() {
  return (
    <>
    <Header />

    <StartPage />

    <Footer />

    </>
    
    

  )
}

export default App;
