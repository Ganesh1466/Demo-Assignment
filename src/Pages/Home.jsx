import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../SupabaseClient'

export default function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                if (!window.location.hash.includes('access_token')) {
                    navigate('/login')
                }
            } else {
                setUser(session.user)
            }

        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user)

            } else {
                if (!window.location.hash.includes('access_token')) {
                    navigate('/login')
                }
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const BUCKET_NAME = 'avatars'
    const uploadAvatar = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return alert("Login required")

        const filePath = `${user.id}/${file.name}`

        const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true })

        if (error) return alert(error.message)

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const publicUrl = data.publicUrl

        await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
        })

        alert("Avatar uploaded successfully ✅")
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 bg-slate-900 font-sans selection:bg-indigo-500/30 relative overflow-y-auto w-full">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[100px]"></div>
                <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] bg-[length:32px_32px] opacity-70"></div>
            </div>

            <header className="w-full max-w-5xl relative z-10">
                <div className="h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight group-hover:text-slate-200 transition-colors">Infinex Tech</span>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="text-sm border border-slate-700/50 font-bold text-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-800/40 backdrop-blur-md"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="w-full max-w-5xl relative z-10 flex-1 flex flex-col justify-center mt-6 mb-10 items-center">
                <div className="flex flex-col mb-10 text-center items-center">
                    <h1 className="text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.15] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Welcome to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">Dashboard</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                        Manage your account details and access premium tools across the Infinex ecosystem.
                    </p>
                </div>

                <div className="w-full max-w-sm sm:max-w-md">
                    <div className="bg-slate-800/40 backdrop-blur-3xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-700/50 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(99,102,241,0.25)] flex flex-col items-center">

                        <div className="mb-6 relative group">
                            <label htmlFor="avatar-upload" className="block relative cursor-pointer">
                                <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[3px] shadow-lg shadow-indigo-500/30 overflow-hidden transform transition-transform group-hover:scale-105 duration-300">
                                    <div className="h-full w-full bg-slate-900 rounded-[1.8rem] overflow-hidden flex items-center justify-center relative">
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" />
                                        ) : (
                                            <span className="text-4xl font-bold text-white uppercase tracking-wider transition-opacity group-hover:opacity-50">
                                                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={uploadAvatar}
                            />
                            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-4 border-slate-900 pointer-events-none"></div>
                        </div>

                        <div className="text-center mb-10 w-full border-b border-slate-700/50 pb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                                {user?.user_metadata?.name || 'Registered User'}
                            </h2>
                            <p className="text-slate-400 font-medium text-sm">
                                {user?.email}
                            </p>
                            <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                {user?.user_metadata?.is_agency ? 'Agency Account' : 'Individual Account'}
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left mb-2 pl-1">
                                Profile Details
                            </h3>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Full Name
                                </span>
                                <span className="text-sm text-white font-medium">{user?.user_metadata?.name || 'N/A'}</span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Email
                                </span>
                                <span className="text-sm text-white font-medium truncate max-w-[160px]" title={user?.email}>{user?.email || 'N/A'}</span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    Phone
                                </span>
                                <span className="text-sm text-white font-medium">{user?.user_metadata?.phone || 'N/A'}</span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    Company
                                </span>
                                <span className="text-sm text-white font-medium">{user?.user_metadata?.company_name || 'N/A'}</span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Account Type
                                </span>
                                <span className="text-sm font-medium">
                                    {user?.user_metadata?.is_agency
                                        ? <span className="text-purple-400">Agency</span>
                                        : <span className="text-indigo-400">Individual</span>}
                                </span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Status
                                </span>
                                <span className="text-sm text-emerald-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Active
                                </span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl px-5 border border-slate-700/30 flex justify-between items-center hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                    User ID
                                </span>
                                <span className="text-xs text-slate-500 font-mono truncate max-w-[120px]" title={user?.id}>{user?.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}