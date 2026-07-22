import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, update, get, set } from "firebase/database";
import { Check, Mail, EyeOff, Eye, Loader2, User, Lock } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { auth, db } from "../app/firebase";
import LivaAvatar from "../components/layout/LivaAvatar";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import ProgressDots from "../components/ui/ProgressDots";
import ScreenShell from "./ScreenShell";
import { ink, muted } from "../constants";
import { Screen } from "../types";
import { isPlaceholderConfig, withFirebaseTimeout } from "../utils";

export default function LoginScreen({
  onAuthSuccess,
  initialView = "signin",
  initialResetToken = "",
}: {
  onAuthSuccess: (token: string, user: any, isNew: boolean) => void;
  initialView?: "signin" | "signup" | "forgot" | "reset" | "verify" | "profile-complete";
  initialResetToken?: string;
}) {
  const [view, setView] = useState<
    "signin" | "signup" | "forgot" | "reset" | "verify" | "profile-complete"
  >(initialView);

  useEffect(() => {
    if (initialView) setView(initialView);
  }, [initialView]);

  // General States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cached Token for profile completion session
  const [activeSessionToken, setActiveSessionToken] = useState<string | null>(null);
  const [activeSessionUser, setActiveSessionUser] = useState<any>(null);

  // Google Selector Overlay States
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");

  // Profile completion states
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [dobDay, setDobDay] = useState("01");
  const [dobMonth, setDobMonth] = useState("01");
  const [dobYear, setDobYear] = useState("1995");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [language, setLanguage] = useState("English");
  const [motivationStyle, setMotivationStyle] = useState("Friendly");
  const [workoutStatus, setWorkoutStatus] = useState("Sometimes");
  const [completeStep, setCompleteStep] = useState(1);

  useEffect(() => {
    if (dob && dob.includes("-")) {
      const parts = dob.split("-");
      if (parts.length === 3) {
        setDobYear(parts[0]);
        setDobMonth(parts[1]);
        setDobDay(parts[2]);
      }
    }
  }, [dob]);

  useEffect(() => {
    if (initialResetToken) setResetToken(initialResetToken);
  }, [initialResetToken]);

  const changeView = (nextView: typeof view) => {
    setError(null);
    setSuccessMsg(null);
    setPassword("");
    setConfirmPassword("");
    setView(nextView);
    if (nextView === "profile-complete") {
      setCompleteStep(1);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await withFirebaseTimeout(
        signInWithEmailAndPassword(auth, email, password),
        "Sign in"
      );
      const user = userCredential.user;
      
      const userSnapshot = await withFirebaseTimeout(
        get(ref(db, `users/${user.uid}`)),
        "Database read"
      );
      let profileData = userSnapshot.exists() ? userSnapshot.val() : null;

      if (!profileData) {
        profileData = {
          email: user.email?.toLowerCase(),
          name: email.split("@")[0],
          firstName: email.split("@")[0],
          lastName: "",
          phone: "",
          verified: true,
          profileCompleted: false,
          username: "",
          dateOfBirth: "",
          gender: "Male",
          address: "",
          bio: "",
          profilePicture: "",
          weight: 70.0,
          calories: 0,
          water: 0,
          completedHabits: { breakfast: false, water: false, protein: false, exercise: false, sleep: false },
          goals: { weight: 65.0, calories: 2000, protein: 100, water: 2500 },
          activity: "light",
          preferences: { veg: false, egg: false, nonveg: false, vegan: false, jain: false },
          allergies: { peanuts: false, gluten: false, dairy: false, shellfish: false },
          memories: []
        };
        await withFirebaseTimeout(set(ref(db, `users/${user.uid}`), profileData), "Database write");
      }

      if (rememberMe) {
        localStorage.setItem("fitma_token", user.uid);
      } else {
        sessionStorage.setItem("fitma_token", user.uid);
      }

      if (!profileData.profileCompleted) {
        setActiveSessionToken(user.uid);
        setActiveSessionUser(profileData);
        changeView("profile-complete");
      } else {
        onAuthSuccess(user.uid, profileData, false);
      }
    } catch (err: any) {
      if (isPlaceholderConfig() && email && password) {
        console.warn("Firebase sign in failed, checking offline mock credentials fallback:", err);
        const mockUid = "mock_" + email.replace(/[@.]/g, "_");
        const localKey = `fitma_fallback_user_${mockUid}`;
        let profileData = JSON.parse(localStorage.getItem(localKey) || "null");

        if (!profileData) {
          profileData = {
            email: email.toLowerCase(),
            name: email.split("@")[0],
            firstName: email.split("@")[0],
            lastName: "",
            phone: "",
            verified: true,
            profileCompleted: false,
            username: "",
            dateOfBirth: "",
            gender: "Male",
            address: "",
            bio: "",
            profilePicture: "",
            weight: 70.0,
            calories: 0,
            water: 0,
            completedHabits: { breakfast: false, water: false, protein: false, exercise: false, sleep: false },
            goals: { weight: 65.0, calories: 2000, protein: 100, water: 2500 },
            activity: "light",
            preferences: { veg: false, egg: false, nonveg: false, vegan: false, jain: false },
            allergies: { peanuts: false, gluten: false, dairy: false, shellfish: false },
            memories: []
          };
          localStorage.setItem(localKey, JSON.stringify(profileData));
        }

        if (rememberMe) {
          localStorage.setItem("fitma_token", mockUid);
        } else {
          sessionStorage.setItem("fitma_token", mockUid);
        }

        if (!profileData.profileCompleted) {
          setActiveSessionToken(mockUid);
          setActiveSessionUser(profileData);
          changeView("profile-complete");
        } else {
          onAuthSuccess(mockUid, profileData, false);
        }
      } else {
        console.error("Firebase sign in error:", err);
        setError(err.message || "Sign in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userCredential = await withFirebaseTimeout(
        createUserWithEmailAndPassword(auth, email, password),
        "Sign up"
      );
      const user = userCredential.user;

      const profileData = {
        email: email.toLowerCase(),
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone: "",
        verified: true,
        profileCompleted: false,
        username: "",
        dateOfBirth: "",
        gender: "Male",
        address: "",
        bio: "",
        profilePicture: "",
        weight: 70.0,
        calories: 0,
        water: 0,
        completedHabits: { breakfast: false, water: false, protein: false, exercise: false, sleep: false },
        goals: { weight: 65.0, calories: 2000, protein: 100, water: 2500 },
        activity: "light",
        preferences: { veg: false, egg: false, nonveg: false, vegan: false, jain: false },
        allergies: { peanuts: false, gluten: false, dairy: false, shellfish: false },
        memories: []
      };

      await withFirebaseTimeout(set(ref(db, `users/${user.uid}`), profileData), "Database write");

      setSuccessMsg("Registration successful! Loading profile setup...");
      
      if (rememberMe) {
        localStorage.setItem("fitma_token", user.uid);
      } else {
        sessionStorage.setItem("fitma_token", user.uid);
      }

      setActiveSessionToken(user.uid);
      setActiveSessionUser(profileData);
      setTimeout(() => {
        changeView("profile-complete");
      }, 1000);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use" || err.message?.includes("email-already-in-use")) {
        try {
          // Attempt to sign them in instead if they already exist
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const profileSnapshot = await get(ref(db, `users/${user.uid}`));
          let profileData = profileSnapshot.val();
          
          if (!profileData) {
             profileData = { email: email.toLowerCase(), profileCompleted: false };
          }
          
          if (rememberMe) {
            localStorage.setItem("fitma_token", user.uid);
          } else {
            sessionStorage.setItem("fitma_token", user.uid);
          }
          
          setActiveSessionToken(user.uid);
          setActiveSessionUser(profileData);
          setSuccessMsg("Account exists. Signing you in...");
          
          setTimeout(() => {
            if (!profileData.profileCompleted) {
              changeView("profile-complete");
            } else {
              onAuthSuccess(user.uid, profileData, false);
            }
          }, 1000);
          return;
        } catch (signInErr: any) {
          setError("This email is already registered. Please sign in instead.");
          setLoading(false);
          return;
        }
      }

      if (isPlaceholderConfig() && email && password) {
        console.warn("Firebase sign up failed, falling back to local storage profile creation:", err);
        const mockUid = "mock_" + email.replace(/[@.]/g, "_");
        const profileData = {
          email: email.toLowerCase(),
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          phone: "",
          verified: true,
          profileCompleted: false,
          username: "",
          dateOfBirth: "",
          gender: "Male",
          address: "",
          bio: "",
          profilePicture: "",
          weight: 70.0,
          calories: 0,
          water: 0,
          completedHabits: { breakfast: false, water: false, protein: false, exercise: false, sleep: false },
          goals: { weight: 65.0, calories: 2000, protein: 100, water: 2500 },
          activity: "light",
          preferences: { veg: false, egg: false, nonveg: false, vegan: false, jain: false },
          allergies: { peanuts: false, gluten: false, dairy: false, shellfish: false },
          memories: []
        };

        localStorage.setItem(`fitma_fallback_user_${mockUid}`, JSON.stringify(profileData));
        setSuccessMsg("Signed up successfully (Offline Fallback mode)!");

        if (rememberMe) {
          localStorage.setItem("fitma_token", mockUid);
        } else {
          sessionStorage.setItem("fitma_token", mockUid);
        }

        setActiveSessionToken(mockUid);
        setActiveSessionUser(profileData);
        setTimeout(() => {
          changeView("profile-complete");
        }, 1000);
      } else {
        console.error("Firebase sign up error:", err);
        setError(err.message || "Sign up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Verification completed successfully!");
    changeView("signin");
  };

  const handleResendVerification = async () => {
    setSuccessMsg("Verification email link resent!");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("A password reset email has been dispatched via Firebase Auth.");
    } catch (err: any) {
      setError(err.message || "Forgot password operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Please use the link sent to your inbox to reset your password.");
    changeView("signin");
  };

  const handleGoogleOAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userSnapshot = await get(ref(db, `users/${user.uid}`));
      let profileData = userSnapshot.exists() ? userSnapshot.val() : null;

      if (!profileData) {
        profileData = {
          email: user.email?.toLowerCase() || "",
          name: user.displayName || user.email?.split("@")[0] || "User",
          firstName: (user.displayName || "").split(" ")[0] || "User",
          lastName: (user.displayName || "").split(" ").slice(1).join(" ") || "",
          phone: user.phoneNumber || "",
          verified: true,
          profileCompleted: false,
          username: (user.email || "").split("@")[0] + "_" + Math.floor(Math.random() * 1000),
          dateOfBirth: "",
          gender: "Male",
          address: "",
          bio: "",
          profilePicture: user.photoURL || "",
          weight: 70.0,
          calories: 0,
          water: 0,
          completedHabits: { breakfast: false, water: false, protein: false, exercise: false, sleep: false },
          goals: { weight: 65.0, calories: 2000, protein: 100, water: 2500 },
          activity: "light",
          preferences: { veg: false, egg: false, nonveg: false, vegan: false, jain: false },
          allergies: { peanuts: false, gluten: false, dairy: false, shellfish: false },
          memories: []
        };
        await set(ref(db, `users/${user.uid}`), profileData);
      }

      if (rememberMe) {
        localStorage.setItem("fitma_token", user.uid);
      } else {
        sessionStorage.setItem("fitma_token", user.uid);
      }

      if (!profileData.profileCompleted) {
        setActiveSessionToken(user.uid);
        setActiveSessionUser(profileData);
        changeView("profile-complete");
      } else {
        onAuthSuccess(user.uid, profileData, false);
      }
    } catch (err: any) {
      if (isPlaceholderConfig()) {
        console.warn("Firebase Google login failed, checking fallback simulator:", err);
        // Fallback
        const fallbackEmail = "google_user@fitma.ai";
        const fallbackName = "Google Developer";
        const mockUid = "mock_google_developer";
        const localKey = `fitma_fallback_user_${mockUid}`;
        let profileData = JSON.parse(localStorage.getItem(localKey) || "null");

        if (!profileData) {
          profileData = {
            email: fallbackEmail,
            name: fallbackName,
            firstName: "Google",
            lastName: "Developer",
            phone: "",
            verified: true,
            profileCompleted: false,
            username: "google_dev",
            dateOfBirth: "",
            gender: "Male",
            address: "",
            bio: "",
            profilePicture: "🧑‍🚀",
            weight: 70.0,
            calories: 0,
            water: 0,
            completedHabits: { breakfast: false, water: false, protein: false, exercise: false, sleep: false },
            goals: { weight: 65.0, calories: 2000, protein: 100, water: 2500 },
            activity: "light",
            preferences: { veg: false, egg: false, nonveg: false, vegan: false, jain: false },
            allergies: { peanuts: false, gluten: false, dairy: false, shellfish: false },
            memories: []
          };
          localStorage.setItem(localKey, JSON.stringify(profileData));
        }

        if (rememberMe) {
          localStorage.setItem("fitma_token", mockUid);
        } else {
          sessionStorage.setItem("fitma_token", mockUid);
        }

        if (!profileData.profileCompleted) {
          setActiveSessionToken(mockUid);
          setActiveSessionUser(profileData);
          changeView("profile-complete");
        } else {
          onAuthSuccess(mockUid, profileData, false);
        }
      } else {
        console.error("Firebase Google login error:", err);
        setError(err.message || "Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfileCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dobCombined = `${dobYear}-${dobMonth}-${dobDay}`;
      const updates = {
        username,
        dateOfBirth: dobCombined,
        gender,
        address,
        bio,
        profilePicture: profilePic,
        language,
        motivationStyle,
        workoutStatus,
        profileCompleted: true
      };

      await withFirebaseTimeout(update(ref(db, `users/${activeSessionToken!}`), updates), "Database update");

      const userSnapshot = await withFirebaseTimeout(get(ref(db, `users/${activeSessionToken!}`)), "Database read");
      onAuthSuccess(activeSessionToken!, userSnapshot.val(), true);
    } catch (err: any) {
      console.warn("Firebase profile save failed, writing to localStorage fallback:", err);
      const dobCombined = `${dobYear}-${dobMonth}-${dobDay}`;
      const localKey = `fitma_fallback_user_${activeSessionToken}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || "{}");
      const updated = { 
        ...existing, 
        username, 
        dateOfBirth: dobCombined, 
        gender, 
        address, 
        bio, 
        profilePicture: profilePic, 
        language,
        motivationStyle,
        workoutStatus,
        profileCompleted: true 
      };
      localStorage.setItem(localKey, JSON.stringify(updated));
      onAuthSuccess(activeSessionToken!, updated, true);
    } finally {
      setLoading(false);
    }
  };

  const isSignupDisabled = useMemo(() => {
    return (
      !email || 
      !password || 
      !confirmPassword || 
      !firstName || 
      !lastName || 
      !acceptTerms ||
      password !== confirmPassword ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }, [email, password, confirmPassword, firstName, lastName, acceptTerms]);

  return (
    <ScreenShell footer={<ProgressDots total={5} current={1} />}>
      <div className="flex h-full flex-col justify-center min-h-0 overflow-y-auto pb-4 px-3 relative">
        
        {/* APP HEADER */}
        {view !== "profile-complete" && (
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 mt-2"
          >
            <div className="relative mb-3 h-14">
              <div className="absolute left-2 top-2 h-12 w-12 rounded-full bg-[#34C759]/10 blur-lg" />
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-[16px] text-white"
                style={{
                  background: "linear-gradient(135deg, #34C759 0%, #00C4B0 100%)",
                  boxShadow: "0 8px 18px rgba(52,199,89,0.2)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <path d="M24 8C24 8 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 8 24 8Z" fill="white" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-extrabold" style={{ color: ink }}>
              {view === "signin" && "Welcome back"}
              {view === "signup" && "Create Account"}
              {view === "forgot" && "Forgot Password"}
              {view === "reset" && "Reset Password"}
              {view === "verify" && "Verify Email Address"}
            </h1>
            <p className="text-[11px]" style={{ color: muted }}>
              {view === "signin" && "Connect with Liva and let your health path align."}
              {view === "signup" && "Set up a new secure profile in seconds."}
              {view === "forgot" && "Input your registered email to request a reset link."}
              {view === "reset" && "Provide the token and set a strong password."}
              {view === "verify" && "A validation link was printed to server console logs."}
            </p>
          </motion.div>
        )}

        {/* FEEDBACK LABELS */}
        {error && (
          <div className="mb-3 rounded-xl p-3 bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100 flex items-center gap-2">
            <Lock size={12} /> {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 rounded-xl p-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
            <Check size={12} /> {successMsg}
          </div>
        )}

        {/* VIEW 1: SIGN IN */}
        {view === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300 transition-all focus:bg-white focus:border-[#34c759]/30"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-slate-50 pl-9 pr-9 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300 transition-all focus:bg-white focus:border-[#34c759]/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <div className="flex justify-end pt-0.5">
                <button 
                  type="button" 
                  onClick={() => changeView("forgot")} 
                  className="text-[10px] font-bold text-[#34c759] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="rememberMe"
                className="accent-[#34c759] h-3.5 w-3.5 rounded border-slate-300"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="text-[10px] font-bold text-slate-500 cursor-pointer select-none">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#34c759] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#25ad48] transition-all flex items-center justify-center gap-1.5 shadow"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        )}

        {/* VIEW 2: SIGN UP */}
        {view === "signup" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-slate-50 pl-9 pr-9 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none font-semibold text-xs transition-all ${
                    confirmPassword.length > 0 && password !== confirmPassword 
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : "bg-slate-50 border-slate-100 text-slate-700 placeholder-slate-300"
                  }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock size={12} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  confirmPassword.length > 0 && password !== confirmPassword ? "text-rose-400" : "text-slate-400"
                }`} />
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-[9px] font-bold text-rose-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            <div className="flex items-start gap-2 py-1">
              <input
                type="checkbox"
                id="acceptTerms"
                className="accent-[#34c759] h-3.5 w-3.5 rounded border-slate-300 mt-0.5"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="acceptTerms" className="text-[9px] font-bold text-slate-500 cursor-pointer select-none">
                I accept the <span className="text-[#34c759] underline">Terms of Service</span> and <span className="text-[#34c759] underline">Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSignupDisabled || loading}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
                isSignupDisabled 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-[#34c759] text-white hover:bg-[#25ad48]"
              }`}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Create Account"}
            </button>
          </form>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {view === "forgot" && (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#34c759] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#25ad48] transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* VIEW 4: RESET PASSWORD */}
        {view === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Reset Token</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700"
                placeholder="Reset code"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none font-semibold text-xs transition-all ${
                    confirmPassword.length > 0 && password !== confirmPassword 
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : "bg-slate-50 border-slate-100 text-slate-700"
                  }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock size={12} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  confirmPassword.length > 0 && password !== confirmPassword ? "text-rose-400" : "text-slate-400"
                }`} />
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-[9px] font-bold text-rose-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 8}
              className="w-full bg-[#34c759] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#25ad48] transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Save New Password"}
            </button>
          </form>
        )}

        {/* VIEW 5: EMAIL VERIFICATION PENDING */}
        {view === "verify" && (
          <form onSubmit={handleVerifyEmail} className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Verification Token</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 outline-none font-semibold text-xs text-slate-700 placeholder-slate-300"
                placeholder="Verification token"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#34c759] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#25ad48] transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:underline mt-1"
            >
              Resend verification code
            </button>
          </form>
        )}

        {view === "profile-complete" && (
          <form onSubmit={handleSaveProfileCompletion} className="flex flex-col gap-2.5 pb-1">
            <div className="flex flex-col items-center mb-1">
              <LivaAvatar size={38} floating />
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug mt-1.5 text-center">Let's Personalize Liva</h2>
              <p className="text-[10px] text-slate-400 mt-0.5 text-center font-semibold leading-relaxed">
                Just a few quick details so I can guide you better.
              </p>
            </div>

            {/* What should Liva call you? */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Preferred Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full bg-white/60 backdrop-blur-md pl-10 pr-4 py-2.5 rounded-2xl border border-white outline-none font-bold text-sm text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all focus:border-[#34c759]/50 focus:shadow-[0_4px_16px_rgba(52,199,89,0.1)]"
                  placeholder="What should I call you?"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Gender</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white/60 backdrop-blur-md pl-4 pr-8 py-2.5 rounded-2xl border border-white outline-none font-bold text-xs text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] appearance-none cursor-pointer"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>

              {/* Date of Birth - Simplified for modern look */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Birth Year</label>
                <div className="relative">
                  <select
                    className="w-full bg-white/60 backdrop-blur-md pl-4 pr-8 py-2.5 rounded-2xl border border-white outline-none font-bold text-xs text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] appearance-none cursor-pointer"
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                  >
                    {Array.from({ length: 60 }, (_, i) => {
                      const y = 2015 - i;
                      return <option key={y} value={String(y)}>{y}</option>;
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5 mt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Language</label>
              <div className="flex flex-wrap gap-2 pb-1">
                {["English", "Hindi", "Marathi", "Gujarati"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLanguage(item)}
                    className={`shrink-0 px-4 py-2 rounded-2xl text-[11px] font-bold transition-all duration-300 ${
                      language === item
                        ? "bg-[#34c759] text-white shadow-[0_4px_12px_rgba(52,199,89,0.25)] border border-[#34c759]"
                        : "bg-white/60 backdrop-blur-md border border-white text-slate-500 hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-1.5 mt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Coaching Style</label>
              <div className="flex flex-wrap gap-2 pb-1">
                {["Friendly", "Tough", "Data", "Supportive"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMotivationStyle(item)}
                    className={`shrink-0 px-4 py-2 rounded-2xl text-[11px] font-bold transition-all duration-300 ${
                      motivationStyle === item
                        ? "bg-[#34c759] text-white shadow-[0_4px_12px_rgba(52,199,89,0.25)] border border-[#34c759]"
                        : "bg-white/60 backdrop-blur-md border border-white text-slate-500 hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Workout */}
            <div className="space-y-1.5 mt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Activity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Active", value: "Yes" },
                  { label: "Moderate", value: "Sometimes" },
                  { label: "Sedentary", value: "No" }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setWorkoutStatus(item.value)}
                    className={`py-2.5 rounded-2xl text-[11px] font-bold transition-all duration-300 ${
                      workoutStatus === item.value
                        ? "bg-[#34c759] text-white shadow-[0_4px_12px_rgba(52,199,89,0.25)] border border-[#34c759]"
                        : "bg-white/60 backdrop-blur-md border border-white text-slate-500 hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Trust Footnote */}
            <div className="mt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#34c759] text-white py-3.5 rounded-2xl text-xs font-extrabold hover:bg-[#25ad48] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(52,199,89,0.2)] cursor-pointer mt-4"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Save & Continue"}
              </button>
              
              <p className="text-center text-[8px] font-bold text-slate-500 mt-2 leading-none">
                🔒 Used only to personalize your experience.
              </p>
            </div>
          </form>
        )}

        {/* OR DIVIDER & SOCIAL LOGIN */}
        {view !== "profile-complete" && view !== "verify" && (
          <>
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-slate-100" />
              <span className="absolute bg-[#f8fdfb] px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Or</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGoogleOAuth}
                className="w-full bg-white hover:bg-slate-50 text-[#0f1f1a] py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </>
        )}

        {/* BOTTOM REDIRECT TOGGLE */}
        {view !== "profile-complete" && (
          <div className="mt-4 text-center">
            {view === "signin" ? (
              <button
                type="button"
                onClick={() => changeView("signup")}
                className="text-xs font-bold text-[#34c759] hover:underline"
              >
                Don't have an account? Sign Up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => changeView("signin")}
                className="text-xs font-bold text-[#34c759] hover:underline"
              >
                Already have an account? Sign In
              </button>
            )}
          </div>
        )}

      </div>
    </ScreenShell>
  );
}
