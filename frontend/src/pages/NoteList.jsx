import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from '../api/axios'

function NoteList() {
    const [notes, setNotes] = useState([])
    const [filteredNotes, setFilteredNotes] = useState([])
    const [search, setSearch] = useState('')
    const [selectedNote, setSelectedNote] = useState(null)
    const [html, setHtml] = useState('')
    const [grammar, setGrammar] = useState(null)
    const [mode, setMode] = useState('view') // 'view' | 'edit' | 'new'
    const [editTitle, setEditTitle] = useState('')
    const [editContent, setEditContent] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchNotes()
    }, [])

    useEffect(() => {
        if (!search.trim()) {
            setFilteredNotes(notes)
        } else {
            const q = search.toLowerCase()
            setFilteredNotes(notes.filter(n =>
                n.title.toLowerCase().includes(q)
            ))
        }
    }, [search, notes])

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes/')
            setNotes(response.data)
            setFilteredNotes(response.data)
        } catch (err) {
            setError('Failed to fetch notes.')
        }
    }

    const selectNote = async (note) => {
        setSelectedNote(note)
        setGrammar(null)
        setMode('view')
        setError('')
        try {
            const response = await api.get(`/notes/${note.id}/render/`)
            setHtml(response.data.html)
        } catch (err) {
            setError('Failed to render note.')
        }
    }

    const openEdit = async () => {
        try {
            const response = await api.get(`/notes/${selectedNote.id}/`)
            setEditTitle(response.data.title)
            setEditContent(response.data.content)
            setMode('edit')
            setGrammar(null)
        } catch (err) {
            setError('Failed to load note.')
        }
    }

    const openNew = () => {
        setSelectedNote(null)
        setEditTitle('')
        setEditContent('')
        setMode('new')
        setGrammar(null)
        setHtml('')
    }

    const handleSave = async () => {
        setSaving(true)
        setError('')
        try {
            if (mode === 'new') {
                await api.post('/notes/save/', { title: editTitle, content: editContent })
                await fetchNotes()
                setMode('view')
                setSelectedNote(null)
                setHtml('')
            } else {
                await api.put(`/notes/${selectedNote.id}/edit/`, { title: editTitle, content: editContent })
                await fetchNotes()
                const updated = { ...selectedNote, title: editTitle, content: editContent }
                setSelectedNote(updated)
                const response = await api.get(`/notes/${selectedNote.id}/render/`)
                setHtml(response.data.html)
                setMode('view')
            }
        } catch (err) {
            setError('Failed to save note.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedNote) return
        try {
            await api.delete(`/notes/${selectedNote.id}/delete/`)
            setSelectedNote(null)
            setHtml('')
            setMode('view')
            await fetchNotes()
        } catch (err) {
            setError('Failed to delete note.')
        }
    }

    const handleGrammarCheck = async () => {
        setGrammar(null)
        try {
            const response = await api.get(`/notes/${selectedNote.id}/grammar/`)
            setGrammar(response.data)
        } catch (err) {
            setError('Failed to check grammar.')
        }
    }

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout/', { refresh: localStorage.getItem('refresh') })
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            navigate('/login')
        } catch (err) {
            setError('Failed to logout.')
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    return (
        <div style={{
            height: '100vh',
            background: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
            color: '#f0ede8',
            display: 'flex',
            overflow: 'hidden',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .search-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    padding: 8px 12px 8px 32px;
                    font-size: 13px;
                    color: #f0ede8;
                    font-family: 'DM Sans', sans-serif;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .search-input::placeholder { color: rgba(240,237,232,0.25); }
                .search-input:focus { border-color: rgba(212,183,141,0.4); }

                .note-item {
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 2px;
                    cursor: pointer;
                    transition: background 0.15s;
                    border: 1px solid transparent;
                }
                .note-item:hover { background: rgba(255,255,255,0.04); }
                .note-item.active {
                    background: rgba(212,183,141,0.08);
                    border-color: rgba(212,183,141,0.2);
                }

                .icon-btn {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 7px;
                    padding: 7px 14px;
                    font-size: 12px;
                    color: rgba(240,237,232,0.5);
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: color 0.2s, border-color 0.2s;
                }
                .icon-btn:hover { color: #f0ede8; border-color: rgba(255,255,255,0.2); }

                .danger-btn {
                    background: transparent;
                    border: 1px solid rgba(220,80,80,0.2);
                    border-radius: 7px;
                    padding: 7px 14px;
                    font-size: 12px;
                    color: rgba(240,100,100,0.55);
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: color 0.2s, border-color 0.2s;
                }
                .danger-btn:hover { color: #f08080; border-color: rgba(220,80,80,0.4); }

                .save-btn {
                    background: #d4b78d;
                    border: none;
                    border-radius: 7px;
                    padding: 7px 18px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #0a0a0f;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .save-btn:hover { background: #c9a87a; }
                .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .new-btn {
                    width: 100%;
                    background: #d4b78d;
                    border: none;
                    border-radius: 7px;
                    padding: 9px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #0a0a0f;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: background 0.2s;
                }
                .new-btn:hover { background: #c9a87a; }

                .edit-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-size: 14px;
                    color: #f0ede8;
                    font-family: 'DM Sans', sans-serif;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .edit-input:focus { border-color: rgba(212,183,141,0.4); }

                .edit-textarea {
                    width: 100%;
                    flex: 1;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 8px;
                    padding: 14px;
                    font-size: 14px;
                    color: #f0ede8;
                    font-family: 'DM Sans', sans-serif;
                    outline: none;
                    resize: none;
                    line-height: 1.7;
                    transition: border-color 0.2s;
                }
                .edit-textarea:focus { border-color: rgba(212,183,141,0.4); }

                .rendered-content h1, .rendered-content h2, .rendered-content h3 {
                    font-family: 'Playfair Display', serif;
                    color: #f0ede8;
                    margin-bottom: 12px;
                    margin-top: 24px;
                }
                .rendered-content h1 { font-size: 22px; }
                .rendered-content h2 { font-size: 18px; }
                .rendered-content h3 { font-size: 15px; }
                .rendered-content p { margin-bottom: 12px; }
                .rendered-content ul, .rendered-content ol { padding-left: 20px; margin-bottom: 12px; }
                .rendered-content li { margin-bottom: 4px; }
                .rendered-content code {
                    background: rgba(255,255,255,0.06);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-family: monospace;
                }
                .rendered-content pre {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 8px;
                    padding: 14px;
                    overflow-x: auto;
                    margin-bottom: 12px;
                }

                .grammar-issue {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 8px;
                    padding: 12px 14px;
                    margin-bottom: 8px;
                }

                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            `}</style>

            {/* ── Sidebar ── */}
            <div style={{
                width: 260,
                minWidth: 260,
                background: 'rgba(255,255,255,0.02)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}>
                {/* Logo + New button */}
                <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{
                            width: 26, height: 26, background: '#d4b78d',
                            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M3 4h10M3 8h7M3 12h5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f0ede8', fontSize: 15 }}>
                            notable
                        </span>
                    </div>
                    <button className="new-btn" onClick={openNew} style={{ position: 'relative', zIndex: 1 }}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v10M1 6h10" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        New note
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{
                        position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', opacity: 0.3,
                    }}>
                        <circle cx="6.5" cy="6.5" r="5" stroke="#f0ede8" strokeWidth="1.5"/>
                        <path d="M10 10l3.5 3.5" stroke="#f0ede8" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search notes…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Notes */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {filteredNotes.length === 0 && (
                        <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.25)', textAlign: 'center', paddingTop: 24 }}>
                            {search ? 'No results' : 'No notes yet'}
                        </p>
                    )}
                    {filteredNotes.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                            onClick={() => selectNote(note)}
                        >
                            <div style={{
                                fontSize: 13, fontWeight: 600, marginBottom: 4,
                                color: selectedNote?.id === note.id ? '#f0ede8' : 'rgba(240,237,232,0.65)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {note.title || 'Untitled'}
                            </div>
                            <div style={{
                                fontSize: 11, color: 'rgba(240,237,232,0.3)', marginBottom: 6,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {note.content}
                            </div>
                            <div style={{
                                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px',
                                color: selectedNote?.id === note.id ? 'rgba(212,183,141,0.6)' : 'rgba(240,237,232,0.2)',
                            }}>
                                {formatDate(note.created_at)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sign out */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span onClick={handleLogout} style={{ fontSize: 12, color: 'rgba(240,237,232,0.3)', cursor: 'pointer' }}>
                        Sign out
                    </span>
                </div>
            </div>

            {/* ── Main panel ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Empty state */}
            {!selectedNote && mode !== 'new' && (
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 12,
                }} onClick={openNew}>
                    <div style={{
                        width: 48, height: 48, background: 'rgba(212,183,141,0.08)',
                        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                    }} onClick={openNew}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="#d4b78d" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#f0ede8' }}>
                        Select a note
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.3)' }}>
                        Or create a new one
                    </p>
                </div>
            )}

                {/* View mode */}
                {selectedNote && mode === 'view' && (
                    <>
                        <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 22, fontWeight: 700, color: '#f0ede8', marginBottom: 6,
                            }}>
                                {selectedNote.title || 'Untitled'}
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                {formatDate(selectedNote.created_at)}
                            </div>
                        </div>

                        <div
                            className="rendered-content"
                            style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', fontSize: 14, lineHeight: 1.8, color: 'rgba(240,237,232,0.75)' }}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />

                        {grammar && (
                            <div style={{ padding: '0 32px 16px', maxHeight: 220, overflowY: 'auto' }}>
                                <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', marginBottom: 10 }}>{grammar.overall}</p>
                                {grammar.issues.map((issue, i) => (
                                    <div key={i} className="grammar-issue">
                                        <p style={{ fontSize: 12, color: '#f08080', marginBottom: 4 }}>{issue.error}</p>
                                        <p style={{ fontSize: 12, color: '#d4b78d', marginBottom: 4 }}>→ {issue.suggestion}</p>
                                        <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.35)' }}>{issue.explanation}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ padding: '12px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                            <button className="icon-btn" onClick={handleGrammarCheck}>Check grammar</button>
                            <button className="icon-btn" onClick={openEdit}>Edit</button>
                            <button className="danger-btn" onClick={handleDelete}>Delete</button>
                        </div>
                    </>
                )}

                {/* Edit / New mode */}
                {(mode === 'edit' || mode === 'new') && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', gap: 12, overflow: 'hidden' }}>
                        <input
                            className="edit-input"
                            type="text"
                            placeholder="Note title…"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                            className="edit-textarea"
                            placeholder="Write your note in markdown…"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="save-btn" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button className="icon-btn" onClick={() => {
                                setMode('view')
                                if (!selectedNote) { setEditTitle(''); setEditContent('') }
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <p style={{ fontSize: 12, color: '#f08080', padding: '8px 32px' }}>{error}</p>
                )}
            </div>
        </div>
    )
}

export default NoteList