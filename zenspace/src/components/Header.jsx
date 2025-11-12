function Header() {
  return (
    <header className="w-full bg-white/30 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-md rounded-b-xl">
      <h1 className="text-2xl font-semibold text-gray-800">ZenSpace</h1>
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-800 transition">
          🌓
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-9 h-9 rounded-full"
        />
      </div>
    </header>
  );
}

export default Header;
