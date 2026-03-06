"use client";

import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-ice/20">
            <main className="relative w-full max-w-3xl z-10 my-20">
                <div className="text-center mb-12">
                    <div className="size-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl">app_registration</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-3">
                        Join Bloomncuddles
                    </h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        Choose how you&apos;d like to register. Schools and independent teachers are both welcome.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* School Admin Card */}
                    <Link
                        href="/register/school"
                        className="group bg-white border-2 border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">school</span>
                            </div>
                            <h2 className="text-xl font-bold text-navy mb-2">School Administrator</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Register your school, set up classes, manage teachers, and access the full platform with a subscription plan.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600 mb-6">
                                {[
                                    "Complete school profile setup",
                                    "Choose a subscription plan",
                                    "Manage teachers & students",
                                    "Access analytics & reports"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                                Register School
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </div>
                        </div>
                    </Link>

                    {/* Independent Teacher Card */}
                    <Link
                        href="/register/teacher"
                        className="group bg-white border-2 border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="size-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">person</span>
                            </div>
                            <h2 className="text-xl font-bold text-navy mb-2">Independent Teacher</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Create your own classroom space. Perfect for freelance educators, tutors, and homeschool teachers.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600 mb-6">
                                {[
                                    "Quick & free setup",
                                    "Personal virtual classroom",
                                    "Assign games & activities",
                                    "Track student progress"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center gap-2 text-secondary font-bold text-sm group-hover:gap-3 transition-all">
                                Get Started Free
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <p className="text-center text-sm text-slate-500 mt-10">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Log in here
                    </Link>
                </p>
            </main>
        </div>
    );
}
