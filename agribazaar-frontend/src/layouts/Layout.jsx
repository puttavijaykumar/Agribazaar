import Header from '../components/Header';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-green-700 text-white p-4 text-center">
        &copy; 2025 AgriBazaar. All rights reserved.
      </footer>
    </div>
  );
}
