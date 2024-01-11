import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div>
        <header>
      <div className="logo">
        
        <Link to="/">Min Logotyp</Link>
      </div>
      <nav>
        
        <Link to="/login">Logga in</Link>
        <Link to="/register">Registrera</Link>
      </nav>
    </header>
    </div>
  );
}
