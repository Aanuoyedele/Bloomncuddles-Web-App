import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 font-display">Bloomncuddles</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Home</Link>
                    <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">About</Link>
                    <Link href="/games" className="text-sm font-bold text-secondary hover:text-primary transition-colors">Games</Link>
                    <Link href="/#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Features</Link>
                    <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Contact</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
                        Log In
                    </Link>
                </div>
            </div>
        </nav>
    );
}
