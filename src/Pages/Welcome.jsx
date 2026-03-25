import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 font-sans selection:bg-indigo-500/30 relative overflow-hidden w-full">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[100px]"></div>
            <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[100px]"></div>
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] bg-[length:32px_32px] opacity-70"></div>
        </div>

        {/* Floating Card */}
        <div className="relative w-full max-w-[440px] bg-slate-800/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-700/50 p-8 sm:px-12 sm:py-14 flex flex-col items-center z-20 transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(99,102,241,0.25)] hover:-translate-y-1 hover:bg-slate-800/50">
            {/* Logo / Icon */}
            <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-500 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)] transform -translate-y-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>

            <div className="text-center mb-10 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 mb-5 shadow-sm">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">Welcome To</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight mb-4 hidden sm:block" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Infinex Tech
                </h1>
                <h1 className="text-4xl font-semibold text-white tracking-tight leading-tight mb-4 sm:hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Infinex
                </h1>
                <p className="text-slate-400 text-[15px] font-medium leading-relaxed px-2">
                    The complete platform to design, build, and ship your next big idea.
                </p>
            </div>

            <div className="w-full flex flex-col gap-4 mt-2">
                <Link
                    to="/signup"
                    className="relative w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 overflow-hidden group shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)]"
                >
                    <span className="relative flex items-center gap-2">
                        Create Account
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </Link>

                <Link
                    to="/login"
                    className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-all duration-200 hover:shadow-md"
                >
                    Already Registered? Login
                </Link>
            </div>

            {/* Footer Links */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500">
                <span>© 2026 Infinex Tech</span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-700"></span>
                <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            </div>
        </div>
    </div>
  )
}
