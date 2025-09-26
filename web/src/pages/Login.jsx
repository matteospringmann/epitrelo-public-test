// web/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const nav = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        try {
            await api.post("/auth/login", { email, password });
            nav("/boards");
        } catch (e) {
            setErr(e.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link
                        to="/"
                        className="text-3xl font-extrabold text-primary tracking-tight"
                    >
                        EpiTrello
                    </Link>
                    <p className="mt-2 text-text-muted">
                        Welcome back! Please sign in to your account.
                    </p>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-slate-200"
                >
                    {err && (
                        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg text-center">
                            {err}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-text-muted">
                            Email
                        </label>
                        <input
                            className="mt-1 w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            type="email"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-text-muted">
                            Password
                        </label>
                        <input
                            className="mt-1 w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button className="w-full rounded-lg bg-primary text-white py-3 font-semibold shadow-md hover:bg-primary-dark transition">
                        Sign In
                    </button>

                    <div className="text-sm text-center text-text-muted">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Create one
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
