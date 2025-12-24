import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-accent pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm ring-1 ring-slate-100">
                <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
                New Platform V2.0
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:leading-[1.1] font-display">
                Where Teaching Meets <span className="text-primary">Wellness</span>
              </h1>
              <p className="text-lg leading-8 text-slate-600 max-w-2xl mx-auto lg:mx-0">
                A teacher-led digital learning platform designed specifically for early years and primary schools. Empower your classroom with wellness-first tools.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-2">
                <button className="h-12 px-8 rounded-full bg-primary text-white font-bold text-base shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all w-full sm:w-auto">
                  Get Started
                </button>
                <button className="h-12 px-8 rounded-full bg-white text-slate-700 font-bold text-base shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-all w-full sm:w-auto">
                  View Demo
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium mt-4">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[20px] text-green-500">check_circle</span>
                  <span>COPPA Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[20px] text-green-500">check_circle</span>
                  <span>No Ads</span>
                </div>
              </div>
            </div>
            <div className="relative lg:h-auto">
              <div className="relative rounded-2xl bg-white p-4 shadow-soft">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwSe9HmAHWW5BDUKz4pyhTzRow8LMGaLLHWE_mCpSQv7uVEbFNgwRBMoccGA02SSYeVFKbtfrdTsRSJXfVVGcC45o_e_umMxZXQlwE9_MnhIkxdx8HenzVCeHzGgtgosaRuUNvWQ346_H4ojcaaXK31oxTa-zs3WRtWOiyV16cl44vsabOXoF2qvifM3Sy66dn8W12Y7OlhkGd4jrXSWCY9avtabguDHBVojOssoxqo3OKlyFTXW-eMO5uTnQoaJVC4K4oT8l2DkT4"
                    alt="Teacher helping young student"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="bg-green-100 text-green-600 p-2 rounded-full">
                    <span className="material-symbols-outlined">emoji_events</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Teacher Rated</p>
                    <p className="text-sm font-bold text-slate-900">#1 for Safety</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">Empowering Early Education</h2>
            <p className="mt-4 text-lg text-slate-600">
              Safe, simple, and engaging tools designed specifically for young learners and their teachers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'admin_panel_settings', title: 'Teacher-Controlled Learning', desc: 'Educators have full oversight on content. Toggle visibility and manage access with a single click.', color: 'text-primary', bg: 'bg-primary' },
              { icon: 'sentiment_very_satisfied', title: 'No Login for Children', desc: 'Frictionless access for young students. Simple QR codes or magic links mean more learning time.', color: 'text-secondary', bg: 'bg-secondary' },
              { icon: 'sports_esports', title: 'Interactive Games & Reading', desc: 'Engaging educational play and stories curated by experts to support early literacy.', color: 'text-indigo-500', bg: 'bg-indigo-500' }
            ].map((feature, i) => (
              <div key={i} className="group relative flex flex-col gap-6 rounded-2xl bg-accent p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-white ${feature.color} shadow-sm group-hover:${feature.bg} group-hover:text-white transition-colors`}>
                  <span className="material-symbols-outlined text-[32px]">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-accent/50" id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLv-kAR_yK8lkgIJEvSFbWYS1-j8tWKpPp_fwlmcMd6bjG0uq6Y7uGuV2wCqnOYVWkK39AvzRdw4A-0JUI-YPoRpI-DL04-nzND34uahqD0aANV6wUkSL-FGu73zJvV56uPCp4yahnFZmh1k9sGMMKc9_VP7MJSYJ9WoNyTZ_gEG5aiIoly60D6ccVS_heVNKkrWuCYdP5sl_3yVsjXmGGFy6T_glCR2t2vKv02wubOyLhf33fsZVsSdZ2LEC2ug3EHJlchLO86wYG"
                    alt="Child using tablet"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Simple Setup for Busy Teachers</h2>
                <p className="mt-4 text-lg text-slate-600">
                  Get your classroom running in minutes, not days.
                </p>
              </div>
              <div className="relative pl-8 border-l-2 border-slate-200 space-y-12">
                {[
                  { step: 1, icon: 'school', title: 'Set up your class', desc: 'Import your roster or add students manually. Create groups for differentiated learning.', color: 'text-primary' },
                  { step: 2, icon: 'auto_stories', title: 'Curate content', desc: "Select form thousands of verified books and games. Pin activities for today's lesson.", color: 'text-secondary' },
                  { step: 3, icon: 'child_care', title: 'Students play safely', desc: 'Children access their safe dashboard. No ads, no external links, just learning.', color: 'text-indigo-500' }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[41px] flex h-10 w-10 items-center justify-center rounded-full ${i === 0 ? 'bg-primary text-white' : 'bg-white text-slate-500 border-2 border-slate-200'} shadow-lg ring-4 ring-white`}>
                      <span className="font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 font-display">
                        <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                        {item.title}
                      </h3>
                      <p className="mt-2 text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center divide-x divide-white/20">
            {[
              { val: '500+', label: 'Schools' },
              { val: '12k', label: 'Teachers' },
              { val: '1M+', label: 'Activities Completed' },
              { val: '100%', label: 'Safe & Ad-Free' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 p-2">
                <span className="text-4xl font-extrabold font-display">{stat.val}</span>
                <span className="text-sm font-medium text-white/80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-3xl bg-slate-900 px-6 py-16 sm:px-16 md:py-24 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-display">Designed for Schools.<br />Loved by Teachers.</h2>
              <p className="mx-auto max-w-lg text-lg text-slate-300">
                Join the platform that balances wellness with digital learning. Start your free pilot today.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="flex h-12 min-w-[160px] items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg transition-transform hover:scale-105">
                  Request Access
                </button>
                <button className="flex h-12 min-w-[160px] items-center justify-center rounded-full bg-transparent border border-slate-500 px-8 text-base font-bold text-white transition-colors hover:bg-white/10">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
