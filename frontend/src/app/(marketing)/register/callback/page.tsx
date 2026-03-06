"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const reference = searchParams.get("reference") || searchParams.get("trxref");
        if (!reference) {
            setStatus("error");
            setMessage("No payment reference found.");
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/api/auth/verify-registration-payment?reference=${reference}`
                );
                const data = await res.json();

                if (data.success && data.token) {
                    // Store auth data
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setStatus("success");
                    setMessage("Your school has been activated!");

                    // Redirect to dashboard after a brief celebration
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Payment verification failed.");
                }
            } catch {
                setStatus("error");
                setMessage("Could not verify payment. Please contact support.");
            }
        };

        verifyPayment();
    }, [searchParams, router]);

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-ice/20">
            <div className="bg-white border border-navy/5 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
                {status === "loading" && (
                    <div className="animate-in fade-in duration-300">
                        <div className="size-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                        <h2 className="text-xl font-bold text-navy mb-2">Verifying Payment...</h2>
                        <p className="text-sm text-slate-500">Please wait while we confirm your payment with Paystack.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="size-20 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl">celebration</span>
                        </div>
                        <h2 className="text-2xl font-bold text-navy mb-3">Welcome to Bloomncuddles! 🎉</h2>
                        <p className="text-slate-500 mb-6">{message}</p>
                        <p className="text-sm text-slate-400">Redirecting to your dashboard...</p>
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="animate-in fade-in duration-300">
                        <div className="size-20 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl">error</span>
                        </div>
                        <h2 className="text-xl font-bold text-navy mb-3">Payment Issue</h2>
                        <p className="text-slate-500 mb-6">{message}</p>
                        <div className="flex gap-3 justify-center">
                            <Link href="/register/school" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:translate-y-[-1px] shadow-lg shadow-primary/25 transition-all">
                                Try Again
                            </Link>
                            <Link href="/contact" className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function RegisterCallbackPage() {
    return (
        <Suspense fallback={
            <div className="relative min-h-screen flex items-center justify-center p-4 bg-ice/20">
                <div className="bg-white border border-navy/5 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
                    <div className="size-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                    <h2 className="text-xl font-bold text-navy mb-2">Loading...</h2>
                </div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
