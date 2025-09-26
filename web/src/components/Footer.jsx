import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-slate-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <Link
                            to="/"
                            className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2"
                        >
                            <img
                                src="/epitech_logo.png"
                                alt="EpiTrello Logo"
                                className="h-8 w-10"
                            />
                            EpiTrello
                        </Link>
                        <p className="text-text-muted text-base">
                            Organize your work, effortlessly.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-text tracking-wider uppercase">
                                    Product
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link
                                            to="/boards"
                                            className="text-base text-text-muted hover:text-primary"
                                        >
                                            Boards
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-text-muted hover:text-primary"
                                        >
                                            Features
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-text tracking-wider uppercase">
                                    About
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-text-muted hover:text-primary"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-text-muted hover:text-primary"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-1 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-text tracking-wider uppercase">
                                    Legal
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-text-muted hover:text-primary"
                                        >
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-text-muted hover:text-primary"
                                        >
                                            Terms
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <p className="text-base text-text-muted text-center">
                        &copy; {currentYear} EpiTrello. Project by Mattéo
                        Springmann.
                    </p>
                </div>
            </div>
        </footer>
    );
}
