export default function ContactPage() {
    return (
        <div className="overflow-x-hidden min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden bg-ice/20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy mb-6 tracking-tight">
                        We&apos;re Here to <span className="text-primary">Help</span>
                    </h1>
                    <p className="text-lg md:text-xl text-navy/60 leading-relaxed max-w-2xl mx-auto">
                        Have questions about our platform? Need support? We&apos;re here to help early years educators and parents thrive.
                    </p>
                </div>
            </section>
            
            {/* Main Content */}
            <section className="py-16 bg-background-light relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-navy/5">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Content */}
                            <div className="w-full lg:w-5/12 p-10 lg:p-14 bg-ice/15 border-r border-navy/5">
                                <div className="space-y-10">
                                    <div>
                                        <h2 className="text-3xl font-bold text-navy mb-4">
                                            Contact Information
                                        </h2>
                                        <p className="text-navy/60 leading-relaxed">
                                            Whether you&apos;re a parent, teacher, or school administrator, our team is ready to assist you.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { icon: 'mail', label: 'Email Us', val: 'support@bloomncuddles.com', href: 'mailto:support@bloomncuddles.com' },
                                            { icon: 'call', label: 'Call Us', val: '+234 (0) 123-4567', href: 'tel:+23401234567' },
                                            { icon: 'location_on', label: 'Visit HQ', val: 'Lagos, Nigeria', href: '#' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                                                <div className="flex items-center justify-center rounded-xl bg-white text-primary shrink-0 size-12 shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">{item.icon}</span>
                                                </div>
                                                <div className="pt-1">
                                                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400 block mb-1">{item.label}</span>
                                                    <a href={item.href} className="text-base font-bold text-navy hover:text-primary transition-colors block">{item.val}</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Social Links */}
                                    <div className="pt-4 border-t border-slate-200/60">
                                        <h3 className="text-sm font-bold text-navy uppercase tracking-widest mb-4">Follow Us</h3>
                                        <div className="flex gap-4">
                                            {['photo_camera', 'thumb_up', 'play_arrow'].map((icon, i) => (
                                                <a key={i} href="#" className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                                    <span className="material-symbols-outlined">{icon}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Form */}
                            <div className="w-full lg:w-7/12 p-10 lg:p-14 bg-white">
                                <div className="max-w-lg mx-auto lg:mx-0">
                                    <div className="mb-10">
                                        <h3 className="text-2xl font-bold text-navy mb-2">Send us a Message</h3>
                                        <p className="text-slate-500">Fill out the form and we&apos;ll get back to you shortly.</p>
                                    </div>

                                    <form className="space-y-6">
                                        {[
                                            { id: 'fullname', type: 'text', placeholder: 'Your Full Name', icon: 'person' },
                                            { id: 'email', type: 'email', placeholder: 'Email Address', icon: 'mail' },
                                            { id: 'school', type: 'text', placeholder: 'School Name (Optional)', icon: 'school' }
                                        ].map((field) => (
                                            <div key={field.id}>
                                                <label className="sr-only" htmlFor={field.id}>{field.placeholder}</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                        <span className="material-symbols-outlined text-[20px]">{field.icon}</span>
                                                    </div>
                                                    <input
                                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                        id={field.id}
                                                        name={field.id}
                                                        placeholder={field.placeholder}
                                                        type={field.type}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div>
                                            <label className="sr-only" htmlFor="message">Message</label>
                                            <div className="relative">
                                                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                                </div>
                                                <textarea
                                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                                                    id="message"
                                                    name="message"
                                                    placeholder="How can we help you?"
                                                    rows={5}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                className="group w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 px-[15px] py-[15px] rounded-[6px]" 
                                                type="button"
                                            >
                                                <span>Send Message</span>
                                                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
