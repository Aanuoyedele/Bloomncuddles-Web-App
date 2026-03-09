import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-navy font-sans relative overflow-hidden">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
                {/* Top row: CTA headline + social */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-md">
                            Learning is better<br />when it&apos;s <span className="text-ice">playful</span>
                        </h2>
                        <p className="text-white/40 mt-4 text-sm max-w-sm">
                            Nurturing curiosity and wellness in the digital age of early education.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 bg-white text-navy text-sm font-bold hover:bg-ice transition-colors group px-[15px] py-[15px] rounded-[6px]"
                    >
                        Join Bloomncuddles
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                {/* Navigation columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Product</h4>
                        <ul className="flex flex-col gap-3 text-white/60 text-sm">
                            <li><Link className="hover:text-white transition-colors" href="/#features">Features</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/games">Games</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/#pricing">Pricing</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="#">Safety</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Company</h4>
                        <ul className="flex flex-col gap-3 text-white/60 text-sm">
                            <li><Link className="hover:text-white transition-colors" href="/about">About Us</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/contact">Contact</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/login">Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Legal</h4>
                        <ul className="flex flex-col gap-3 text-white/60 text-sm">
                            <li><Link className="hover:text-white transition-colors" href="#">Terms &amp; Conditions</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="#">Disclaimer</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Stay Connected</h4>
                        <div className="flex gap-3 mb-6">
                            {[
                                { icon: "photo_camera", label: "Instagram" },
                                { icon: "thumb_up", label: "Facebook" },
                                { icon: "play_arrow", label: "YouTube" },
                                { icon: "tag", label: "Twitter" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label={social.label}
                                    className="size-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                        {/* Newsletter mini */}
                        <form className="flex gap-1.5">
                            <label htmlFor="footer-email" className="sr-only">Email address</label>
                            <input
                                id="footer-email"
                                type="email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs px-3 py-2.5 focus:ring-1 focus:ring-ice focus:border-ice text-white placeholder-white/30 outline-none transition-all"
                                placeholder="Your email"
                            />
                            <button className="bg-white/10 hover:bg-white/20 text-white .5 text-xs font-bold transition-colors border border-white/10 px-[15px] py-[15px] rounded-[6px]">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 border-t border-white/5 pt-8">
                    <p>© 2026 Bloomncuddles Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link className="hover:text-white/60 transition-colors" href="#">Privacy Policy</Link>
                        <Link className="hover:text-white/60 transition-colors" href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* Giant BLOOM text at the bottom */}
            <div className="relative w-full overflow-hidden select-none pointer-events-none" aria-hidden="true">
                <div className="text-[20vw] md:text-[18vw] font-black text-white/[0.03] leading-[0.85] tracking-tighter text-center whitespace-nowrap pb-0">
                    BLOOM
                </div>
            </div>
        </footer>
    );
}
