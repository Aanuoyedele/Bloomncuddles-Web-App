import Link from "next/link";
export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-navy/5 font-sans">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                <Link href="/" className="flex items-center gap-2 group cursor-pointer z-10">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-2xl">child_care</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-navy group-hover:text-primary transition-colors">
                        Bloomncuddles
                    </span>
                </Link>
                
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/#features" className="text-sm font-medium text-navy/70 hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="/games" className="text-sm font-medium text-navy/70 hover:text-primary transition-colors">
                        Games
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-navy/70 hover:text-primary transition-colors">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-navy/70 hover:text-primary transition-colors">
                        Contact
                    </Link>
                </div>
                
                <div className="flex items-center gap-3">
                    <Link 
                        href="/login" 
                        className="hidden sm:block px-5 py-2 text-sm font-semibold text-navy/70 hover:bg-ice/20 rounded-lg transition-all"
                    >
                        Log In
                    </Link>
                    <Link 
                        href="/register" 
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        Request Access
                    </Link>
                </div>
            </div>
        </nav>
    );
}
