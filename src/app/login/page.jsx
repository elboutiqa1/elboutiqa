"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, User, Loader2, Eye, EyeOff, ShoppingBag, Sparkles, Shield } from "lucide-react";
import logo from "@/app/assets/pictures/logo.webp"
import Image from "next/image";


export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Nom d'utilisateur ou mot de passe incorrect");
        return;
      }

      // JWT stocké dans un HttpOnly Cookie
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 5s ease-in-out infinite 1s; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>

      <main className="min-h-screen flex" dir="ltr">
        {/* ─── Left Branded Panel ─── */}
        <div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #334155 50%, #1E293B 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)",
              animationDelay: "1.5s",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
            style={{
              border: "1px solid rgba(250,204,21,0.3)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-10"
            style={{
              border: "1px solid rgba(250,204,21,0.2)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-12 max-w-md">
            {/* Logo icon */}
            <div className="animate-float mx-auto mb-8">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl bg-background"
              >
                <Image src={logo} alt="logo" width={50} height={50} className="h-auto w-auto" />
              </div>
            </div>

            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#FACC15", fontFamily: "var(--font-cairo), Cairo, sans-serif" }}
            >
              elboutiqa
            </h2>

            <p
              className="text-base leading-relaxed mb-10 opacity-70"
              style={{ color: "#CBD5E1", fontFamily: "var(--font-cairo), Cairo, sans-serif" }}
            >
              Tableau de bord de votre boutique en ligne
              <br />
              Gérez vos produits et commandes en toute simplicité
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-4 items-center">
              <div className="animate-float-delay flex items-center gap-3 rounded-2xl px-5 py-3"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(250,204,21,0.15)" }}>
                  <Shield size={18} style={{ color: "#FACC15" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "#E2E8F0" }}>Protection avancée et chiffrement complet</span>
              </div>

              <div className="animate-float flex items-center gap-3 rounded-2xl px-5 py-3"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(250,204,21,0.15)" }}>
                  <Sparkles size={18} style={{ color: "#FACC15" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "#E2E8F0" }}>Interface simple et rapide</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Login Form ─── */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-8 "
          style={{ background: "linear-gradient(180deg, #FFFDF5 0%, #FFFFFF 100%)" }}
        >
          <div className="w-full max-w-[500px] animate-slide-up border-2 rounded-xl border-border  px-5 py-3">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-2 bg-background">
              <div
                className="mx-auto  flex h-16 w-16 items-center justify-center rounded-2xl "
              >
                <Image src={logo} alt="logo" width={40} height={40} className="h-auto w-auto"/>
              </div>
              <h2 className="text-xl font-bold text-primary" >Elboutiqa</h2>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #334155, #1E293B)",
                  boxShadow: "0 8px 30px rgba(51,65,85,0.2)",
                }}
              >
                <LockKeyhole size={22} className="text-white" />
              </div>

              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#1E293B", fontFamily: "var(--font-cairo), Cairo, sans-serif" }}
              >
                Connexion
              </h1>

              <p
                className="text-sm"
                style={{ color: "#666666", fontFamily: "var(--font-cairo), Cairo, sans-serif" }}
              >
                Entrez vos identifiants pour accéder au tableau de bord
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-5 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm animate-shake"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "#DC2626",
                }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <span className="text-base">!</span>
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2.5 block text-sm font-semibold"
                  style={{ color: "#334155" }}
                >
                  Nom d'utilisateur
                </label>

                <div className="relative">
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300"
                    style={{
                      background: focusedField === "username" ? "rgba(250,204,21,0.15)" : "rgba(51,65,85,0.06)",
                    }}
                  >
                    <User
                      size={16}
                      style={{
                        color: focusedField === "username" ? "#EAB308" : "#94A3B8",
                        transition: "color 0.3s ease",
                      }}
                    />
                  </div>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Entrez votre nom d'utilisateur"
                    autoComplete="username"
                    disabled={loading}
                    required
                    className="w-full rounded-xl py-3.5 pl-14 pr-4 text-sm outline-none transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: "#FFFFFF",
                      border: focusedField === "username" ? "2px solid #FACC15" : "2px solid #EAEAEA",
                      color: "#333333",
                      boxShadow: focusedField === "username"
                        ? "0 0 0 4px rgba(250,204,21,0.1), 0 4px 20px rgba(250,204,21,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2.5 block text-sm font-semibold"
                  style={{ color: "#334155" }}
                >
                  Mot de passe
                </label>

                <div className="relative">
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300"
                    style={{
                      background: focusedField === "password" ? "rgba(250,204,21,0.15)" : "rgba(51,65,85,0.06)",
                    }}
                  >
                    <LockKeyhole
                      size={16}
                      style={{
                        color: focusedField === "password" ? "#EAB308" : "#94A3B8",
                        transition: "color 0.3s ease",
                      }}
                    />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Entrez votre mot de passe"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    className="w-full rounded-xl py-3.5 pl-14 pr-12 text-sm outline-none transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: "#FFFFFF",
                      border: focusedField === "password" ? "2px solid #FACC15" : "2px solid #EAEAEA",
                      color: "#333333",
                      boxShadow: focusedField === "password"
                        ? "0 0 0 4px rgba(250,204,21,0.1), 0 4px 20px rgba(250,204,21,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:opacity-70"
                    style={{
                      background: "rgba(51,65,85,0.06)",
                      color: "#94A3B8",
                    }}
                    aria-label={
                      showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 overflow-hidden group"
                style={{
                  background: loading
                    ? "#475569"
                    : "linear-gradient(135deg, #334155, #1E293B)",
                  color: "#FFFFFF",
                  boxShadow: loading
                    ? "none"
                    : "0 8px 30px rgba(51,65,85,0.3), 0 2px 8px rgba(51,65,85,0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "linear-gradient(135deg, #1E293B, #0F172A)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(51,65,85,0.4), 0 4px 12px rgba(51,65,85,0.25)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "linear-gradient(135deg, #334155, #1E293B)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(51,65,85,0.3), 0 2px 8px rgba(51,65,85,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {/* Yellow accent line at top */}
                <span
                  className="absolute top-0 left-0 w-full h-[2px]"
                  style={{ background: "linear-gradient(90deg, transparent, #FACC15, transparent)" }}
                />

                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Protégé par SSL • Elboutiqa © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}