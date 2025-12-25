import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "How It Works", to: "/how-it-works" },
  { name: "Specialties", to: "/specialties" },
  { name: "Login", to: "/login" },
  { name: "Signup", to: "/register" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                HealHive
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-lg text-md font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-200">
              <svg
                className="h-4 w-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z"
                />
              </svg>
              <input
                className="bg-transparent outline-none text-sm text-slate-700 placeholder-emerald-400 w-48"
                placeholder="Search doctors, specialties"
              />
            </div>

            {/* CTA */}
            <Link
              to="/book"
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow hover:shadow-md hover:scale-[1.02] transition"
            >
              Consult Now
            </Link>

            {/* Profile */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfile((s) => !s)}
                className="flex items-center gap-2 bg-white border border-emerald-100 rounded-full p-1 hover:shadow transition"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Ankita+Gupta&background=059669&color=fff"
                  alt="avatar"
                  className="h-8 w-8 rounded-full"
                />
                <span className="hidden sm:block text-sm font-medium text-slate-700">
                  Ankita
                </span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl bg-white shadow-xl border border-emerald-100 overflow-hidden animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-emerald-50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-emerald-50"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-emerald-700 hover:bg-emerald-50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-emerald-100">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-4 py-3 rounded-xl font-semibold"
            >
              Consult Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
