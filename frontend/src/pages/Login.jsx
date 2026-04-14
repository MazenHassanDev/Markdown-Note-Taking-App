import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from '../api/axios'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await api.post('/auth/login/', { username, password })
            localStorage.setItem('token', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)
            navigate('/notes')
        } catch (err) {
            setError('Invalid username or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Google Font import via style tag */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #f0ede8;
                    border-radius: 10px;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-family: 'DM Sans', sans-serif;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                }
                .login-input::placeholder { color: rgba(255,255,255,0.2); }
                .login-input:focus {
                    border-color: rgba(212,183,141,0.5);
                    background: rgba(255,255,255,0.06);
                }

                .login-btn {
                    width: 100%;
                    background: #d4b78d;
                    color: #0a0a0f;
                    border: none;
                    border-radius: 10px;
                    padding: 13px;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    letter-spacing: 0.5px;
                    transition: background 0.2s, opacity 0.2s, transform 0.1s;
                }
                .login-btn:hover { background: #c9a87a; }
                .login-btn:active { transform: scale(0.99); }
                .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .glow-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .card { animation: fadeUp 0.5s ease both; }
                .card-row { animation: fadeUp 0.5s ease both; }
                .card-row:nth-child(1) { animation-delay: 0.05s; }
                .card-row:nth-child(2) { animation-delay: 0.10s; }
                .card-row:nth-child(3) { animation-delay: 0.15s; }
                .card-row:nth-child(4) { animation-delay: 0.20s; }
                .card-row:nth-child(5) { animation-delay: 0.25s; }
            `}</style>

            {/* Background orbs */}
            <div className="glow-orb" style={{
                width: 400, height: 400,
                background: 'rgba(212,183,141,0.07)',
                top: -100, right: -100,
            }} />
            <div className="glow-orb" style={{
                width: 300, height: 300,
                background: 'rgba(100,120,200,0.06)',
                bottom: -80, left: -60,
            }} />

            {/* Card */}
            <div className="card" style={{
                width: '100%',
                maxWidth: 420,
                margin: '0 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '48px 40px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            }}>
                {/* Logo mark */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
                    <div style={{
                        width: 32, height: 32,
                        background: '#d4b78d',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 4h10M3 8h7M3 12h5" stroke="#0a0a0f" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                        color: '#f0ede8',
                        fontSize: 18,
                        letterSpacing: '0.3px',
                    }}>
                        Notable
                    </span>
                </div>

                <div className="card-row" style={{ marginBottom: 8 }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        color: '#f0ede8',
                        fontSize: 28,
                        lineHeight: 1.2,
                    }}>
                        Welcome back
                    </h1>
                </div>

                <div className="card-row" style={{ marginBottom: 32 }}>
                    <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 14 }}>
                        Sign in to your notes
                    </p>
                </div>

                {error && (
                    <div className="card-row" style={{
                        background: 'rgba(220,80,80,0.1)',
                        border: '1px solid rgba(220,80,80,0.2)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        marginBottom: 20,
                        color: '#f08080',
                        fontSize: 13,
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="card-row">
                        <label style={{
                            display: 'block',
                            color: 'rgba(240,237,232,0.5)',
                            fontSize: 12,
                            fontWeight: 500,
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                        }}>
                            Username
                        </label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="card-row">
                        <label style={{
                            display: 'block',
                            color: 'rgba(240,237,232,0.5)',
                            fontSize: 12,
                            fontWeight: 500,
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                        }}>
                            Password
                        </label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="card-row" style={{ marginTop: 8 }}>
                        <button className="login-btn" type="submit" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="card-row" style={{
                    marginTop: 28,
                    paddingTop: 24,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'center',
                    color: 'rgba(240,237,232,0.35)',
                    fontSize: 13,
                }}>
                    No account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        style={{ color: '#d4b78d', cursor: 'pointer' }}
                    >
                        Register
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Login