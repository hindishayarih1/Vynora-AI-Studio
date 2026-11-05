
import React, { useEffect, useState } from "react";
import {
  Sparkles, Image as ImageIcon, Video, WandSparkles,
  Clapperboard, CreditCard, LogOut, Menu, X,
  ShieldCheck, Zap, CircleUserRound, ArrowLeft
} from "lucide-react";
import { supabase, supabaseReady } from "./supabase";

const features = [
  { icon: ImageIcon, title: "AI Image", desc: "Create images from text prompts", tag: "Available" },
  { icon: Video, title: "AI Video", desc: "Generate cinematic videos", tag: "Coming next" },
  { icon: Clapperboard, title: "Video Editor", desc: "Edit clips and prepare exports", tag: "Coming next" },
  { icon: WandSparkles, title: "AI Tools", desc: "Your creative workspace", tag: "Coming next" }
];

export default function App() {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);
  const [walletMessage, setWalletMessage] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTool, setActiveTool] = useState("dashboard");
  const [prompt, setPrompt] = useState("");
  const [imageMessage, setImageMessage] = useState("");

  useEffect(() => {
    if (!supabaseReady) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, next) => setSession(next)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setBalance(null);
      return;
    }
    loadWallet();
  }, [session?.user?.id]);

  async function loadWallet() {
    if (!session?.user?.id) return;
    setWalletMessage("");
    const { data, error } = await supabase
      .from("credit_wallets")
      .select("balance")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      setWalletMessage("Wallet read failed. Check the credit_wallets SELECT RLS policy.");
      return;
    }
    if (!data) {
      setBalance(null);
      setWalletMessage("No wallet row found yet. Confirm the signup trigger ran.");
      return;
    }
    setBalance(data.balance);
  }

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          setMessage("Account created. Your wallet is loading.");
        } else {
          setMessage("Signup submitted. Check your email to confirm, then sign in.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session);
        setMessage("Signed in successfully.");
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setActiveTool("dashboard");
    setMessage("");
  }

  function handleGenerate() {
    if (!prompt.trim()) {
      setImageMessage("Please enter an image prompt first.");
      return;
    }
    setImageMessage(
      "Your prompt is ready! The image-generation API and secure backend still need to be connected. No image has been generated yet."
    );
  }

  if (!supabaseReady) {
    return (
      <main className="setup">
        <div className="setup-card">
          <div className="brand-mark"><Sparkles /></div>
          <h1>Vynora AI Studio</h1>
          <p>Supabase configuration is missing.</p>
          <p className="muted">Check your Vercel environment variables.</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="auth-shell">
        <div className="auth-glow glow-one"></div>
        <div className="auth-glow glow-two"></div>
        <section className="auth-card">
          <div className="brand">
            <div className="brand-mark"><Sparkles /></div>
            <div><strong>VYNORA</strong><span>AI STUDIO</span></div>
          </div>
          <div className="eyebrow">YOUR CREATIVE AI WORKSPACE</div>
          <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>
          <p className="subtext">Create, edit and bring your ideas to life.</p>
          <div className="auth-tabs">
            <button className={mode === "login" ? "active" : ""}
              onClick={() => { setMode("login"); setMessage(""); }}>Sign in</button>
            <button className={mode === "signup" ? "active" : ""}
              onClick={() => { setMode("signup"); setMessage(""); }}>Create account</button>
          </div>
          <form onSubmit={submitAuth}>
            <label>Email address</label>
            <input type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required />
            <label>Password</label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters" minLength="6" required />
            <button className="primary-btn" disabled={busy}>
              {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"} <span>→</span>
            </button>
          </form>
          {message && <div className="notice">{message}</div>}
          <div className="secure"><ShieldCheck size={15} /> Secured with Supabase Authentication</div>
        </section>
        <footer>VYNORA AI STUDIO <span>•</span> FOUNDATION BUILD 0.2</footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className={mobileMenu ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark"><Sparkles /></div>
          <div><strong>VYNORA</strong><span>AI STUDIO</span></div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}><X /></button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <button className={`nav-item ${activeTool === "dashboard" ? "selected" : ""}`}
          onClick={() => setActiveTool("dashboard")}><Zap size={18} /> Dashboard</button>
        <button className={`nav-item ${activeTool === "image" ? "selected" : ""}`}
          onClick={() => setActiveTool("image")}><ImageIcon size={18} /> AI Image</button>
        <button className="nav-item"><Video size={18} /> AI Video <small>SOON</small></button>
        <button className="nav-item"><Clapperboard size={18} /> Video Editor <small>SOON</small></button>
        <div className="sidebar-bottom">
          <div className="profile-icon"><CircleUserRound /></div>
          <div className="profile-copy"><strong>{session.user.email}</strong><span>Studio account</span></div>
          <button className="icon-btn" onClick={signOut} title="Sign out"><LogOut size={17} /></button>
        </div>
      </aside>

      {mobileMenu && <div className="scrim" onClick={() => setMobileMenu(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileMenu(true)}><Menu /></button>
          <div className="crumb">Workspace <span>/</span> {activeTool === "image" ? "AI Image" : "Dashboard"}</div>
          <div className="top-right">
            <div className="credits"><CreditCard size={16} /><span>{balance === null ? "—" : balance} credits</span></div>
            <div className="avatar">{(session.user.email || "V").slice(0, 1).toUpperCase()}</div>
          </div>
        </header>

        <div className="content">
          {activeTool === "dashboard" ? (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">CREATIVE WORKSPACE</div>
                  <h1>Welcome to Vynora.</h1>
                  <p>Everything you need to create something extraordinary.</p>
                </div>
                <div className="welcome-icon"><Sparkles /></div>
              </div>

              <section className="wallet-card">
                <div className="wallet-left">
                  <div className="wallet-icon"><Zap /></div>
                  <div>
                    <span className="wallet-label">YOUR CREDIT BALANCE</span>
                    <div className="wallet-number">{balance === null ? "—" : balance} <small>credits</small></div>
                    <p>{walletMessage || "Credits are linked to your account."}</p>
                  </div>
                </div>
                <button className="refresh-btn" onClick={loadWallet}>Refresh balance ↻</button>
              </section>

              {message && <div className="notice">{message}</div>}
              <div className="section-heading">
                <div><h2>Creative tools</h2><p>Choose a tool to start creating.</p></div>
                <span className="coming-pill">MORE TOOLS IN DEVELOPMENT</span>
              </div>
              <div className="feature-grid">
                {features.map(({ icon: Icon, title, desc, tag }) => (
                  <article className="feature-card" key={title}>
                    <div className="feature-icon"><Icon /></div>
                    <span className="feature-tag">{tag}</span>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <button disabled={title !== "AI Image"}
                      onClick={() => setActiveTool("image")}>
                      {title === "AI Image" ? "Open tool" : "Coming soon"} <span>↗</span>
                    </button>
                  </article>
                ))}
              </div>
              <section className="roadmap">
                <div>
                  <div className="eyebrow">BUILD ROADMAP</div>
                  <h2>Made for creators. Built to scale.</h2>
                  <p>Authentication and wallet foundation are connected first. AI generation, editing and export will be integrated in later stages.</p>
                </div>
                <div className="quality">
                  <strong>1080p</strong><strong>2K</strong><strong>4K</strong>
                  <span>Planned export targets — actual 4K output requires a compatible provider and processing pipeline.</span>
                </div>
              </section>
            </>
          ) : (
            <section style={{ maxWidth: "850px", margin: "0 auto" }}>
              <button className="refresh-btn" onClick={() => setActiveTool("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <div className="eyebrow" style={{ marginTop: "25px" }}>VYNORA CREATIVE TOOLS</div>
              <h1>AI Image Generator</h1>
              <p>Describe the image you want to create.</p>

              <div style={{ background: "var(--card, #171923)", padding: "22px", borderRadius: "16px", marginTop: "22px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>Your image prompt</label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Example: A beautiful mountain landscape at sunrise, cinematic lighting, ultra realistic..."
                  rows={5}
                  style={{ width: "100%", padding: "15px", borderRadius: "10px", background: "#10131d", color: "white", border: "1px solid #45485a", fontSize: "16px", boxSizing: "border-box", resize: "vertical" }}
                />
                <button className="primary-btn" onClick={handleGenerate} style={{ marginTop: "15px" }}>
                  <Sparkles size={17} /> Generate Image
                </button>
                {imageMessage && (
                  <div className="notice" style={{ marginTop: "15px" }}>{imageMessage}</div>
                )}
              </div>

              <div style={{ marginTop: "22px", padding: "35px 20px", border: "1px dashed #555b70", borderRadius: "16px", textAlign: "center" }}>
                <ImageIcon size={42} />
                <h3>Image Preview</h3>
                <p>Your generated image will appear here after the image API is connected.</p>
                <span style={{ fontSize: "12px", opacity: 0.7 }}>Generation is not connected yet.</span>
              </div>
            </section>
          )}

          <div className="footnote">Vynora AI Studio · Foundation 0.2 · Supabase connected</div>
        </div>
      </main>
    </div>
  );
}
