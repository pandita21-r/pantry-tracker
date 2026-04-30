import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Leaf, Eye, EyeOff, ShoppingCart, Clock, TrendingDown } from "lucide-react";

export default function LoginView() {
  const { login } = useApp();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">PantryTrack</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-white text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Smarter kitchen.<br />Zero food waste.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Track every item in your pantry, get alerts before things expire, and simplify your grocery trips — all in real time.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Clock, title: "Real-time expiration alerts", desc: "Know exactly when food is about to expire" },
              { icon: TrendingDown, title: "Reduce food waste", desc: "Use what you have before it goes bad" },
              { icon: ShoppingCart, title: "Smart shopping lists", desc: "Auto-generate lists based on what you're low on" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold">{title}</p>
                  <p className="text-white/70 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">Trusted by 12,000+ households worldwide</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">PantryTrack</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to manage your pantry inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-xl" data-testid="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="button-login"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground bg-muted/60 rounded-lg px-4 py-2.5 inline-block">
                Demo: use any email &amp; password to sign in
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
