"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
    { label: "School Info", icon: "school" },
    { label: "Admin Account", icon: "person" },
    { label: "Choose Plan", icon: "credit_card" },
    { label: "Complete", icon: "check_circle" },
];

const PUPIL_OPTIONS = ["1–50", "51–100", "101–200", "201–500", "500+"];
const REVENUE_OPTIONS = ["Less than ₦1M", "₦1M – ₦5M", "₦5M – ₦10M", "Above ₦10M"];

const PLANS = [
    {
        id: "basic",
        name: "Basic",
        monthly: 5000,
        yearly: 50000,
        features: ["Up to 100 Students", "Basic Analytics", "Email Support"],
        color: "primary",
        icon: "rocket_launch",
    },
    {
        id: "premium",
        name: "Premium",
        monthly: 10000,
        yearly: 100000,
        popular: true,
        features: ["Unlimited Students & Teachers", "Advanced Analytics & Reports", "Priority Support 24/7"],
        color: "secondary",
        icon: "diamond",
    },
    {
        id: "enterprise",
        name: "Enterprise",
        monthly: 20000,
        yearly: 200000,
        features: ["Everything in Premium", "Custom Integrations", "Dedicated Account Manager", "SLA Guarantee"],
        color: "primary-dark",
        icon: "corporate_fare",
    },
];

