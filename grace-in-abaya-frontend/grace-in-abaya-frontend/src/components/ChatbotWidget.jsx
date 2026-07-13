import { useState, useRef, useEffect } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function ChatbotWidget() {
  const { user }                    = useAuth()
  const [isOpen, setIsOpen]         = useState(false)
  const [history, setHistory]       = useState([
    { role: 'assistant', content: "As-salamu alaykum! I'm Noor, your personal fashion stylist at Grace in Abaya. How can I help you find the perfect outfit today? ✨" }
  ])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const bottomRef                   = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isOpen])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chatbot/chat', { history: newHistory })
      setHistory(h => [...h, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setHistory(h => [...h, { role: 'assistant', content: 'Sorry, I am having trouble right now. Please try again shortly.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat window */}
      {isOpen && (
        <div className="w-80 md:w-96 mb-4 bg-white rounded-sm shadow-2xl border border-gray-100 flex flex-col"
             style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-rose text-white px-4 py-3 flex items-center justify-between rounded-t-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-serif font-bold text-sm">N</div>
              <div>
                <p className="font-sans font-semibold text-sm">Noor</p>
                <p className="text-xs text-rose-light opacity-80">AI Fashion Stylist</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream/30">
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-sm text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-rose text-white'
                    : 'bg-white border border-gray-100 text-mink shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-sm text-sm text-mink-light shadow-sm">
                  <span className="animate-pulse">Noor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!user ? (
            <div className="p-4 border-t border-gray-100 text-center">
              <p className="text-xs text-mink-light">Please sign in to chat with Noor</p>
            </div>
          ) : (
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <textarea
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Ask about outfits, styles, occasions..."
                rows={1}
                className="flex-1 resize-none border border-gray-200 rounded-sm px-3 py-2 text-sm
                           focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose
                           max-h-20 overflow-y-auto"
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="bg-rose text-white p-2 rounded-sm hover:bg-rose-dark transition-colors disabled:opacity-50 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-rose text-white shadow-lg hover:bg-rose-dark
                   transition-all duration-200 flex items-center justify-center hover:scale-105">
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
