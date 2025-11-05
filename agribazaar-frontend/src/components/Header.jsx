import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-green-700 text-white p-4 flex justify-between">
      <span className="font-bold text-lg">AgriBazaar</span>
      <nav>
        <Link to="/" className="mx-2 hover:underline">Home</Link>
        <Link to="/login" className="mx-2 hover:underline">Login</Link>
        
      </nav>
    </header>
  );
}
