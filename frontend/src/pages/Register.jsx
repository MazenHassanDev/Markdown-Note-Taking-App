import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from '../api/axios'

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await api.post('/auth/register/', { username, email, password })
            navigate('/login')
        } catch (err) {
            setError('Could not create account. Please check your details.')
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .reg-input {
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
                .reg-input::placeholder { color: rgba(255,255,255,0.2); }
                .reg-input:focus {
                    border-color: rgba(212,183,141,0.5);
                    background: rgba(255,255,255,0.06);
                }

                .reg-btn {
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
                .reg-btn:hover { background: #c9a87a; }
                .reg-btn:active { transform: scale(0.99); }
                .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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
                .reg-card { animation: fadeUp 0.5s ease both; }
                .reg-row { animation: fadeUp 0.5s ease both; }
                .reg-row:nth-child(1) { animation-delay: 0.05s; }
                .reg-row:nth-child(2) { animation-delay: 0.10s; }
                .reg-row:nth-child(3) { animation-delay: 0.15s; }
                .reg-row:nth-child(4) { animation-delay: 0.20s; }
                .reg-row:nth-child(5) { animation-delay: 0.25s; }
                .reg-row:nth-child(6) { animation-delay: 0.30s; }
            `}</style>

            {/* Background orbs */}
            <div className="glow-orb" style={{
                width: 400, height: 400,
                background: 'rgba(212,183,141,0.07)',
                top: -100, left: -100,
            }} />
            <div className="glow-orb" style={{
                width: 300, height: 300,
                background: 'rgba(100,120,200,0.06)',
                bottom: -80, right: -60,
            }} />

            {/* Card */}
            <div className="reg-card" style={{
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
                        notable
                    </span>
                </div>

                <div className="reg-row" style={{ marginBottom: 8 }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        color: '#f0ede8',
                        fontSize: 28,
                        lineHeight: 1.2,
                    }}>
                        Create account
                    </h1>
                </div>

                <div className="reg-row" style={{ marginBottom: 32 }}>
                    <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 14 }}>
                        Start writing. It's free.
                    </p>
                </div>

                {error && (
                    <div className="reg-row" style={{
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
                    <div className="reg-row">
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
                            className="reg-input"
                            type="text"
                            placeholder="choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="reg-row">
                        <label style={{
                            display: 'block',
                            color: 'rgba(240,237,232,0.5)',
                            fontSize: 12,
                            fontWeight: 500,
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                        }}>
                            Email
                        </label>
                        <input
                            className="reg-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="reg-row">
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
                            className="reg-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="reg-row" style={{ marginTop: 8 }}>
                        <button className="reg-btn" type="submit" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </div>
                </form>

                <div className="reg-row" style={{
                    marginTop: 28,
                    paddingTop: 24,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'center',
                    color: 'rgba(240,237,232,0.35)',
                    fontSize: 13,
                }}>
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        style={{ color: '#d4b78d', cursor: 'pointer' }}
                    >
                        Sign in
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Register