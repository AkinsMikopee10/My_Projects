function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white/30 backdrop-blur-md shadow-md p-6 space-y-6 rounded-r-xl">
      <nav className="space-y-4">
        <a
          href="#"
          className="block text-gray-700 hover:text-indigo-600 font-medium"
        >
          🏠 Dashboard
        </a>
        <a
          href="#"
          className="block text-gray-700 hover:text-indigo-600 font-medium"
        >
          ✅ Tasks
        </a>
        <a
          href="#"
          className="block text-gray-700 hover:text-indigo-600 font-medium"
        >
          ⏱️ Focus Timer
        </a>
        <a
          href="#"
          className="block text-gray-700 hover:text-indigo-600 font-medium"
        >
          📊 Stats
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
