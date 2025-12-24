import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="bg-background-light text-slate-900 font-sans overflow-x-hidden">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-5 md:px-0 py-5">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-3xl bg-primary min-h-[400px] flex items-center justify-center text-center p-8 bg-cover bg-center"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(72, 111, 161, 0.85), rgba(72, 111, 161, 0.95)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAK8dk0Nz47ZcvQRisfbqN45O6I7D7cY9bfesyJx9JpVpb5Y1LmL9ZrJ5sMqybNkUsX4_XfMzaYuBS0aLobFzzoiwZ3atbGyt-J6qCK3n_yaF5oFA1YWs6ppGk9nW-M2l1Do4s3RlaTI4CQA3BmbhjH2t4uCLZ4v7IMi8huHLuPVCiWa5NFihBvWN_qzan28ral7SuT17jMTenH7Enla2pJ-anP2SEvlz-IMNt8kSl5Ax17jATuAC4KBlIV_ej71Tx-TMTDV7T7Yjgt")'
                            }}>
                            <div className="relative z-10 max-w-2xl mx-auto text-white space-y-6">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight font-display">About Bloomncuddles</h1>
                                <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                                    Empowering early years and primary education through a teacher-led, school-licensed digital learning platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="py-20 px-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <div className="inline-block bg-primary/10 px-4 py-1 rounded-full mb-4 border border-primary/20">
                                <span className="text-primary text-xs font-bold uppercase tracking-wider">Our Philosophy</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Principles that drive us</h2>
                            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                                We believe in creating a digital environment that is accessible, simple, and focused entirely on the child's growth.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: 'spa', title: 'Simplicity', desc: 'Intuitive tools designed for teachers and tiny hands alike, ensuring technology never gets in the way of learning.' },
                                { icon: 'public', title: 'Inclusivity', desc: 'African-friendly design ensuring representation and accessibility for every child, celebrating diverse cultures.' },
                                { icon: 'child_care', title: 'Child-Centered', desc: "Curriculum-aligned content that puts the learner's journey first, fostering curiosity and engagement." }
                            ].map((item, i) => (
                                <div key={i} className="group p-8 rounded-2xl border border-slate-100 bg-white hover:border-primary/50 transition-all hover:shadow-lg">
                                    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl group-hover:text-white transition-colors">{item.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-20 text-center shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-white font-display">Ready to transform your classroom?</h2>
                                <p className="text-white/90 text-lg">
                                    Join the schools already using Bloomncuddles to enhance early childhood education with ease and inclusivity.
                                </p>
                                <button className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-secondary shadow-lg transition-transform hover:scale-105">
                                    Join the Platform
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
