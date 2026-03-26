import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../SupabaseClient'

export default function UserLogin() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            setLoading(false)
            return
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        setLoading(false)

        if (signInError) {
            setError(signInError.message)
        } else if (data.user) {
            navigate('/home')
        }
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        setError(null)

        const { error: googleError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/home`
            }
        })

        if (googleError) {
            setError(googleError.message)
            setGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 font-sans selection:bg-indigo-500/30 relative overflow-y-auto w-full">
            {/* Abstract background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[100px]"></div>
                <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[100px]"></div>
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] bg-[length:32px_32px] opacity-70"></div>
            </div>

            {/* Top Branding Header */}
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center mt-4 sm:mt-12 mb-8 sm:mb-12">
                <Link to="/" className="flex items-center gap-3 mb-6 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight group-hover:text-slate-200 transition-colors">Infinex</span>
                </Link>

                <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.15] mb-5">
                    Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">Back</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed px-4">
                    Sign in to your account and continue your journey with Infinex Tech.
                </p>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-[450px] relative z-20 mb-10 group/card">
                <div className="bg-slate-800/40 backdrop-blur-3xl p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-700/50 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(99,102,241,0.25)] hover:-translate-y-1 hover:bg-slate-800/50">
                    <h2 className="text-[1.75rem] font-extrabold text-white tracking-tight leading-tight mb-2 text-center">Sign in</h2>
                    <p className="text-slate-400 text-sm mb-8 font-medium text-center">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign up here
                        </Link>
                    </p>

                    {error && (
                        <div className="flex items-start gap-3 mb-6 p-4 bg-red-900/30 text-red-200 text-sm rounded-xl border border-red-500/30 animate-fade-in text-left">
                            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <div className="mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="relative w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                        >
                            {googleLoading ? (
                                <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50" />
                        </div>
                        <div className="relative flex justify-center text-sm font-medium">
                            <span className="px-3 bg-slate-800 text-slate-400 rounded-full">Or continue with email</span>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5 text-left">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-800 transition-all duration-200"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5 text-left">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-800 transition-all duration-200 shadow-none hover:shadow-none pr-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] group"
                            >
                                <span className="relative flex items-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Uptime/Support stats */}
            <div className="w-full max-w-2xl relative z-10 flex flex-col sm:flex-row justify-center gap-8 sm:gap-20 pb-12 mt-4 text-center">
                <div>
                    <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                    <div className="text-sm text-slate-400 font-medium">Uptime Guarantee</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm text-slate-400 font-medium">Expert Support</div>
                </div>
            </div>
        </div>
    )
}