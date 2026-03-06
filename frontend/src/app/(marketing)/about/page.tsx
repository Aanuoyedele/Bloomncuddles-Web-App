import Image from "next/image";
import Link from "next/link";
import AboutHeroSlider from "@/components/AboutHeroSlider";

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden bg-ice/20">
                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 text-secondary/20 select-none hidden lg:block">
                    <span className="material-symbols-outlined text-6xl">school</span>
                </div>
                <div className="absolute bottom-20 right-10 text-primary/20 select-none hidden lg:block">
                    <span className="material-symbols-outlined text-7xl">psychology</span>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit mb-6">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Our Mission
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy mb-6 tracking-tight leading-[1.1]">
                                Empowering early years and primary <span className="text-primary">education</span>
                            </h1>
                            <p className="text-lg md:text-xl text-navy/60 leading-relaxed max-w-xl">
                                We're building a safe, teacher-led digital learning platform that balances structured curriculum with child wellness and mental health.
                            </p>
                        </div>
                        
                        <AboutHeroSlider />
                    </div>
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
                            We believe in creating a digital environment that is accessible, simple, and focused entirely on the child's growth.
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
                                    Founded by parents and educators, we understand the challenges of balancing screen time with meaningful learning experiences. That's why we built a platform where teachers have full control, parents stay informed, and children learn through play.
                                </p>
                                <p>
                                    Today, we're proud to serve thousands of schools across Africa and beyond, making premium early-years education accessible to all corners of the globe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Values Section */}
            <section className="py-24 bg-white border-y border-navy/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Core Principles</span>
                        <h2 className="text-4xl font-extrabold text-navy mb-4">
                            What Drives Us
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'shield', title: 'Safety First', desc: 'Every feature is designed with child safety at the forefront.' },
                            { icon: 'favorite', title: 'Love for Learning', desc: 'Making education inherently enjoyable and accessible.' },
                            { icon: 'groups', title: 'Community', desc: 'Building strong bonds between teachers, parents, and students.' },
                            { icon: 'lightbulb', title: 'Innovation', desc: 'Constantly evolving to meet dynamic educational needs.' }
                        ].map((value, i) => (
                            <div key={i} className="text-center group">
                                <div className="size-20 bg-ice/15 border border-navy/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                    <span className="material-symbols-outlined text-3xl text-navy/40 group-hover:text-white transition-colors">{value.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-navy mb-3">{value.title}</h3>
                                <p className="text-navy/60">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-ice/10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-navy mb-6">
                        Ready to Transform Your Classroom?
                    </h2>
                    <p className="text-lg text-navy/60 mb-10 max-w-2xl mx-auto">
                        Join the schools already using Bloomncuddles to enhance early childhood education with ease, security, and inclusivity.
                    </p>
                    <Link 
                        href="/register" 
                        className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30"
                    >
                        Join the Platform
                    </Link>
                </div>
            </section>
        </div>
    );
}
