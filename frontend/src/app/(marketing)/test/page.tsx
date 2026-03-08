"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function TestPage() {
    const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="overflow-x-hidden">
            {/* ===== HERO SECTION - Bold Full-Color with Floating Cards ===== */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-primary">
                {/* Background decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Large circle behind the image */}
                    <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[550px] h-[550px] rounded-full border-[40px] border-white/10 hidden lg:block" />
                    <div className="absolute top-1/2 right-[12%] -translate-y-[45%] w-[450px] h-[450px] rounded-full bg-white/10 hidden lg:block" />
                    {/* Large kite/diamond pattern */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, white 60px, white 62px), repeating-linear-gradient(-45deg, transparent, transparent 60px, white 60px, white 62px)', backgroundSize: '85px 85px' }} />
                    {/* Abstract SVG shapes */}
                    <svg className="absolute top-16 right-[5%] w-16 h-16 text-white/10 hidden lg:block animate-float" viewBox="0 0 64 64" fill="none">
                        <path d="M32 4L60 32L32 60L4 32Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <svg className="absolute bottom-20 left-[8%] w-12 h-12 text-white/10 hidden lg:block animate-float" style={{ animationDelay: '2s' }} viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <svg className="absolute top-[30%] left-[3%] w-8 h-8 text-white/20 hidden lg:block" viewBox="0 0 32 32" fill="currentColor">
                        <polygon points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12"/>
                    </svg>
                    {/* Flowing arrows (like in the reference) */}
                    <svg className="absolute top-[25%] right-[35%] w-20 h-10 text-white/15 hidden lg:block" viewBox="0 0 80 40" fill="none">
                        <path d="M5 20 Q20 5, 40 20 Q60 35, 75 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M65 15 L75 20 L65 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg className="absolute bottom-[30%] right-[15%] w-24 h-12 text-white/10 hidden lg:block" viewBox="0 0 96 48" fill="none">
                        <path d="M5 24 Q25 5, 48 24 Q70 43, 91 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M81 19 L91 24 L81 29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {/* Dollar / Growth icons */}
                    <div className="absolute bottom-[15%] right-[6%] w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center hidden lg:block">
                        <span className="material-symbols-outlined text-white/20 text-3xl">trending_up</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text content */}
                        <div className="flex flex-col gap-7">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-bold uppercase tracking-wider w-fit">
                                <span className="material-symbols-outlined text-white text-sm">verified</span>
                                Trusted by 500+ Early Educators
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-extrabold text-white leading-[1.05] tracking-tight">
                                Nurturing{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10">Minds,</span>
                                </span>{" "}
                                <span className="text-white/90 italic">Empowering</span>{" "}
                                <span className="relative inline-block">
                                    Educators
                                    <svg className="absolute -bottom-1 left-0 w-full h-2 text-white/30" viewBox="0 0 200 8" fill="none">
                                        <path d="M2 5C40 1 80 1 100 4C120 7 160 7 198 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg">
                                The early years digital learning platform designed for modern educators and curious young minds. Balance curriculum with care in one secure, playful environment.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link href="/register" className="group bg-white text-primary px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2">
                                    Get Started, It&apos;s Free
                                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                                <Link href="#how-it-works" className="group flex items-center justify-center gap-3 text-white px-6 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all">
                                    <span className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                    </span>
                                    Watch Demo
                                </Link>
                            </div>

                            {/* Social proof */}
                            <div className="flex items-center gap-4 pt-4">
                                <p className="text-white/50 text-sm font-medium">Trusted by <span className="text-white font-bold">500+</span> schools</p>
                                <div className="h-4 w-px bg-white/20" />
                                <div className="flex items-center gap-1">
                                    <span className="text-white/50 text-sm font-medium">Rated</span>
                                    <span className="text-white font-bold text-sm">4.9</span>
                                    <div className="flex items-center gap-0.5 text-secondary">
                                        {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-xs">star</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual composition */}
                        <div className="relative hidden lg:flex items-center justify-center min-h-[580px]">
                            {/* Main educator image in circle */}
                            <div className="relative w-[420px] h-[420px] rounded-full overflow-hidden border-4 border-white/20 shadow-2xl z-10">
                                <Image 
                                    src="/hero-schoolkids.png" 
                                    alt="Happy young school children" 
                                    width={800} height={800} 
                                    className="w-full h-full object-cover scale-110" 
                                    priority 
                                />
                            </div>

                            {/* Floating stat card: Total Students */}
                            <div className="absolute top-4 left-0 bg-white rounded-2xl p-4 pr-6 shadow-2xl z-20 animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">groups</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
                                        <p className="text-2xl font-extrabold text-slate-900 leading-tight">1,365</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold">New Enrollments</span>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">24</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating stat card: Total Employees / Teachers */}
                            <div className="absolute top-8 right-[-20px] bg-white rounded-2xl p-4 shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">badge</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Teachers</p>
                                    </div>
                                    <p className="text-3xl font-extrabold text-slate-900">37</p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Newly Hired</span>
                                        <span className="text-[10px] font-bold text-primary">04</span>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[75%] bg-primary rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating stat card: Revenue */}
                            <div className="absolute bottom-6 left-4 bg-white rounded-2xl p-4 pr-6 shadow-2xl z-20 animate-float" style={{ animationDelay: '2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">monitoring</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue</p>
                                        <p className="text-2xl font-extrabold text-slate-900 leading-tight">₦2.4M</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[9px] text-primary font-bold cursor-pointer border-b border-primary">Daily</span>
                                            <span className="text-[9px] text-slate-300 font-bold cursor-pointer hover:text-slate-500">Weekly</span>
                                            <span className="text-[9px] text-slate-300 font-bold cursor-pointer hover:text-slate-500">Monthly</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Mini chart */}
                                <svg className="mt-2 w-full h-6" viewBox="0 0 120 24">
                                    <path d="M0 18 Q15 12, 30 14 Q45 16, 60 8 Q75 2, 90 10 Q105 16, 120 6" fill="none" stroke="#486fa1" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M0 18 Q15 12, 30 14 Q45 16, 60 8 Q75 2, 90 10 Q105 16, 120 6 L120 24 L0 24 Z" fill="url(#chartGrad)" opacity="0.15"/>
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#486fa1"/>
                                            <stop offset="100%" stopColor="#486fa1" stopOpacity="0"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Small plus icon (decorative) */}
                            <div className="absolute top-[15%] left-[45%] z-20">
                                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-lg">add</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 2 - Social Proof + Platform Showcase ===== */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Top: Headline */}
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800">
                        Join <span className="font-extrabold text-slate-900">500+</span> schools and a galaxy of users
                    </h2>
                </div>

                {/* Marquee logos */}
                <div className="relative mb-20 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <div className="flex animate-marquee w-max">
                        {[...Array(3)].map((_, setIndex) => (
                            <div key={setIndex} className="flex shrink-0 items-center gap-14 pr-14">
                                {[
                                    { icon: 'school', name: 'LittleSteps Academy' },
                                    { icon: 'wb_sunny', name: 'BrightMinds' },
                                    { icon: 'psychology', name: 'KindleCare' },
                                    { icon: 'eco', name: 'GreenLeaf Nursery' },
                                    { icon: 'palette', name: 'ArtiePrep' },
                                    { icon: 'castle', name: 'Royal Tots' },
                                    { icon: 'auto_stories', name: 'PageTurners' },
                                    { icon: 'child_care', name: 'TinyDreams' }
                                ].map((partner, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-400 shrink-0 cursor-default select-none">
                                        <span className="material-symbols-outlined text-3xl">{partner.icon}</span>
                                        <span className="text-2xl font-bold tracking-tight whitespace-nowrap">{partner.name}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom: Split layout - full width */}
                <div className="px-[100px] py-12 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Kid on left + Color wheel on right */}
                        <div className="relative flex items-center justify-center min-h-[560px]">
                            {/* Background grid pattern - more visible */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 69px, #94a3b8 69px, #94a3b8 70px), repeating-linear-gradient(90deg, transparent, transparent 69px, #94a3b8 69px, #94a3b8 70px)', backgroundSize: '70px 70px' }} />
                            
                            {/* Animated spinning color wheel - right side - jello colors */}
                            <div className="absolute right-[2%] lg:right-[15%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[460px] md:h-[460px] animate-spin-slow z-0">
                                <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(from 0deg, #ff9a9e, #fecfef, #ff9a9e, #a1c4fd, #c2e9fb, #a1c4fd, #fdfbfb, #ebedee, #fdfbfb, #ff9a9e)' }}>
                                    {/* Inner white to create ring effect */}
                                    <div className="absolute inset-[15%] rounded-full bg-white" />
                                </div>
                            </div>
                            
                            {/* Boy image - positioned on the left, overlapping the ring slightly */}
                            <div className="relative z-10 mr-auto ml-0 lg:-mr-10">
                                <Image
                                    src="/kid-new.png"
                                    alt="Excited student jumping"
                                    width={440}
                                    height={540}
                                    className="object-contain drop-shadow-2xl max-h-[520px] w-auto mix-blend-multiply"
                                />
                            </div>
                            
                            {/* Decorative scroll icon */}
                            <div className="absolute bottom-2 left-4 w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 bg-white/80 backdrop-blur-sm z-10">
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Right: Text + Dashboard mockups */}
                        <div className="flex flex-col gap-8">
                            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-slate-800 leading-[1.2]">
                                <span className="font-extrabold text-primary">Bloomncuddles</span> is the most powerful, easiest, and customizable school management{" "}
                                <span className="font-extrabold text-slate-900">software.</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-5 mt-2">
                                {/* Card 1 - Students */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                            <span className="text-[10px] text-slate-400 ml-3 font-medium">bloomncuddles.com</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">groups</span>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
                                                <p className="text-xl font-extrabold text-slate-900">1,740</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <span className="text-[9px] text-slate-400 font-bold">New Admissions</span>
                                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">34</span>
                                        </div>
                                        <div className="flex items-end gap-1.5 h-24">
                                            {[40, 65, 45, 80, 55, 75, 90, 60, 70, 50, 85, 65].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h}%`, backgroundColor: i === 6 ? '#486fa1' : 'rgba(72, 111, 161, 0.15)' }} />
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
                                                <span key={i} className="text-[7px] text-slate-300 font-bold flex-1 text-center">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 - Analytics */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                            <span className="text-[10px] text-slate-400 ml-3 font-medium">analytics</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">monitoring</span>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Revenue</p>
                                                <p className="text-xl font-extrabold text-slate-900">{'\u20A6'}59,882</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-5 mt-2">
                                            <div className="text-center">
                                                <svg width="64" height="64" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#486fa1" strokeWidth="3.5" strokeDasharray="66 22" strokeDashoffset="25" strokeLinecap="round"/>
                                                </svg>
                                                <p className="text-[8px] text-slate-400 font-bold mt-1">Students</p>
                                            </div>
                                            <div className="text-center">
                                                <svg width="64" height="64" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#ed5667" strokeWidth="3.5" strokeDasharray="55 33" strokeDashoffset="25" strokeLinecap="round"/>
                                                </svg>
                                                <p className="text-[8px] text-slate-400 font-bold mt-1">Revenue</p>
                                            </div>
                                            <div className="text-center">
                                                <svg width="64" height="64" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="50 38" strokeDashoffset="25" strokeLinecap="round"/>
                                                </svg>
                                                <p className="text-[8px] text-slate-400 font-bold mt-1">Growth</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ===== FEATURES - Bento grid ===== */}
            <section className="py-28 bg-white relative overflow-hidden" id="features">
                <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            Core Platform
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Designed for the<br />Modern Classroom
                        </h2>
                        <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">Empowering teachers while protecting students with a secure, playful environment built on early development principles.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: 'supervisor_account', title: 'Teacher Control', desc: 'Full oversight of digital content and learning paths. Curate what your students see and track their progress in real-time.', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
                            { icon: 'no_accounts', title: 'No Login for Kids', desc: 'Zero friction access for children. Keep it safe with unique classroom QR codes that eliminate the need for personal data.', color: 'bg-rose-500', lightColor: 'bg-rose-50', textColor: 'text-rose-600' },
                            { icon: 'sports_esports', title: 'Interactive Games', desc: 'Engaging, curriculum-aligned activities that make learning fun. From phonics to mindfulness, built to delight and educate.', color: 'bg-violet-500', lightColor: 'bg-violet-50', textColor: 'text-violet-600' }
                        ].map((feature, i) => (
                            <div key={i} className="group relative bg-white p-10 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                                {/* Subtle colored accent */}
                                <div className={`absolute top-0 left-0 w-full h-1 ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className={`size-16 rounded-2xl ${feature.lightColor} ${feature.textColor} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Learn more <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS - New Design ===== */}
            <section className="py-24 bg-white relative overflow-hidden" id="how-it-works">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="bg-[#eff3fc] rounded-[40px] p-6 md:p-10 lg:p-14 shadow-[0_20px_60px_-15px_rgba(200,210,240,0.6)]">
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Left Side: Floating Collage Vector Style */}
                            <div className="relative min-h-[500px] lg:h-[650px] w-full order-last lg:order-first">
                                {/* Wrap inner elements in a scaling div for mobile */}
                                <div className="absolute inset-0 origin-top transform scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 lg:origin-center flex justify-center lg:block">
                                    {/* Top Left: Dashboard UI Card */}
                                <div className="absolute top-4 left-6 w-[260px] bg-white rounded-2xl p-4 shadow-sm border border-slate-200 z-10 hover:-translate-y-2 transition-transform duration-500">
                                    {/* Floating Sidebar */}
                                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-12 py-4 bg-[#262626] rounded-[20px] flex flex-col items-center gap-4 text-white shadow-lg">
                                        <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                                        <div className="bg-[#6345FF] px-1.5 py-1 rounded-[10px] font-bold text-[10px] flex items-center justify-center shadow-md border border-[#7a60ff]">
                                            Ai <span className="material-symbols-outlined text-[10px] ml-0.5">smart_toy</span>
                                        </div>
                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                                    </div>

                                    {/* Content */}
                                    <div className="ml-4">
                                        {/* Header: Avatar + Line */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                                <Image src="/student-details.png" width={32} height={32} alt="Student" className="object-cover" />
                                            </div>
                                            <div className="text-[13px] font-bold text-slate-700">Student</div>
                                            <div className="w-full h-px bg-slate-200 ml-2 mt-1"></div>
                                        </div>

                                        {/* Charts Box */}
                                        <div className="border border-slate-200 rounded-xl p-4 mb-4 flex flex-col items-center">
                                            {/* Top row: 3 charts */}
                                            <div className="flex justify-between items-center w-full mb-6">
                                                {/* Pie Chart */}
                                                <div className="w-10 h-10 rounded-full bg-[#f0efff] relative overflow-hidden flex-shrink-0 border-2 border-white">
                                                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#6345FF]"></div>
                                                </div>
                                                {/* Small Ring 67% */}
                                                <div className="w-8 h-8 rounded-full border-[3px] border-[#f0efff] border-t-[#6345FF] relative flex items-center justify-center">
                                                    <span className="text-[6px] font-bold text-[#6345FF]">67%</span>
                                                </div>
                                                {/* Small Ring 56% */}
                                                <div className="w-8 h-8 rounded-full border-[3px] border-[#f0efff] border-t-[#6345FF] border-r-[#6345FF] relative flex items-center justify-center">
                                                    <span className="text-[6px] font-bold text-[#6345FF]">56%</span>
                                                </div>
                                            </div>
                                            {/* Large Donut */}
                                            <div className="w-[100px] h-[100px] rounded-full border-[10px] border-[#f0efff] border-l-[#6345FF] border-b-[#6345FF] transform -rotate-45"></div>
                                        </div>

                                        {/* Progress Bars Box */}
                                        <div className="border border-slate-200 rounded-xl p-4">
                                            <div className="relative mb-4 pt-4">
                                                <div className="absolute right-0 top-0 text-[#6345FF] text-[10px] font-bold">75%</div>
                                                <div className="w-full bg-[#f0efff] rounded-full h-2">
                                                    <div className="bg-[#6345FF] h-2 rounded-full w-[75%] relative">
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#6345FF] rounded-full flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-[#f0efff] rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-[#f0efff] rounded-full h-2"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right: Purple image card */}
                                <div className="absolute top-0 right-10 w-[360px] h-[360px] bg-[#6345FF] rounded-[40px] overflow-hidden shadow-lg z-0 hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0">
                                        {/* Conic Gradient Ring Element */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border-[16px] border-transparent" style={{background: 'linear-gradient(#6345FF, #6345FF) padding-box, conic-gradient(from 0deg, #fef08a, #f97316, #ec4899, #3b82f6, #fef08a) border-box'}} />
                                        
                                        <Image src="/kid-new.png" width={360} height={360} alt="Student" className="object-cover relative z-10 grayscale mix-blend-screen opacity-100" />
                                    </div>
                                    
                                    {/* Satisfaction badge */}
                                    <div className="absolute bottom-12 -right-2 bg-white rounded-xl p-3 shadow-2xl flex items-center gap-4 z-30 transform -translate-x-6">
                                        <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center text-white shrink-0">
                                            <span className="material-symbols-outlined">mood</span>
                                        </div>
                                        <div className="pr-4">
                                            <div className="font-extrabold text-[20px] text-slate-900 leading-none mb-1">99.8%</div>
                                            <div className="text-[12px] text-slate-500 font-medium">User Satisfaction</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Left: Black card */}
                                <div className="absolute bottom-6 left-12 w-[280px] bg-[#222222] rounded-[32px] p-8 shadow-2xl z-20 text-white flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-500">
                                    <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border-[14px] border-[#333333]"></div>
                                        {/* Purple progress SVGs */}
                                        <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full transform -rotate-90">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6345FF" strokeWidth="3" strokeDasharray="78, 100" />
                                        </svg>
                                        <span className="font-light text-5xl tracking-tight relative">78%</span>
                                    </div>
                                    <p className="text-[13px] text-slate-300 font-medium leading-[1.6]">
                                        Avarage revenew growth for per succesful implementation
                                    </p>
                                </div>

                                {/* Bottom Right: Pills */}
                                <div className="absolute bottom-4 right-0 lg:bottom-16 lg:right-16 flex flex-col items-center justify-center gap-5 z-10 w-full lg:w-auto mt-[600px] lg:mt-0 pb-10 lg:pb-0">
                                    <div className="bg-[#6345FF] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer relative top-2">100% Free Forever</div>
                                    <div className="bg-[#222222] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer relative z-10 lg:right-8">Instant Insights</div>
                                    <div className="bg-[#6345FF] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer relative lg:-left-4">Limitless Scale</div>
                                </div>
                                </div> {/* End scale wrapper */}
                            </div>

                            {/* Right Side: Text Card */}
                            <div className="bg-white rounded-[32px] p-8 md:p-10 lg:p-14 shadow-xl border border-slate-100 z-10 relative">
                                <div className="inline-block bg-[#f0efff] text-[#6345FF] font-bold text-[11px] px-4 py-2 rounded-full mb-8 tracking-wide">
                                    How It Works
                                </div>
                                
                                <h2 className="text-4xl lg:text-[44px] font-medium text-slate-800 leading-[1.15] mb-12 tracking-tight">
                                    <span className="font-extrabold text-[#1a1c23]">Bloomncuddles</span> is a revolution in early years <span className="font-extrabold text-[#1a1c23]">education</span>
                                </h2>

                                <div className="space-y-10">
                                    {/* Item 1 */}
                                    <div className="flex gap-6 group">
                                        <div className="shrink-0 mt-1">
                                            <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#6345FF] group-hover:text-white group-hover:border-[#6345FF] transition-all duration-300 shadow-sm">
                                                <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-[#1a1c23] text-[19px] mb-2">Set Up Classroom</h4>
                                            <p className="text-slate-500 text-[15px] leading-relaxed">
                                                Teachers create their digital classroom and select curriculum goals from our extensive library in minutes. Customize learning paths tailored to early years development, ensuring every child receives the attention they need.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="flex gap-6 group">
                                        <div className="shrink-0 mt-1">
                                            <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#6345FF] group-hover:text-white group-hover:border-[#6345FF] transition-all duration-300 shadow-sm">
                                                <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-[#1a1c23] text-[19px] mb-2">Instant Access</h4>
                                            <p className="text-slate-500 text-[15px] leading-relaxed">
                                                Students join by scanning a secure wall-mounted QR code. No emails, no passwords, just learning. This frictionless entry empowers even the youngest learners to start their educational journey independently and safely.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="flex gap-6 group">
                                        <div className="shrink-0 mt-1">
                                            <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#6345FF] group-hover:text-white group-hover:border-[#6345FF] transition-all duration-300 shadow-sm">
                                                <span className="material-symbols-outlined text-[24px]">favorite</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-[#1a1c23] text-[19px] mb-2">Bloom & Cuddle</h4>
                                            <p className="text-slate-500 text-[15px] leading-relaxed">
                                                Balance digital activity with physical wellness reminders and guided group bonding exercises. Our platform actively prompts screen breaks, encouraging offline play, mindfulness, and social interaction among peers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== STAND OUT PROMO - Dark Design ===== */}
            <section className="py-24 bg-white relative overflow-hidden" id="stand-out">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="bg-primary rounded-[40px] p-10 lg:p-16 shadow-2xl relative overflow-hidden">
                        
                        {/* Background subtle vector shapes */}
                        <div className="absolute top-0 right-1/4 w-[400px] h-[800px] bg-white/5 transform skew-x-[-15deg] origin-top-right z-0"></div>
                        <div className="absolute -top-10 right-[10%] w-[300px] h-full bg-white/5 transform skew-x-[-15deg] origin-top-right z-0"></div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                            
                            {/* Left Side: Text and Checkmarks */}
                            <div className="text-white">
                                <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
                                    Why Bloomncuddles<br/>Stands Out
                                </h2>
                                
                                {/* Curvy Arrow Vector (Decorative) */}
                                <div className="hidden lg:block absolute top-[10%] left-[45%] opacity-60">
                                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 12.5C12 5 25 2 38 6C51 10 55 20 57.5 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M48 25L57.5 28L55 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>

                                <p className="text-slate-300 text-[15px] leading-relaxed mb-8 max-w-md">
                                    Designed exclusively for early years education, Bloomncuddles provides a safe, ad-free environment that balances digital learning with physical wellness—putting your child&apos;s holistic development first.
                                </p>

                                <ul className="space-y-4 mb-16">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-white text-xl shrink-0">check</span>
                                        <span className="text-[13px] font-bold text-white/90 leading-tight pt-1">100% Ad-Free, secure, and COPPA compliant</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-white text-xl shrink-0">check</span>
                                        <span className="text-[13px] font-bold text-white/90 leading-tight pt-1">Pedagogically aligned curriculum for early learners</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-white text-xl shrink-0">check</span>
                                        <span className="text-[13px] font-bold text-white/90 leading-tight pt-1">Interactive play combined with built-in screen breaks</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-white text-xl shrink-0">check</span>
                                        <span className="text-[13px] font-bold text-white/90 leading-tight pt-1">Real-time growth milestones for parents and educators</span>
                                    </li>
                                </ul>

                                {/* CTA Bottom Row */}
                                <div className="flex flex-wrap items-center gap-10">
                                    <button className="bg-[#ed5667] hover:bg-[#d64958] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-lg hover:-translate-y-1 transform duration-300">
                                        Sign Up Now
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Floating Collage */}
                            <div className="relative h-[650px] w-full mt-10 lg:mt-0">
                                {/* Base Image of Teacher */}
                                <div className="absolute bottom-0 right-10 lg:right-20 w-[400px] h-[550px] z-10 drop-shadow-2xl">
                                    <Image src="/teacher_laptop.png" fill alt="Teacher using laptop" className="object-contain object-bottom" />
                                </div>

                                {/* Top Floating Badge: Data Security */}
                                <div className="absolute top-16 right-32 bg-[#1a1c23] border border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2 z-20 shadow-xl opacity-90 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-emerald-400 text-[14px]">child_care</span>
                                    <span className="text-[10px] text-white font-bold">child safe</span>
                                </div>
                                
                                {/* Line connecting badges */}
                                <svg className="absolute top-16 right-32 w-48 h-24 stroke-white/20 fill-none z-0" viewBox="0 0 200 100">
                                    <polyline points="20,80 20,40 180,40 180,20" strokeWidth="1" strokeDasharray="3,3" />
                                    <circle cx="20" cy="80" r="3" className="fill-white/30" />
                                    <circle cx="180" cy="20" r="3" className="fill-white/30" />
                                </svg>

                                {/* Left Badge: COPPA */}
                                <div className="absolute top-[30%] left-0 lg:-left-12 bg-[#ed5667] rounded-[16px] p-4 flex items-center gap-4 z-20 shadow-2xl hover:scale-105 transition-transform">
                                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-sm">shield</span>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-[14px] leading-tight">COPPA</div>
                                        <div className="text-white/90 text-[12px]">compliant</div>
                                    </div>
                                </div>

                                {/* Right Badge: Ad-Free */}
                                <div className="absolute top-[40%] -right-4 lg:-right-10 bg-white rounded-[16px] p-5 w-[160px] shadow-2xl z-20 hover:scale-105 transition-transform">
                                    <div className="w-8 h-8 rounded-full bg-[#ffe8eb] flex items-center justify-center mb-3">
                                        <span className="material-symbols-outlined text-[#ed5667] text-sm">verified</span>
                                    </div>
                                    <div className="text-[10.5px] font-bold text-slate-800 leading-[1.4]">
                                        100% Ad-Free,<br/>Teacher Approved<br/>& Built for Growth
                                    </div>
                                </div>

                                {/* Bottom Left Deco Shapes */}
                                <div className="absolute bottom-[35%] left-10 z-0">
                                    <div className="w-5 h-5 rounded-full bg-[#ed5667] mb-2 opacity-80"></div>
                                    <div className="w-20 h-6 rounded-full bg-[#ed5667] ml-4 opacity-80"></div>
                                </div>

                                {/* Bottom Right Circle Deco */}
                                <div className="absolute bottom-1/4 right-[25%] w-8 h-8 rounded-full border border-white/20 flex items-center justify-center z-20">
                                    <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMPREHENSIVE FEATURES - Scrollable Cards ===== */}
            <section className="py-24 bg-primary relative overflow-hidden" id="features-showcase">
                {/* Background subtle patterns */}
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>

                <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-block bg-white/10 backdrop-blur-sm text-white font-bold text-[11px] px-6 py-2.5 rounded-full mb-8 tracking-widest uppercase border border-white/20">
                            Single Stop Solution
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight tracking-tight max-w-3xl mx-auto">
                            Comprehensive Features for Every Need in Early Years Education
                        </h2>
                    </div>

                    {/* Scrollable Feature Cards - Infinite Marquee */}
                    <style>{`
                        @keyframes infiniteScroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-infinite-scroll {
                            animation: infiniteScroll 40s linear infinite;
                            width: max-content;
                        }
                        .animate-infinite-scroll:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
                    
                    <div className="overflow-hidden pb-12 -mx-6 px-6">
                        <div className="animate-infinite-scroll flex gap-8">
                            {[
                                { title: "Digital Classrooms", desc: "Create and manage vibrant digital classrooms tailored to early years curricula in minutes.", img: "/feature_classrooms_v2.png" },
                                { title: "QR Code Access", desc: "Students join instantly by scanning a secure wall-mounted QR code. No emails, no passwords needed.", img: "/feature_qrcode_v2.png" },
                                { title: "Growth Tracking", desc: "Monitor every child's developmental milestones with real-time analytics and visual progress reports.", img: "/feature_growth_v2.png" },
                                { title: "Wellness Reminders", desc: "Automatic screen-break prompts encourage physical play, mindfulness, and healthy habits throughout the day.", img: "/feature_wellness_v2.png" },
                                { title: "Parent Dashboard", desc: "Parents stay connected with real-time updates on their child's learning journey, milestones, and daily activities.", img: "/feature_parents_v2.png" },
                                // Duplicated for seamless infinite scroll
                                { title: "Digital Classrooms", desc: "Create and manage vibrant digital classrooms tailored to early years curricula in minutes.", img: "/feature_classrooms_v2.png" },
                                { title: "QR Code Access", desc: "Students join instantly by scanning a secure wall-mounted QR code. No emails, no passwords needed.", img: "/feature_qrcode_v2.png" },
                                { title: "Growth Tracking", desc: "Monitor every child's developmental milestones with real-time analytics and visual progress reports.", img: "/feature_growth_v2.png" },
                                { title: "Wellness Reminders", desc: "Automatic screen-break prompts encourage physical play, mindfulness, and healthy habits throughout the day.", img: "/feature_wellness_v2.png" },
                                { title: "Parent Dashboard", desc: "Parents stay connected with real-time updates on their child's learning journey, milestones, and daily activities.", img: "/feature_parents_v2.png" }
                            ].map((feat, idx) => (
                                <div key={idx} className="w-[400px] md:w-[600px] flex-shrink-0 group">
                                    <div className="bg-[#3d2d7a] rounded-[40px] overflow-hidden mb-8 h-[400px] md:h-[600px] w-full relative hover:scale-[1.02] transition-transform duration-500 shadow-2xl border border-white/5">
                                        <Image src={feat.img} fill alt={feat.title} className="object-cover" />
                                        {/* Floating Arrow */}
                                        <div className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl">
                                            <span className="material-symbols-outlined text-primary text-2xl">north_east</span>
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold text-2xl mb-3">{feat.title}</h4>
                                    <p className="text-slate-300 text-[16px] leading-relaxed max-w-[90%]">
                                        {feat.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS - Modern glassmorphism ===== */}
            <section className="py-28 bg-white relative overflow-hidden" id="testimonials">
                <div className="absolute top-0 left-0 w-full h-px bg-slate-100" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 text-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-secondary/10">
                            <span className="material-symbols-outlined text-sm">reviews</span>
                            Testimonials
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Loved by Educators</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: 'Bloomncuddles has completely transformed how we manage our curriculum. The children love the interface and I love the data insights.', name: 'Maria Rodriguez', role: 'Lead Educator, Sunny Day Preschool', emoji: '👩‍🏫', accent: 'border-blue-200 hover:border-blue-300' },
                            { quote: 'The security features are top-notch. Knowing that our student data is protected while they enjoy high-quality content is invaluable.', name: 'James Wilson', role: 'Program Director, Urban Montessori', emoji: '👨‍💼', accent: 'border-emerald-200 hover:border-emerald-300' },
                            { quote: 'The wellness reminders are a game changer. It helps us keep a healthy balance between digital exploration and physical activity.', name: 'Sarah Jenkins', role: 'Early Years Specialist', emoji: '👩‍🏫', accent: 'border-violet-200 hover:border-violet-300' }
                        ].map((t, i) => (
                            <div key={i} className={`group p-8 rounded-3xl bg-white border-2 ${t.accent} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
                                {/* Quotation mark */}
                                <div className="absolute -top-2 -left-1 text-[80px] font-serif text-slate-100 leading-none select-none pointer-events-none">&ldquo;</div>
                                <div className="flex text-secondary mb-6 relative z-10">
                                    {[...Array(5)].map((_, j) => <span key={j} className="material-symbols-outlined text-lg">star</span>)}
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-8 relative z-10 text-[15px]">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm shrink-0">
                                        {t.emoji}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{t.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING - With toggle ===== */}
            <section className="py-28 bg-slate-50 relative" id="pricing">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10">
                            <span className="material-symbols-outlined text-sm">payments</span>
                            Pricing
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">Simple, Transparent Pricing</h2>
                        <p className="text-slate-500 mb-10">Choose the plan that fits your classroom or center&apos;s needs.</p>

                        {/* Toggle */}
                        <div className="inline-flex items-center bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
                            <button onClick={() => setActivePlan('monthly')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activePlan === 'monthly' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-700'}`}>Monthly</button>
                            <button onClick={() => setActivePlan('yearly')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activePlan === 'yearly' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-700'}`}>
                                Yearly
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Save 17%</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Basic */}
                        <div className="group bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-extrabold text-slate-900">{activePlan === 'monthly' ? '₦5,000' : '₦50,000'}</span>
                                <span className="text-slate-400">/{activePlan === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-8">Perfect for individual classrooms</p>
                            <ul className="space-y-4 mb-10 flex-1">
                                {['Up to 100 Students', 'Basic Analytics', 'Email Support'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className="text-center w-full py-4 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300">Start Free Trial</Link>
                        </div>

                        {/* Premium */}
                        <div className="group bg-primary p-10 rounded-3xl shadow-2xl shadow-primary/20 relative flex flex-col transform md:-translate-y-4 text-white border-2 border-primary hover:-translate-y-5 transition-all duration-300">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-secondary/30">MOST POPULAR</div>
                            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined">workspace_premium</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Premium</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-extrabold">{activePlan === 'monthly' ? '₦10,000' : '₦100,000'}</span>
                                <span className="text-white/50">/{activePlan === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>
                            <p className="text-sm text-white/60 mb-8">For growing learning centers</p>
                            <ul className="space-y-4 mb-10 flex-1">
                                {['Unlimited Students & Teachers', 'Advanced Analytics & Reports', 'Priority Support 24/7'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/90 text-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg">check_circle</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className="text-center w-full py-4 rounded-2xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">Get Started</Link>
                        </div>

                        {/* Enterprise */}
                        <div className="group bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined">corporate_fare</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-extrabold text-slate-900">{activePlan === 'monthly' ? '₦20,000' : '₦200,000'}</span>
                                <span className="text-slate-400">/{activePlan === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-8">For large organizations</p>
                            <ul className="space-y-4 mb-10 flex-1">
                                {['Everything in Premium', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Guarantee'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/contact" className="text-center w-full py-4 rounded-2xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all duration-300">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CURRICULUM - Hover overlays ===== */}
            <section className="py-28 bg-white" id="curriculum">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10">
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            Curriculum
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">Our Holistic Curriculum</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Expertly crafted modules that bridge the gap between academic foundation and emotional well-being.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { img: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&h=400&fit=crop', title: 'Phonics & Language', desc: 'Building strong literacy foundations through interactive storytelling.', color: 'from-blue-600' },
                            { img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop', title: 'Early Maths', desc: 'Numerical concepts through play-based discovery and reasoning.', color: 'from-emerald-600' },
                            { img: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop', title: 'Wellness', desc: 'Guided mindfulness and physical activity for little minds.', color: 'from-violet-600' },
                            { img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop', title: 'Creative Arts', desc: 'Self-expression through digital painting and imaginative play.', color: 'from-rose-600' }
                        ].map((c, i) => (
                            <div key={i} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <Image src={c.img} alt={c.title} width={400} height={300} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    {/* Hover overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${c.color}/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5`}>
                                        <p className="text-white text-sm font-medium">{c.desc}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{c.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEWSLETTER - Modern ===== */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary rounded-full blur-[120px]" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary rounded-full blur-[100px]" />
                        </div>
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Stay Updated on Early Years Education</h3>
                            <p className="text-slate-400 font-medium">Get monthly tips and curriculum updates delivered to your inbox.</p>
                        </div>
                        <form className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-md">
                            <label className="sr-only" htmlFor="test-newsletter-email">Email Address</label>
                            <input id="test-newsletter-email" className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-primary focus:border-primary text-white outline-none placeholder-white/30" placeholder="Your email address" type="email" />
                            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap" type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-28 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center flex flex-col items-center">
                        {/* Background blobs */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
                        </div>
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-dots" />

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 max-w-3xl relative z-10 leading-[1.1]">
                            Ready to transform your early years classroom?
                        </h2>
                        <p className="text-white/70 text-xl mb-12 max-w-xl relative z-10 font-medium leading-relaxed">
                            Join hundreds of innovative schools and childcare centers. Get early access to the Bloomncuddles platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                            <Link href="/register" className="group bg-white text-primary px-10 py-5 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                Get Started Free
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                            <Link href="/contact" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 transition-all">
                                Talk to Sales
                            </Link>
                        </div>
                        <p className="mt-10 text-white/40 text-sm font-medium relative z-10">
                            No credit card required • GDPR Compliant • COPPA Secure
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
