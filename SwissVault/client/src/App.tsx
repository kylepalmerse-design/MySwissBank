import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setLoggedIn(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
        <div className="bg-gray-800 p-10 rounded-xl shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Swiss Vault!</h1>
          <p className="text-xl mb-6">Your balance: $1,000,000</p>
          <button onClick={() => setLoggedIn(false)} className="bg-red-600 px-6 py-3 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-96">
        <h1 className="text-3xl font-bold mb-8 text-center">My Swiss Bank</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email (marco.rossi)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
            required
          />
          <input
            type="password"
            placeholder="Password (password456)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
            required
          />
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button type="submit" className="w-full bg-purple-600 py-3 rounded hover:bg-purple-700 font-bold">
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400 text-sm">
          Test: marco.rossi / password456
        </p>
      </div>
    </div>
  );
}

export default App;
