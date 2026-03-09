"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-[#0f2854] h-[600px] flex items-center">
                {/* Background Pattern Anchored to Left */}
                <div 
                    className="absolute z-0 opacity-30 mix-blend-screen pointer-events-none"
                    style={{
                        backgroundImage: 'url(/hero-grid-pattern.png)',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'auto 100%',
                        inset: '0 auto 0 0',
                        width: '55%'
                    }}
                />
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 text-white/90 text-[11px] font-medium tracking-wide mb-8 lg:mb-10 border border-white/5 shadow-sm">
                        Our Mission: Education Without Barriers
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-[72px] font-bold text-white mb-8 lg:mb-10 tracking-tight leading-[1.05]">
                        Building the Future <span className="font-light text-white/90">of Early</span><br />
                        <span className="font-bold">Education</span>
                    </h1>
                    
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-white/90 leading-[1.7] max-w-4xl mx-auto font-medium">
                        We started Bloomncuddles with a simple, yet powerful idea: <span className="text-[#486fa1]">to give every educator and child access to a safe, joyful, and holistic digital learning experience.</span><br />
                        This commitment drives our innovation, security, and child-centered focus every single day.
                    </p>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 bg-white border-t border-navy/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4">Our Method</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-6">
                            Our Philosophy
                        </h2>
                        <p className="text-lg text-navy/60 leading-relaxed max-w-2xl mx-auto">
                            We believe in creating a digital environment that is accessible, simple, and focused entirely on the child&apos;s growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'spa', title: 'Simplicity', desc: 'Intuitive tools designed for teachers and tiny hands alike, ensuring technology never gets in the way of learning.', color: 'text-primary', bg: 'bg-primary/10' },
                            { icon: 'public', title: 'Inclusivity', desc: 'African-friendly design ensuring representation and accessibility for every child, celebrating diverse cultures.', color: 'text-secondary', bg: 'bg-secondary/10' },
                            { icon: 'face', title: 'Child-Centered', desc: "Curriculum-aligned content that puts the learner's journey first, fostering curiosity and engagement.", color: 'text-primary', bg: 'bg-primary/10' }
                        ].map((item, i) => (
                            <div key={i} className="group p-10 bg-ice/10 hover:bg-white rounded-3xl border border-transparent hover:border-navy/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                <div className={`size-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-navy mb-4">{item.title}</h3>
                                <p className="text-navy/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 bg-ice/15 relative overflow-hidden">
                <div className="absolute top-10 right-10 text-primary/5 select-none hidden lg:block">
                    <span className="material-symbols-outlined text-[160px]">history_edu</span>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-slate-100 mt-8">
                                        <Image 
                                            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=400&fit=crop"
                                            alt="Children in classroom"
                                            width={300}
                                            height={400}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                                        <Image 
                                            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&h=300&fit=crop"
                                            alt="Happy students"
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                                        <Image 
                                            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=300&fit=crop"
                                            alt="Teacher with students"
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="aspect-[4/5] rounded-3xl bg-primary flex flex-col items-center justify-center text-white p-8 text-center shadow-lg">
                                        <span className="material-symbols-outlined text-5xl mb-4">volunteer_activism</span>
                                        <h4 className="text-xl font-bold mb-2">Our Growth</h4>
                                        <p className="text-white/80 text-sm">Serving thousands of schools across Africa since 2020.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="order-1 lg:order-2">
                            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our History</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-8">
                                The Story Behind the Platform
                            </h2>
                            <div className="space-y-6 text-lg text-navy/60 leading-relaxed">
                                <p>
                                    Bloomncuddles was born from a simple belief: every child deserves access to safe, engaging, and effective digital learning tools.
                                </p>
                                <p>
                                    Founded by parents and educators, we understand the challenges of balancing screen time with meaningful learning experiences. That&apos;s why we built a platform where teachers have full control, parents stay informed, and children learn through play.
                                </p>
                                <p>
                                    Today, we&apos;re proud to serve thousands of schools across Africa and beyond, making premium early-years education accessible to all corners of the globe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Values Section -> Animated Timeline */}
            <section className="py-24 bg-white border-y border-navy/5 overflow-hidden">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Core Principles</span>
                        <h2 className="text-4xl font-extrabold text-navy mb-4">
                            What Drives Us
                        </h2>
                    </div>
                    
                    <div className="relative border-l-4 border-slate-200 ml-8 md:ml-12 pl-10">
                        {[
                            { icon: 'lightbulb', title: 'The Visionary Spark', desc: 'It started with a simple belief: every child deserves access to safe, engaging, and effective digital learning tools.' },
                            { icon: 'rocket_launch', title: 'The Global Debut', desc: 'Launching the platform with core holistic and phonics features to eager classrooms around the world.' },
                            { icon: 'public', title: 'First Global Footprint', desc: 'Partnering with hundreds of early-education centers, establishing our impact internationally.' },
                            { icon: 'trending_up', title: 'Viral Growth', desc: 'A rapid expansion period driven by organic educator recommendations and high parental satisfaction.' },
                            { icon: 'hub', title: 'The Ecosystem Expands', desc: 'Growing from a tool into a full curriculum ecosystem, including parental dashboards, wellness tracking, and more.' }
                        ].map((value, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className="relative flex flex-col mb-16 last:mb-0"
                            >
                                {/* Left Track Icon */}
                                <div className="absolute -left-[75px] top-0 size-[54px] bg-primary text-white rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(99,69,255,0.4)] border-4 border-white transition-transform duration-300 hover:scale-110">
                                    <span className="material-symbols-outlined text-2xl">{value.icon}</span>
                                </div>
                                
                                <div className="w-full xl:w-4/5 pt-1">
                                    <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all border border-slate-100 relative group overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                                        <h3 className="text-2xl font-extrabold text-slate-800 mb-3">{value.title}</h3>
                                        <p className="text-slate-500 text-lg leading-relaxed">{value.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#486fa1] relative overflow-hidden flex items-center min-h-[500px]">
                <div 
                    className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none"
                    style={{ 
                        backgroundImage: 'url(/hero-grid-pattern.png)', 
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'auto 100%',
                        width: '50%'
                    }}
                />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl font-extrabold text-white mb-6">
                        Ready to Transform Your Classroom?
                    </h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        Join the schools already using Bloomncuddles to enhance early childhood education with ease, security, and inclusivity.
                    </p>
                    <Link 
                        href="/register" 
                        className="inline-flex h-14 items-center justify-center bg-[#0f2854] text-lg font-bold text-white shadow-xl shadow-navy/20 transition-all hover:shadow-2xl hover:shadow-navy/40 px-[15px] py-[15px] rounded-[6px]"
                    >
                        Join the Platform
                    </Link>
                </div>
            </section>
        </div>
    );
}
