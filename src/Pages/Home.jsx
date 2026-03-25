import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../SupabaseClient'

export default function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                navigate('/login')
            } else {
                setUser(session.user)
            }
            setLoading(false)
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login')
            } else {
                setUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const uploadAvatar = async (event) => {
        try {
            setUploading(true)
            
            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`

            // Upload the file to the "avatars" bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file)

            if (uploadError) {
                throw uploadError
            }

            // Get the public URL for the newly uploaded avatar
            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
            
            // Update the user's auth metadata to use the new avatar URL
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: data.publicUrl }
            })

            if (updateError) {
                throw updateError
            }

            // Refresh the active session to display the new image instantly
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setUser(session.user)
            }
            
        } catch (error) {
            alert('Error uploading avatar: ' + error.message + '\n\nNote: Please ensure you have created an "avatars" bucket in your Supabase Storage settings with public access enabled.')
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="h-8 w-8 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 bg-slate-900 font-sans selection:bg-indigo-500/30 relative overflow-y-auto w-full">
            {/* Abstract background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[100px]"></div>
                <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[100px]"></div>
                {/* Grid Pattern */}
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
                        
                        {/* Centered User Avatar with Upload functionality */}
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
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {uploading ? (
                                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
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
                                disabled={uploading}
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

                        {/* Vertical Profile Info Stack */}
                        <div className="w-full space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left mb-2 pl-1">
                                Details
                            </h3>

                            <div className="w-full bg-slate-900/60 rounded-2xl p-4.5 px-5 border border-slate-700/30 flex justify-between items-center group hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400">Phone</span>
                                <span className="text-sm text-white font-medium">{user?.user_metadata?.phone || 'N/A'}</span>
                            </div>

                            {user?.user_metadata?.is_agency && (
                                <div className="w-full bg-slate-900/60 rounded-2xl p-4.5 px-5 border border-slate-700/30 flex justify-between items-center group hover:border-indigo-500/30 transition-colors py-4">
                                    <span className="text-sm font-semibold text-slate-400">Company</span>
                                    <span className="text-sm text-white font-medium">{user?.user_metadata?.company_name || 'N/A'}</span>
                                </div>
                            )}

                            <div className="w-full bg-slate-900/60 rounded-2xl p-4.5 px-5 border border-slate-700/30 flex justify-between items-center group hover:border-indigo-500/30 transition-colors mt-6 py-4">
                                <span className="text-sm font-semibold text-slate-400">Status</span>
                                <span className="text-sm text-emerald-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Active
                                </span>
                            </div>

                            <div className="w-full bg-slate-900/60 rounded-2xl p-4.5 px-5 border border-slate-700/30 flex justify-between items-center group hover:border-indigo-500/30 transition-colors py-4">
                                <span className="text-sm font-semibold text-slate-400">User ID</span>
                                <span className="text-xs text-slate-500 font-mono truncate max-w-[120px]" title={user?.id}>{user?.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}