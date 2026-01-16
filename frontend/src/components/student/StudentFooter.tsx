import Link from "next/link";

export default function StudentFooter() {
    return (
        <footer className="border-t border-slate-100 mt-12 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Made for Students */}
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="text-lg">🌸</span>
                        <span>Made for future leaders</span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/parent/login"
                            className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                        >
                            Parent Portal
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                        >
                            Teachers Site
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
