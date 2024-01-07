// Login.js
import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
        const response = await fetch('localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          // Spara token i session/local storage, hantera inloggning på klienten om det behövs
          console.log('Inloggning lyckades!', data);
        } else {
          const data = await response.json();
          setError(data.message);
        }
      } catch (error) {
        console.error('Något gick fel vid inloggning', error);
        setError('Något gick fel. Försök igen senare.');
      }
    };
  

  return (
    <div>
      <h3>Logga in</h3>
      <form>
        
        <label>
          Användarnamn:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Lösenord:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Logga in
        </button>
      </form>
    </div>
  );
}

export default Login;

