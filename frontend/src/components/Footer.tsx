import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-center md:text-left">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-4 group">
                            <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white group-hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">school</span>
                            </div>
                            <span className="text-lg font-bold text-slate-900 font-display">Bloomncuddles</span>
                        </Link>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto md:mx-0 mb-6">
                            Making digital learning safe, healthy, and happy for the next generation.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-slate-900">Platform</h3>
                        <Link href="/about" className="text-sm text-slate-600 hover:text-primary">About Us</Link>
                        <Link href="/#features" className="text-sm text-slate-600 hover:text-primary">Features</Link>
                        <Link href="/login" className="text-sm text-slate-600 hover:text-primary">Teacher Login</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-slate-900">Support</h3>
                        <Link href="/contact" className="text-sm text-slate-600 hover:text-primary">Contact Us</Link>
                        <Link href="#" className="text-sm text-slate-600 hover:text-primary">Help Center</Link>
                        <Link href="#" className="text-sm text-slate-600 hover:text-primary">Privacy Policy</Link>
                    </div>
                </div>
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">© 2025 Bloomncuddles Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
