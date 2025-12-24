import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <main className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">

                {/* Left Content */}
                <div className="w-full lg:w-5/12 p-8 lg:p-16 flex flex-col justify-center relative bg-white">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden lg:block">
                        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[80px]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            Support Team
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 font-display">
                            Get in <span className="text-primary">Touch</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed mb-10">
                            Have questions about our platform or want to onboard your school? We're here to help early years educators thrive.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: 'mail', label: 'Email Us', val: 'support@bloomncuddles.com', href: 'mailto:support@bloomncuddles.com' },
                                { icon: 'call', label: 'Call Us', val: '+234 (0) 123-4567', href: 'tel:+23401234567' },
                                { icon: 'location_on', label: 'Visit HQ', val: 'Lagos, Nigeria', href: '#' }
                            ].map((item, i) => (
                                <div key={i} className="group flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/50 transition-all">
                                    <div className="flex items-center justify-center rounded-xl bg-white text-primary shrink-0 size-12 shadow-sm group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</span>
                                        <a href={item.href} className="text-base font-bold text-slate-900 hover:text-primary transition-colors">{item.val}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="w-full lg:w-7/12 p-8 lg:p-16 bg-slate-50/50 relative">
                    <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Send us a message</h3>
                            <p className="text-slate-500">Fill out the form below and we'll get back to you shortly.</p>
                        </div>

                        <form className="space-y-5">
                            {[
                                { id: 'fullname', type: 'text', placeholder: 'Full Name', icon: 'person' },
                                { id: 'email', type: 'email', placeholder: 'Email Address', icon: 'alternate_email' },
                                { id: 'school', type: 'text', placeholder: 'School Name', icon: 'school' }
                            ].map((field) => (
                                <div key={field.id}>
                                    <label className="sr-only" htmlFor={field.id}>{field.placeholder}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">{field.icon}</span>
                                        </div>
                                        <input
                                            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            id={field.id}
                                            name={field.id}
                                            placeholder={field.placeholder}
                                            type={field.type}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className="sr-only" htmlFor="message">Message</label>
                                <div className="relative group">
                                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">chat_bubble_outline</span>
                                    </div>
                                    <textarea
                                        className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                        id="message"
                                        name="message"
                                        placeholder="How can we help you?"
                                        required
                                        rows={4}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button className="group w-full flex items-center justify-center gap-2 py-4 px-8 bg-primary hover:bg-opacity-90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5" type="button">
                                    <span>Send Message</span>
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
