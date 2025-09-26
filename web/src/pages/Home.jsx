// web/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMe } from '../lib/api';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 border border-slate-200">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-2 text-text">{title}</h3>
    <p className="text-text-muted">{children}</p>
  </div>
);

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { getMe().then(setUser) }, []);

  const handleGetStarted = () => {
    if (user) navigate('/boards');
    else navigate('/register');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      
      <main className="relative">
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Organize your work, effortlessly.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted">
              EpiTrello helps you collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique—accomplish it all here.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleGetStarted} className="px-8 py-3 rounded-lg bg-primary text-white text-base font-semibold shadow-lg hover:bg-primary-dark transition-all transform hover:scale-105 w-full sm:w-auto">
                {user ? 'Go to my boards' : 'Get Started for Free'}
              </button>
              {!user && (
                <Link to="/login" className="px-8 py-3 rounded-lg bg-white text-primary font-semibold shadow-lg border border-slate-200 hover:bg-surface transition-all w-full sm:w-auto">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-surface border-y border-slate-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-text">Why choose EpiTrello?</h2>
              <p className="mt-4 text-text-muted max-w-2xl mx-auto">Everything you need to move work forward, from the smallest details to the big picture.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard title="Visual Organization" icon={<IconClipboard />}>
                Create boards, lists, and cards to track your tasks with a clear and intuitive visual interface.
              </FeatureCard>
              <FeatureCard title="Seamless Collaboration" icon={<IconUsers />}>
                Work as a team, share your boards, assign tasks, and move projects forward together.
              </FeatureCard>
              <FeatureCard title="Secure & Simple" icon={<IconLock />}>
                Your data is protected, and the interface remains simple, fast, and clutter-free.
              </FeatureCard>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// SVG Icons
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>