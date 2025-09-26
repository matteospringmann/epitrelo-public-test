import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getMe, logout as apiLogout } from "../lib/api";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) getMe().then(setUser);
    }, [menuOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleLogout = async () => {
        await apiLogout();
        setUser(null);
        setMenuOpen(false);
        navigate("/");
    };

    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
            isActive ? "text-primary" : "text-text-muted hover:text-primary"
        }`;

    return (
        <nav
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200/80" : "bg-white/50"}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2"
                        >
                            <img
                                src="epitech_logo.png"
                                alt="EpiTrello Logo"
                                className="h-8 w-10"
                            />
                            EpiTrello
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className={navLinkClass}>
                                Home
                            </NavLink>
                            <NavLink to="/boards" className={navLinkClass}>
                                Boards
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                            >
                                <span>Account</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {menuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-slate-100">
                                                <p className="text-sm text-text-muted">
                                                    Signed in as
                                                </p>
                                                <p className="text-sm font-medium text-text truncate">
                                                    {user.name}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                                className="block px-4 py-2 text-sm text-text-muted hover:bg-surface hover:text-primary"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-text-muted hover:bg-surface hover:text-primary"
                                            >
                                                Sign out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                                className="block px-4 py-2 text-sm text-text-muted hover:bg-surface hover:text-primary"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                                className="block px-4 py-2 text-sm text-text-muted hover:bg-surface hover:text-primary"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
