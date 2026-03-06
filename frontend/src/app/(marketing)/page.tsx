import Image from "next/image";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden bg-ice/20">
                <AnimatedBackground />
                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 text-secondary/20 select-none hidden lg:block z-10">
                    <span className="material-symbols-outlined text-6xl">star</span>
                </div>
                <div className="absolute bottom-20 right-10 text-primary/20 select-none hidden lg:block z-10">
                    <span className="material-symbols-outlined text-7xl">menu_book</span>
                </div>
                <div className="absolute top-40 right-1/4 text-secondary/10 select-none hidden lg:block">
                    <span className="material-symbols-outlined text-5xl">auto_awesome</span>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Trusted by 500+ Early Educators
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                                Nurturing Minds, <span className="text-primary">Empowering</span> Educators
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                                The early years digital learning platform designed for modern educators and curious young minds. Balance curriculum with care in one secure, playful environment.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/25 hover:translate-y-[-2px] transition-all text-center">
                                    Request Access
                                </Link>
                                <Link href="#how-it-works" className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all">
                                    <span className="material-symbols-outlined">play_circle</span>
                                    See how it works
                                </Link>
                            </div>
                        </div>
                        
                        <HeroSlider />
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-12 border-y border-navy/5 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by leading early learning centers</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {[
                            { icon: 'school', name: 'LittleSteps', color: 'text-primary' },
                            { icon: 'wb_sunny', name: 'BrightMinds', color: 'text-secondary' },
                            { icon: 'psychology', name: 'KindleCare', color: 'text-primary' },
                            { icon: 'eco', name: 'GreenLeaf', color: 'text-secondary' },
                            { icon: 'palette', name: 'ArtiePrep', color: 'text-primary' }
                        ].map((partner, i) => (
                            <div key={i} className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                                <span className={`material-symbols-outlined ${partner.color}`}>{partner.icon}</span> {partner.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-ice/15" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4">Core Platform</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Designed for the Modern Classroom</h2>
                        <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">Empowering teachers while protecting students with a secure, playful environment built on early development principles.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-10 bg-slate-50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">supervisor_account</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Teacher Control</h3>
                            <p className="text-slate-600 leading-relaxed">Full oversight of digital content and learning paths. Curate what your students see and track their progress in real-time with granular dashboard tools.</p>
                        </div>
                        <div className="group p-10 bg-slate-50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-300">
                            <div className="size-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">no_accounts</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Login for Kids</h3>
                            <p className="text-slate-600 leading-relaxed">Zero friction access for children. Keep data safe and private with unique classroom QR codes that eliminate the need for personal identifiable information.</p>
                        </div>
                        <div className="group p-10 bg-slate-50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">sports_esports</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Interactive Games</h3>
                            <p className="text-slate-600 leading-relaxed">Engaging, curriculum-aligned activities that make learning fun. From phonics to mindfulness, our games are built to delight and educate simultaneously.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-primary/10 relative overflow-hidden" id="how-it-works">
                <div className="absolute -right-20 top-40 text-primary/5 select-none hidden lg:block">
                    <span className="material-symbols-outlined text-[240px]">shapes</span>
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
                            <p className="text-slate-600 text-lg">Bloomncuddles integrates seamlessly into your daily classroom routine in three simple steps.</p>
                        </div>
                        <Link href="/about" className="text-primary font-bold flex items-center gap-2 group">
                            Explore Full Documentation
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="relative">
                            <div className="text-[120px] font-black text-primary/15 absolute -top-16 -left-4 leading-none select-none">01</div>
                            <div className="relative pt-8">
                                <h4 className="text-xl font-bold text-slate-900 mb-3">Set Up Classroom</h4>
                                <p className="text-slate-600">Teachers create their digital classroom and select curriculum goals from our extensive library in minutes.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="text-[120px] font-black text-primary/15 absolute -top-16 -left-4 leading-none select-none">02</div>
                            <div className="relative pt-8">
                                <h4 className="text-xl font-bold text-slate-900 mb-3">Instant Access</h4>
                                <p className="text-slate-600">Students join by scanning a secure wall-mounted QR code. No emails, no passwords, just learning.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="text-[120px] font-black text-primary/15 absolute -top-16 -left-4 leading-none select-none">03</div>
                            <div className="relative pt-8">
                                <h4 className="text-xl font-bold text-slate-900 mb-3">Bloom & Cuddle</h4>
                                <p className="text-slate-600">Balance digital activity with physical wellness reminders and guided group bonding exercises.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white" id="testimonials">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900">Loved by Educators</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                            <div className="flex text-secondary mb-4">
                                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
                            </div>
                            <p className="text-slate-600 italic mb-6">&ldquo;Bloomncuddles has completely transformed how we manage our curriculum. The children love the interface and I love the data insights.&rdquo;</p>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                    <span className="text-2xl mt-2 ml-1 block">👩‍🏫</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Maria Rodriguez</p>
                                    <p className="text-xs text-slate-500">Lead Educator, Sunny Day Preschool</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                            <div className="flex text-secondary mb-4">
                                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
                            </div>
                            <p className="text-slate-600 italic mb-6">&ldquo;The security features are top-notch. As a director, knowing that our student data is protected while they enjoy high-quality content is invaluable.&rdquo;</p>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                    <span className="text-2xl mt-2 ml-2 block">👨‍💼</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">James Wilson</p>
                                    <p className="text-xs text-slate-500">Program Director, Urban Montessori</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                            <div className="flex text-secondary mb-4">
                                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
                            </div>
                            <p className="text-slate-600 italic mb-6">&ldquo;The wellness reminders are a game changer. It helps us keep a healthy balance between digital exploration and physical activity.&rdquo;</p>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                    <span className="text-2xl mt-2 ml-1 block">👩‍🏫</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Sarah Jenkins</p>
                                    <p className="text-xs text-slate-500">Early Years Specialist</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / CTA Section */}
            <section className="py-24 bg-ice/10" id="pricing">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-600">Choose the plan that fits your classroom or center&apos;s needs.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-slate-900">₦5,000</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Up to 100 Students
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Basic Analytics
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Email Support
                                </li>
                            </ul>
                            <Link href="/register" className="text-center w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all">Start Free Trial</Link>
                        </div>
                        <div className="bg-white p-10 rounded-3xl border-4 border-primary shadow-2xl relative flex flex-col transform md:-translate-y-4">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Premium</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-slate-900">₦10,000</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Unlimited Students & Teachers
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Advanced Analytics & Reports
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Priority Support 24/7
                                </li>
                            </ul>
                            <Link href="/register" className="text-center w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Get Started</Link>
                        </div>
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-slate-900">₦20,000</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Everything in Premium
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Custom Integrations
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> Dedicated Account Manager
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span> SLA Guarantee
                                </li>
                            </ul>
                            <Link href="/contact" className="text-center w-full py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-50 transition-all">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Overview Section */}
            <section className="py-24 bg-white" id="curriculum">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Our Holistic Curriculum</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Expertly crafted modules that bridge the gap between academic foundation and emotional well-being.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300">
                            <div className="aspect-video overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&h=400&fit=crop" alt="Phonics learning" width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-primary">Phonics & Language</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">Building strong literacy foundations through interactive storytelling and phonemic awareness games.</p>
                            </div>
                        </div>
                        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300">
                            <div className="aspect-video overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop" alt="Early maths" width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-primary">Early Maths</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">Introducing numerical concepts through play-based discovery and logical reasoning exercises.</p>
                            </div>
                        </div>
                        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300">
                            <div className="aspect-video overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop" alt="Wellness education" width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-primary">Wellness</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">Guided mindfulness and physical activity breaks designed specifically for little bodies and minds.</p>
                            </div>
                        </div>
                        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300">
                            <div className="aspect-video overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop" alt="Creative arts" width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-primary">Creative Arts</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">Encouraging self-expression through digital painting, music appreciation, and imaginative play.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Subscription Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute -left-10 top-0 opacity-5 pointer-events-none">
                            <span className="material-symbols-outlined text-[160px]">mail</span>
                        </div>
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Stay Updated on Early Years Wellness</h3>
                            <p className="text-slate-500 font-medium">Get monthly tips and curriculum updates delivered to your inbox.</p>
                        </div>
                        <form className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-md">
                            <label className="sr-only" htmlFor="newsletter-email">Email Address</label>
                            <input id="newsletter-email" className="flex-1 px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-secondary text-slate-900 outline-none" placeholder="Your email address" type="email" />
                            <button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-secondary/20 whitespace-nowrap" type="submit">Sign Up</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-ice/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center flex flex-col items-center">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-10 left-10"><span className="material-symbols-outlined text-white text-9xl">school</span></div>
                            <div className="absolute bottom-10 right-10"><span className="material-symbols-outlined text-white text-[160px]">psychology_alt</span></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 max-w-2xl relative z-10">
                            Ready to transform your early years classroom?
                        </h2>
                        <p className="text-white/80 text-xl mb-12 max-w-xl relative z-10 font-medium">
                            Join hundreds of innovative schools and childcare centers. Get early access to the Bloomncuddles beta.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-md">
                            <label className="sr-only" htmlFor="school-email-cta">School Email</label>
                            <input id="school-email-cta" className="flex-1 px-6 py-4 rounded-xl border-none focus:ring-4 focus:ring-white/20 text-slate-900 font-medium outline-none" placeholder="Enter your school email" type="email" />
                            <Link href="/register" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all whitespace-nowrap flex items-center justify-center">
                                Request Access
                            </Link>
                        </div>
                        <p className="mt-8 text-white/60 text-sm font-medium relative z-10">
                            No credit card required • GDPR Compliant • COPPA Secure
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
