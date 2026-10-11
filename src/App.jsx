
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AIChat from "./components/AIChat";
import Store from "./components/Store";
import {
  signup,
  login,
  loginWithGoogle,
  logout,
} from "./auth";
import {
  ShoppingBag,
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ShieldCheck,
  UserCircle,
  Bot,
} from "lucide-react";
import "./App.css";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Store", icon: ShoppingBag },
  { name: "AI Chat", icon: Bot },
  { name: "Users", icon: Users },
  { name: "Activity", icon: Activity },
  { name: "Settings", icon: Settings },
];

function getErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Please choose a stronger password.";
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Please allow popups for this website.";
    case "auth/unauthorized-domain":
      return "Add this domain in Firebase Authentication settings.";
    case "auth/operation-not-allowed":
      return "Enable this sign-in provider in Firebase Console.";
    case "auth/account-exists-with-different-credential":
      return "This email already uses another sign-in method.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      setPassword("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setBusy(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">F</div>
        <h1>{isSignup ? "Create an account" : "Welcome back"}</h1>
        <p className="auth-subtitle">
          {isSignup
            ? "Get started with your new workspace"
            : "Sign in to access your workspace"}
        </p>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete={
              isSignup ? "new-password" : "current-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={isSignup ? 6 : undefined}
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={busy}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.87 46.98 24.55z"/>
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </main>
  );
}

function Dashboard({ user }) {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const displayName =
    user.displayName || user.email?.split("@")[0] || "User";

  async function handleLogout() {
    setError("");
    try {
      await logout();
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  const stats = [
    { label: "Total Users", value: "1", change: "Demo" },
    { label: "Active Sessions", value: "1", change: "Demo" },
    { label: "Total Projects", value: "0", change: "Demo" },
    { label: "Storage Used", value: "0 MB", change: "Demo" },
  ];

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">F</div>
          <span>FirebaseApp</span>
          <button
            className="mobile-close"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {activePage === item.name && (
                  <ChevronRight size={16} className="nav-arrow" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <strong>{displayName}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <div className="breadcrumb">
                Workspace / {activePage}
              </div>
              <h2>{activePage}</h2>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setActivePage("Activity")}
            >
              <Bell size={20} />
            </button>
            <div className="topbar-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {error && <div className="error" role="alert">{error}</div>}
          {activePage === "Store" && <Store />}
          {activePage === "AI Chat" && <AIChat />}
          {activePage === "Overview" && (
            <>
              <div className="welcome-banner">
                <div>
                  <span className="welcome-tag">YOUR WORKSPACE</span>
                  <h1>Welcome back, {displayName}!</h1>
                  <p>
                    Here's an overview of your workspace.
                    You're all set to get started.
                  </p>
                </div>
                <ShieldCheck size={72} className="banner-icon" />
              </div>

              <div className="section-heading">
                <h3>Overview</h3>
                <span>Demo statistics</span>
              </div>

              <div className="stats-grid">
                {stats.map((stat) => (
                  <div className="stat-card" key={stat.label}>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                    <span className="stat-change">{stat.change}</span>
                  </div>
                ))}
              </div>

              <div className="content-grid">
                <div className="panel">
                  <h3>Getting Started</h3>
                  <p className="muted">
                    Your dashboard is ready to customize.
                  </p>
                  <div className="setup-list">
                    <div>
                      <span className="setup-check">✓</span>
                      Firebase configured
                    </div>
                    <div>
                      <span className="setup-check">✓</span>
                      Authentication connected
                    </div>
                    <div>
                      <span className="setup-check">✓</span>
                      Dashboard created
                    </div>
                    <div>
                      <span className="setup-pending">4</span>
                      Connect Firestore data
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <h3>Account Details</h3>
                  <div className="account-detail">
                    <span>Email</span>
                    <strong>{user.email || "Not available"}</strong>
                  </div>
                  <div className="account-detail">
                    <span>Account ID</span>
                    <strong className="uid">{user.uid}</strong>
                  </div>
                  <div className="account-detail">
                    <span>Email verified</span>
                    <strong>{user.emailVerified ? "Yes" : "No"}</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "Users" && (
            <div className="panel">
              <h3>My Profile</h3>
              <p className="muted">
                Your account information from Firebase Authentication.
              </p>
              <div className="profile-card">
                <UserCircle size={48} />
                <div>
                  <h3>{displayName}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <p className="muted">
                A complete user directory can be added later
                with Firestore and appropriate access controls.
              </p>
            </div>
          )}

          {activePage === "Activity" && (
            <div className="panel">
              <h3>Activity</h3>
              <p className="muted">
                Your activity feed will appear here after
                we connect Firestore.
              </p>
            </div>
          )}

          {activePage === "Settings" && (
            <div className="panel">
              <h3>Account Settings</h3>
              <p className="muted">
                Manage your workspace account.
              </p>
              <div className="account-detail">
                <span>Email</span>
                <strong>{user.email || "Not available"}</strong>
              </div>
              <div className="account-detail">
                <span>Sign-in providers</span>
                <strong>
                  {user.providerData
                    .map((p) => p.providerId)
                    .join(", ") || "Not available"}
                </strong>
              </div>
              <button
                className="settings-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} /> Sign out
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading workspace...</div>;
  }

  if (authError) {
    return <div className="loading-screen">{authError}</div>;
  }

  return user ? <Dashboard user={user} /> : <AuthScreen />;
}

export default App;
