import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../SupabaseClient'

export default function UserReg() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        companyName: '',
        isAgency: ''
    })

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.phone.length !== 10) {
            setError('Phone number must be exactly 10 digits')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        // Using Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: formData.name,
                    phone: formData.phone,
                    company_name: formData.companyName,
                    is_agency: formData.isAgency === 'Yes'
                }
            }
        })

        setLoading(false)

        if (signUpError) {
            setError(signUpError.message)
        } else {
            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md bg-slate-800 p-10 rounded-[2rem] shadow-2xl border border-slate-700/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Check your email</h2>
                    <p className="text-slate-300 mb-8 text-lg">We've sent a verification link to <br /><span className="font-semibold text-white">{formData.email}</span></p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redirecting to login...
                    </div>
                </div>
            </div>
        )
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
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center mt-4 sm:mt-8 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">Infinex</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-md mb-6 shadow-xl">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">New Features</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.15] mb-5">
                    Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">Professionals</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed px-4">
                    Join thousands of innovators who are bridging the gap between cutting-edge technology and real-world results.
                </p>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-[500px] relative z-20 mb-10">
                <div className="bg-slate-800/40 backdrop-blur-3xl p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-700/50 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(99,102,241,0.25)] hover:-translate-y-1 hover:bg-slate-800/50">
                    <h2 className="text-[1.75rem] font-extrabold text-white tracking-tight leading-tight mb-2 text-center">Create an account</h2>
                    <p className="text-slate-400 text-sm mb-8 font-medium text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign in here
                        </Link>
                    </p>

                    <form className="space-y-5" onSubmit={handleSignup}>
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-900/30 text-red-200 text-sm rounded-xl border border-red-500/30 animate-fade-in text-left">
                                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5 text-left">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-800 transition-all duration-200"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5 text-left">Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-800 transition-all duration-200"
                                    placeholder="+91 9364683778"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5 text-left">Company</label>
                                <input
                                    name="companyName"
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-800 transition-all duration-200"
                                    placeholder="Infinex Tech"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5 text-left">Are you an agency?</label>
                                <div className="relative">
                                    <select
                                        name="isAgency"
                                        required
                                        className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-800 transition-all duration-200 appearance-none pr-10 hover:cursor-pointer"
                                        value={formData.isAgency}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled className="bg-slate-800 text-slate-500 hidden">Select...</option>
                                        <option value="No" className="bg-slate-800 text-white">No</option>
                                        <option value="Yes" className="bg-slate-800 text-white">Yes</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-indigo-600 overflow-hidden group shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)]"
                            >
                                <span className="relative flex items-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>

                        <p className="text-[13px] text-center text-slate-500 mt-6 max-w-[280px] mx-auto leading-relaxed">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="text-slate-400 font-semibold hover:text-white transition-colors">Terms</a>{' '}
                            and{' '}
                            <a href="#" className="text-slate-400 font-semibold hover:text-white transition-colors">Privacy Policy</a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Bottom Form Context */}
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
