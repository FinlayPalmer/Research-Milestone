
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Trash2,
  User,
  Server,
  Wifi,
  WifiOff,
} from "lucide-react";
import "../AIChat.css";

const API_URL = "http://localhost:8000";

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your mock AI assistant. Your messages are sent to a Python FastAPI backend, which returns simulated responses.",
};

export default function AIChat() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(null);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const requestController = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkConnection() {
      try {
        const response = await fetch(`${API_URL}/health`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Health check failed");
        }

        setConnected(true);
      } catch (err) {
        if (!controller.signal.aborted) {
          setConnected(false);
        }
      }
    }

    checkConnection();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => requestController.current?.abort();
  }, []);

  async function sendMessage(event) {
    event.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    const controller = new AbortController();
    requestController.current = controller;

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
        },
      ]);

      setConnected(true);
    } catch (err) {
      if (!controller.signal.aborted) {
        setConnected(false);
        setError(
          "Unable to reach the Python backend. Make sure FastAPI is running."
        );
      }
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setLoading(false);
      }
    }
  }

  function clearChat() {
    requestController.current?.abort();
    requestController.current = null;
    setLoading(false);
    setMessages([welcomeMessage]);
    setInput("");
    setError("");
  }

  return (
    <div className="ai-chat">
      <header className="ai-chat-header">
        <div className="ai-chat-heading">
          <div className="ai-chat-logo">
            <Bot size={24} />
          </div>

          <div>
            <h2>AI Assistant</h2>
            <p>Python FastAPI · Mock Model</p>
          </div>
        </div>

        <button
          className="ai-clear-button"
          onClick={clearChat}
          type="button"
        >
          <Trash2 size={16} />
          Clear Chat
        </button>
      </header>

      <div className="ai-status-bar">
        <span
          className={
            connected === true
              ? "ai-status-online"
              : "ai-status-offline"
          }
        >
          {connected === true ? (
            <Wifi size={15} />
          ) : (
            <WifiOff size={15} />
          )}

          {connected === null
            ? "Checking connection..."
            : connected
              ? "Backend connected"
              : "Backend disconnected"}
        </span>

        <span className="ai-mode">
          <Server size={14} />
          Mock Mode
        </span>
      </div>

      <div className="ai-messages" aria-live="polite">
        {messages.map((message) => (
          <div
            className={`ai-message ${message.role}`}
            key={message.id}
          >
            <div className="ai-avatar">
              {message.role === "assistant" ? (
                <Bot size={18} />
              ) : (
                <User size={18} />
              )}
            </div>

            <div className="ai-bubble">
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-message assistant">
            <div className="ai-avatar">
              <Bot size={18} />
            </div>
            <div className="ai-bubble ai-thinking">
              Python is processing...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="ai-error" role="alert">
          {error}
        </div>
      )}

      <form className="ai-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Send a message to Python..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={4000}
          disabled={loading}
          aria-label="Chat message"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <Send size={19} />
        </button>
      </form>
    </div>
  );
}
