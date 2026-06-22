import "./App.css"
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

function App() {

  const editorRef = useRef(null)
  const [ username, setUsername ] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [ users, setUsers ] = useState([])
  const [ language, setLanguage ] = useState("javascript")
  const [ usernameInput, setUsernameInput ] = useState("")

  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ ydoc ])


  const handleMount = (editor) => {
    editorRef.current = editor

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([ editorRef.current ]),
    )
  }




  const handleJoin = (e) => {
    e.preventDefault()
    if (usernameInput.trim()) {
      setUsername(usernameInput)
      window.history.pushState({}, "", "?username=" + usernameInput)
    }
  }

  useEffect(() => {

    console.log(username)

    if (username) {

      const provider = new SocketIOProvider("/", "monaco", ydoc, {
        autoConnect: true,
      })

      provider.awareness.setLocalStateField("user", { username })


      const states = Array.from(provider.awareness.getStates().values())

      console.log(states)

      setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values())
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))
      })

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)


      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [
    username
  ])

  if (!username) {
    return (
      <main className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">CodeShare</h1>
            <p className="text-gray-400">Real-time collaborative code editor</p>
          </div>
          
          <form
            onSubmit={handleJoin}
            className="bg-slate-800 rounded-xl shadow-2xl p-8 space-y-6 border border-slate-700">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!usernameInput.trim()}
            >
              Join Session
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">CodeShare</h1>
            <p className="text-sm text-gray-400">Editing as <span className="text-blue-400 font-semibold">{username}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={() => {
                setUsername("")
                window.history.pushState({}, "", "/")
              }}
              className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 hover:text-white border border-slate-600 hover:bg-slate-600 transition"
            >
              Leave
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 rounded-xl shadow-lg border border-slate-700 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
              Active Users ({users.length})
            </h2>
          </div>
          <ul className="flex-1 overflow-y-auto p-4 space-y-2">
            {users.length === 0 ? (
              <li className="text-gray-400 text-sm py-8 text-center">No users connected</li>
            ) : (
              users.map((user, index) => (
                <li
                  key={index}
                  className={`px-4 py-3 rounded-lg border transition ${
                    user.username === username
                      ? "bg-blue-600 text-white border-blue-500 font-semibold"
                      : "bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                    {user.username}
                    {user.username === username && <span className="text-xs ml-auto">(You)</span>}
                  </span>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Editor Section */}
        <section className="flex-1 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              defaultValue="// Start coding together!\n// Your code will be shared in real-time with all connected users."
              theme="vs-dark"
              onMount={handleMount}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
