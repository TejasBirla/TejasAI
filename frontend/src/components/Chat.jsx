import React, { useState, useRef, useEffect } from "react";
import { socket } from "../socket.js";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "light",
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isDark = theme === "dark";

  // ── Theme sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ── Socket
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.off("receiveMessage");
    socket.on("receiveMessage", (aiMessage) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: aiMessage }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // ── Persist messages
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // ── Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Send
  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", text: input.trim() }]);
    setIsTyping(true);
    socket.emit("sendMessage", input.trim());
    setInput("");
    inputRef.current?.focus();
    setTimeout(() => setIsTyping(false), 15000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const suggestions = [
    "What are his skills?",
    "Tell me about his projects",
    "How can I contact him?",
    "Is he open to work?",
  ];

  return (
    <div
      className={`h-screen flex flex-col transition-colors duration-500 ${isDark ? "bg-[#07070f] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* ── Navbar ── */}
      <nav
        className={`flex-shrink-0 flex items-center justify-between px-4 md:px-8 py-3.5 border-b backdrop-blur-xl z-50 transition-colors duration-500 ${isDark ? "bg-[#07070f]/90 border-white/[0.07]" : "bg-white/90 border-slate-200"}`}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110 ${isDark ? "border-white/15 bg-white/5 hover:bg-white/10 text-white/60" : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-500"}`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
          <span className="text-base font-black tracking-tight bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
            TejasAI
          </span>
        </div>

        {/* Center — status */}
        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span
            className={`text-xs font-medium ${isDark ? "text-white/40" : "text-slate-400"}`}
          >
            {isTyping ? "Thinking..." : "Online"}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className={`h-8 px-3 rounded-full flex items-center gap-1.5 text-xs font-medium border transition-all duration-200 hover:scale-105 cursor-pointer ${isDark ? "border-white/10 bg-white/5 hover:bg-red-500/15 hover:border-red-500/30 text-white/40 hover:text-red-400" : "border-slate-200 bg-slate-100 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-500"}`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer hover:scale-110 ${isDark ? "border-white/15 bg-white/5 hover:bg-white/10 text-white/60" : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-500"}`}
          >
            {isDark ? (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── Empty state ── */}
      {messages.length === 0 && !isTyping && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
          {/* Orbs */}
          <div
            className={`absolute top-[-60px] left-[-80px] w-[340px] h-[340px] rounded-full blur-[100px] pointer-events-none ${isDark ? "bg-violet-600/15" : "bg-violet-300/25"}`}
          />
          <div
            className={`absolute bottom-[-40px] right-[-60px] w-[280px] h-[280px] rounded-full blur-[90px] pointer-events-none ${isDark ? "bg-cyan-500/12" : "bg-cyan-300/20"}`}
          />

          <div className="relative z-10 text-center max-w-lg w-full">
            {/* Icon */}
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              <svg
                className="w-7 h-7 text-violet-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              How can I{" "}
              <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                assist you?
              </span>
            </h1>
            <p
              className={`text-sm mb-8 ${isDark ? "text-white/40" : "text-slate-400"}`}
            >
              Ask me anything about Tejas — skills, projects, experience, or how
              to reach him.
            </p>

            {/* Suggestion chips — always 2 per row */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 hover:scale-[1.02] cursor-pointer text-center ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:bg-violet-500/15 hover:border-violet-500/40 text-white/55 hover:text-violet-300"
                      : "border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-slate-500 hover:text-violet-600 shadow-sm"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleKeyDown={handleKeyDown}
              isTyping={isTyping}
              inputRef={inputRef}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      {(messages.length > 0 || isTyping) && (
        <>
          <div className="flex-1 overflow-y-auto px-3 md:px-4 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* AI avatar */}
                  {msg.role === "ai" && (
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mb-1"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      }}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm break-words ${
                      msg.role === "user"
                        ? "text-white rounded-br-sm"
                        : isDark
                          ? "bg-white/[0.06] border border-white/[0.09] text-white/90 rounded-bl-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #7c3aed, #06b6d4)",
                          }
                        : {}
                    }
                  >
                    {msg.role === "ai" ? (
                      <div
                        className={`prose prose-sm max-w-none
                          prose-p:my-1.5 prose-p:leading-relaxed
                          prose-ul:my-1.5 prose-ul:pl-4 prose-li:my-0.5
                          prose-ol:my-1.5 prose-ol:pl-4
                          prose-h2:text-base prose-h2:font-bold prose-h2:mt-1 prose-h2:mb-2
                          prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-1.5
                          prose-strong:font-semibold
                          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                          prose-hr:my-3
                          ${
                            isDark
                              ? "prose-invert prose-code:bg-white/10 prose-a:text-cyan-400 prose-headings:text-white"
                              : "prose-code:bg-slate-100 prose-a:text-violet-600 prose-headings:text-slate-800"
                          }`}
                      >
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`underline underline-offset-2 font-medium break-all ${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-violet-600 hover:text-violet-700"}`}
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="leading-relaxed">{msg.text}</span>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === "user" && (
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${isDark ? "bg-white/10 text-white/70" : "bg-slate-200 text-slate-600"}`}
                    >
                      U
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-end gap-2.5 justify-start">
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div
                    className={`rounded-2xl rounded-bl-sm px-5 py-3.5 flex items-center gap-1.5 ${isDark ? "bg-white/[0.06] border border-white/[0.09]" : "bg-white border border-slate-200 shadow-sm"}`}
                  >
                    {[0, 200, 400].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Sticky input bar ── */}
          <div
            className={`flex-shrink-0 border-t px-3 md:px-4 py-3 md:py-4 transition-colors duration-500 ${isDark ? "bg-[#07070f]/95 border-white/[0.07]" : "bg-white/95 border-slate-200"}`}
          >
            <div className="max-w-2xl mx-auto">
              <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleKeyDown={handleKeyDown}
                isTyping={isTyping}
                inputRef={inputRef}
                isDark={isDark}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Reusable Input Component ──────────────────────────────────────────────────
function ChatInput({
  input,
  setInput,
  handleSend,
  handleKeyDown,
  isTyping,
  inputRef,
  isDark,
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all duration-300 ${
        isDark
          ? "bg-white/[0.05] border-white/[0.10] focus-within:border-violet-500/50 focus-within:bg-white/[0.07]"
          : "bg-white border-slate-200 focus-within:border-violet-400 shadow-sm focus-within:shadow-md"
      }`}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about Tejas..."
        disabled={isTyping}
        className={`flex-1 bg-transparent text-sm outline-none placeholder:text-sm min-w-0 disabled:opacity-50 ${
          isDark
            ? "text-white placeholder-white/25"
            : "text-slate-800 placeholder-slate-400"
        }`}
      />

      <button
        onClick={handleSend}
        disabled={!input.trim() || isTyping}
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          background:
            input.trim() && !isTyping
              ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
              : isDark
                ? "rgba(255,255,255,0.08)"
                : "#e2e8f0",
        }}
      >
        <svg
          className={`w-3.5 h-3.5 ${input.trim() && !isTyping ? "text-white" : isDark ? "text-white/30" : "text-slate-400"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
  );
}