export default function SchoolRegistration() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const certInputRef = useRef<HTMLInputElement>(null);
    const idInputRef = useRef<HTMLInputElement>(null);

    // Step 1: School Info
    const [schoolName, setSchoolName] = useState("");
    const [schoolAddress, setSchoolAddress] = useState("");
    const [numberOfPupils, setNumberOfPupils] = useState("");
    const [termRevenueRange, setTermRevenueRange] = useState("");
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [certificateUrl, setCertificateUrl] = useState("");

    // Step 2: Admin Account
    const [adminName, setAdminName] = useState("");
    const [idFile, setIdFile] = useState<File | null>(null);
    const [adminIdUrl, setAdminIdUrl] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Step 3: Plan Selection
    const [selectedPlan, setSelectedPlan] = useState("premium");
    const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

    // File to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, certificate: "File must be less than 5MB" }));
            return;
        }
        setCertificateFile(file);
        const base64 = await fileToBase64(file);
        setCertificateUrl(base64);
        setErrors(prev => ({ ...prev, certificate: "" }));
    };

    const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, adminId: "File must be less than 5MB" }));
            return;
        }
        setIdFile(file);
        const base64 = await fileToBase64(file);
        setAdminIdUrl(base64);
        setErrors(prev => ({ ...prev, adminId: "" }));
    };

    const getPasswordStrength = (pw: string) => {
        if (!pw) return { label: "", color: "", width: "0%" };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (pw.length >= 12) score++;
        if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "20%" };
        if (score <= 2) return { label: "Fair", color: "bg-orange-400", width: "40%" };
        if (score <= 3) return { label: "Good", color: "bg-yellow-400", width: "60%" };
        if (score <= 4) return { label: "Strong", color: "bg-green-500", width: "80%" };
        return { label: "Excellent", color: "bg-emerald-500", width: "100%" };
    };

    const validateStep = (s: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (s === 0) {
            if (!schoolName.trim()) newErrors.schoolName = "School name is required";
            if (!schoolAddress.trim()) newErrors.schoolAddress = "School address is required";
            if (!numberOfPupils) newErrors.numberOfPupils = "Please select number of pupils";
            if (!termRevenueRange) newErrors.termRevenueRange = "Please select revenue range";
            if (!certificateUrl) newErrors.certificate = "Certificate of registration is required";
        }

        if (s === 1) {
            if (!adminName.trim()) newErrors.adminName = "Admin name is required";
            if (!adminIdUrl) newErrors.adminId = "Government-issued ID is required";
            if (!email.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";
            if (!password) newErrors.password = "Password is required";
            else if (password.length < 8) newErrors.password = "Minimum 8 characters";
            if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const goNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const goBack = () => setStep(Math.max(0, step - 1));

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        try {
            console.log("Starting registration...");
            const payload = {
                schoolName,
                schoolAddress,
                numberOfPupils,
                termRevenueRange,
                certificateUrl,
                adminName,
                adminIdUrl,
                email,
                password,
                plan: selectedPlan,
                interval,
            };
            console.log("Payload keys:", Object.keys(payload));
            console.log("certificateUrl length:", certificateUrl?.length || 0);
            console.log("adminIdUrl length:", adminIdUrl?.length || 0);

            const res = await fetch("http://localhost:4000/api/auth/register-school", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);

            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                    const errorFields = Object.keys(data.errors);
                    const step1Fields = ["schoolName", "schoolAddress", "numberOfPupils", "termRevenueRange", "certificateUrl"];
                    const step2Fields = ["adminName", "adminIdUrl", "email", "password"];
                    if (errorFields.some(f => step1Fields.includes(f))) setStep(0);
                    else if (errorFields.some(f => step2Fields.includes(f))) setStep(1);
                } else {
                    setErrors({ general: data.message || "Registration failed" });
                }
                setLoading(false);
                return;
            }

            // Redirect to Paystack
            if (data.authorizationUrl) {
                console.log("Redirecting to Paystack:", data.authorizationUrl);
                window.location.href = data.authorizationUrl;
            } else {
                console.error("No authorizationUrl in response:", data);
                setErrors({ general: "Payment initialization failed. No redirect URL received." });
                setLoading(false);
            }
        } catch (err) {
            console.error("Registration fetch error:", err);
            setErrors({ general: "Network error. Please try again." });
            setLoading(false);
        }
    };

    const pwStrength = getPasswordStrength(password);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-ice/20">
            <main className="relative w-full max-w-2xl z-10 my-20">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/register" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to registration options
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-navy tracking-tight">
                        School Registration
                    </h1>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                        i < step
                                            ? "bg-primary text-white"
                                            : i === step
                                            ? "bg-primary text-white ring-4 ring-primary/20"
                                            : "bg-slate-100 text-slate-400"
                                    }`}
                                >
                                    {i < step ? (
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">{s.icon}</span>
                                    )}
                                </div>
                                <span className={`text-xs font-bold mt-2 hidden sm:block ${
                                    i <= step ? "text-navy" : "text-slate-400"
                                }`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`w-12 md:w-20 h-0.5 mx-1 transition-colors duration-300 ${
                                    i < step ? "bg-primary" : "bg-slate-200"
                                }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Error Banner */}
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-sm font-bold">{errors.general}</p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white border border-navy/5 shadow-2xl rounded-2xl p-8 sm:p-10">
                    {/* STEP 1: School Info */}
                    {step === 0 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-bold text-navy mb-1">School Information</h2>
                            <p className="text-sm text-slate-500 mb-4">Tell us about your school.</p>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">School Name *</label>
                                <input
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.schoolName ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                    value={schoolName} onChange={e => setSchoolName(e.target.value)}
                                    placeholder="e.g., Bright Future Academy"
                                />
                                {errors.schoolName && <p className="text-xs text-red-500 font-bold">{errors.schoolName}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">School Address *</label>
                                <input
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.schoolAddress ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                    value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)}
                                    placeholder="e.g., 15 Admiralty Way, Lekki, Lagos"
                                />
                                {errors.schoolAddress && <p className="text-xs text-red-500 font-bold">{errors.schoolAddress}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Number of Pupils *</label>
                                    <select
                                        className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.numberOfPupils ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                        value={numberOfPupils} onChange={e => setNumberOfPupils(e.target.value)}
                                    >
                                        <option value="">Select range</option>
                                        {PUPIL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    {errors.numberOfPupils && <p className="text-xs text-red-500 font-bold">{errors.numberOfPupils}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Term Revenue Range *</label>
                                    <select
                                        className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.termRevenueRange ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                        value={termRevenueRange} onChange={e => setTermRevenueRange(e.target.value)}
                                    >
                                        <option value="">Select range</option>
                                        {REVENUE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    {errors.termRevenueRange && <p className="text-xs text-red-500 font-bold">{errors.termRevenueRange}</p>}
                                </div>
                            </div>

                            {/* Certificate Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Certificate of School Registration *</label>
                                <p className="text-xs text-slate-400">Upload PDF or image (max 5MB)</p>
                                <input ref={certInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleCertUpload} />
                                <button
                                    type="button"
                                    onClick={() => certInputRef.current?.click()}
                                    className={`w-full py-4 border-2 border-dashed ${errors.certificate ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-primary/40 hover:bg-primary/5"} rounded-xl transition-all flex items-center justify-center gap-3 text-sm font-bold ${certificateFile ? "text-primary" : "text-slate-500"}`}
                                >
                                    <span className="material-symbols-outlined">{certificateFile ? "description" : "cloud_upload"}</span>
                                    {certificateFile ? certificateFile.name : "Click to upload certificate"}
                                </button>
                                {errors.certificate && <p className="text-xs text-red-500 font-bold">{errors.certificate}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Admin Account */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-bold text-navy mb-1">Administrator Account</h2>
                            <p className="text-sm text-slate-500 mb-4">The school owner or principal&apos;s details.</p>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Full Name (as on ID) *</label>
                                <input
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.adminName ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                    value={adminName} onChange={e => setAdminName(e.target.value)}
                                    placeholder="e.g., John Doe"
                                />
                                {errors.adminName && <p className="text-xs text-red-500 font-bold">{errors.adminName}</p>}
                            </div>

                            {/* ID Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Government-Issued ID *</label>
                                <p className="text-xs text-slate-400">NIN, Passport, Driver&apos;s License — name must match the above (PDF/image, max 5MB)</p>
                                <input ref={idInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleIdUpload} />
                                <button
                                    type="button"
                                    onClick={() => idInputRef.current?.click()}
                                    className={`w-full py-4 border-2 border-dashed ${errors.adminId ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-primary/40 hover:bg-primary/5"} rounded-xl transition-all flex items-center justify-center gap-3 text-sm font-bold ${idFile ? "text-primary" : "text-slate-500"}`}
                                >
                                    <span className="material-symbols-outlined">{idFile ? "badge" : "cloud_upload"}</span>
                                    {idFile ? idFile.name : "Click to upload government ID"}
                                </button>
                                {errors.adminId && <p className="text-xs text-red-500 font-bold">{errors.adminId}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Email Address *</label>
                                <input
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.email ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@brightfuture.edu.ng" type="email"
                                />
                                {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Password *</label>
                                <div className="relative">
                                    <input
                                        className={`w-full px-4 py-3.5 pr-12 bg-slate-50 border ${errors.password ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                        value={password} onChange={e => setPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                                {password && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${pwStrength.color} rounded-full transition-all duration-500`} style={{ width: pwStrength.width }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{pwStrength.label}</span>
                                    </div>
                                )}
                                {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Confirm Password *</label>
                                <input
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.confirmPassword ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                    type="password" placeholder="Re-enter your password"
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-500 font-bold">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Plan Selection */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-bold text-navy mb-1">Choose Your Plan</h2>
                            <p className="text-sm text-slate-500 mb-6">Select a plan to activate your school on Bloomncuddles.</p>

                            {/* Interval Toggle */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-slate-100 p-1 rounded-xl flex">
                                    <button
                                        onClick={() => setInterval("monthly")}
                                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${interval === "monthly" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setInterval("yearly")}
                                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${interval === "yearly" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
                                    >
                                        Yearly <span className="text-xs text-green-600 font-bold ml-1">Save 17%</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {PLANS.map((plan) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                                            selectedPlan === plan.id
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        {plan.popular && (
                                            <span className="absolute -top-2.5 left-4 bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                                POPULAR
                                            </span>
                                        )}
                                        <div className={`size-9 rounded-lg bg-${plan.color}/10 text-${plan.color} flex items-center justify-center mb-3`}>
                                            <span className="material-symbols-outlined text-xl">{plan.icon}</span>
                                        </div>
                                        <h3 className="font-bold text-navy text-sm">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-1 mb-3">
                                            <span className="text-2xl font-extrabold text-navy">
                                                ₦{(interval === "yearly" ? plan.yearly : plan.monthly).toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400">/{interval === "yearly" ? "yr" : "mo"}</span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-primary text-xs">check</span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Complete */}
                    {step === 3 && (
                        <div className="text-center py-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="size-20 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-navy mb-3">Almost There!</h2>
                            <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                Review your details and complete the payment to activate your school on Bloomncuddles.
                            </p>
                            <div className="text-left bg-slate-50 rounded-xl p-6 space-y-3 text-sm max-w-sm mx-auto">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">School</span>
                                    <span className="font-bold text-navy">{schoolName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Admin</span>
                                    <span className="font-bold text-navy">{adminName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Email</span>
                                    <span className="font-bold text-navy">{email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Plan</span>
                                    <span className="font-bold text-navy capitalize">{selectedPlan} ({interval})</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-base">
                                    <span className="font-bold text-slate-700">Total</span>
                                    <span className="font-extrabold text-primary">
                                        ₦{(interval === "yearly" ? PLANS.find(p => p.id === selectedPlan)!.yearly : PLANS.find(p => p.id === selectedPlan)!.monthly).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                        {step > 0 && step < 4 ? (
                            <button
                                onClick={goBack}
                                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Back
                            </button>
                        ) : <div></div>}

                        {step < 2 && (
                            <button
                                onClick={goNext}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:translate-y-[-1px] shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                Continue
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        )}

                        {step === 2 && (
                            <button
                                onClick={goNext}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:translate-y-[-1px] shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                Review & Pay
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        )}

                        {step === 3 && (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:translate-y-[-1px] shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">lock</span>
                                        Pay with Paystack
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                </p>
            </main>
        </div>
    );
}
