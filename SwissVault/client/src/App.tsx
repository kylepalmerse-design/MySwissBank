import { useState } from 'react';

function App() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(login);
    } else {
      setError(data.message || 'Login failed');
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
        <div className="bg-gray-800 p-10 rounded-xl shadow-2xl">
          <h1 className="text-4xl font-bold mb-6">Welcome, {user}!</h1>
          <p className="text-xl">Your Swiss Bank vault is secure</p>
          <button onClick={() => setUser(null)} className="mt-6 bg-red-600 px-6 py-3 rounded hover:bg-red-700">
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
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
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
        <p className="text-center mt-6 text-gray-400">
          Try: marco.rossi / password456
        </p>
      </div>
    </div>
  );
}

export default App;
