export default function GamesPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Interactive Games Library</h1>
                    <p className="text-slate-500 text-base mt-2">Browse and assign learning activities to your students.</p>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                        <span className="text-sm font-bold text-slate-600">12 Assigned</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Search games by title, skill, or keyword..."
                        type="text"
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-center">
                    <span className="text-sm font-bold text-slate-500 whitespace-nowrap mr-2">Filters:</span>
                    <button className="flex h-9 shrink-0 items-center px-4 rounded-lg bg-slate-800 text-white text-sm font-bold hover:opacity-90 transition-opacity">
                        All Subjects
                    </button>
                    {['Math', 'Science', 'English'].map(subject => (
                        <button key={subject} className="flex h-9 shrink-0 items-center px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors">
                            {subject}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-slate-300 mx-2"></div>
                    {['Grade 1', 'Grade 2', 'Grade 3'].map(grade => (
                        <button key={grade} className="flex h-9 shrink-0 items-center px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors">
                            {grade}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recommended */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
                    <button className="text-primary text-sm font-bold hover:underline">View History</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Counting Clouds', desc: 'A fun adventure where students count cumulus clouds to learn basic addition.', tag: 'Math', grade: 'Grade 1', badge: 'NEW', badgeColor: 'bg-secondary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp2NY3ZB3qSiLU-r-aIzeRfnpzHT8cl-nb5TeUlQ4ddMYAT5Htps1Z7zu1Bac844TzSio0kBT0TrKK2rAoxXlxV_S6xveqPjHDkufCPDbwMD7g37RJ2QRUtqJhqiJCE2FvwUSqh6l6p_WsKPx_AJROjZzjdfIHdFY1FDzA9ihx_hk3K60B_w85KrfVNmO_hdGnv8Q1gWDGaPI8wd6kX2bpkpc5vXM1WVpO67tmINuh9-W-ZqTbwQRNQznI4xdLgOOm5zPXH18-JpRj' },
                        { title: 'Word Wizard Forest', desc: 'Explore the enchanted forest and spell words to unlock secret paths.', tag: 'English', grade: 'Grade 2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC959k5-YH8hgsEH5k7DoAzikXrv-V24bMKxUwju37_4exOhVii9USyp0yNRcoB-JdNMjMyyrQK9ga_XQSdXFlKWLtcsEbPgm4DYCQf7WX32agdDAYMV8EwkGfF8Cdau0i1yuxgVqlg62kGd2HI7KSmHsnkzMnvt0dttCTw0t_o2nHPMibwN8CDR0MxW90Uh9J_OpHzrTqHV_6APL7saFvxoudEqG8g7iIyQ1riWd0p412TWAwaKJFNdDVg-R3dSToB0-_xbM2cpNhf' },
                        { title: 'Eco-System Builder', desc: 'Build your own balanced terrarium and learn about food chains.', tag: 'Science', grade: 'Grade 3', badge: 'POPULAR', badgeColor: 'bg-orange-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxjy_VmVBSvm9Ld357qQg1IvIiuv5pM69SHlD1qvpuidq_ch4hQNXrAx6lS3bNRSmi9FaVji2GBjAScGhNaZ1OApfz9WyN_IIA3cs5R49hnZsrx-Xa53iH57awOZyeTOyIZlFVVC0o6rNA5TwsmAn8UaCfa4jfN8ZGEvTe4cryRYDNvl16rC1DaOF8JH3PTJVFmkcWVlBwaLzZmY67beKyk4tdcoZw168xHHMQ-IewIMXWXZcpknS1_igSyYmJlzQ52o442jhqf5dA' }
                    ].map((game, i) => (
                        <div key={i} className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                {game.badge && <span className={`absolute top-3 left-3 z-10 ${game.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm`}>{game.badge}</span>}
                                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                                    <img src={game.img} alt={game.title} className="h-full w-full object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                    <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                        <span className="material-symbols-outlined text-primary text-3xl">play_arrow</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex gap-2">
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{game.tag}</span>
                                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">{game.grade}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-yellow-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{game.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">{game.desc}</p>
                                <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        Preview
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-sm transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">assignment_add</span>
                                        Assign
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Browse All (Grid) */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Browse All Games</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Shape Sorter', meta: 'Math • Gr 1', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALTgjsSe1UmDXc_kFCoRiN5BlCuc71v4eyNhNPRJ4yDIg_Av8i72wtgTIgEbTbvsaoLcz5Ta8AHH6hYvqYYduZPsoiLjF13Prt-L4zkSOMtfQtCTR4chxQ3XbqistKodptW6I4PtXnTPUFv_b_ua5UMf8aHJZ8GCLgBedRjWWq-22L4e_qCk8alThsKvPSpWzNNG6Zy9CJyrQ0sKL0VLsrYZNL9bTzZ4WQxIWECjP1zafhrblhEbnEoWvbtddi4X8NeWYNwoGrjxFT' },
                        { title: 'Rhyme Time', meta: 'English • Gr 2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWtUV4ugLg4nDhqB5ZvTsf6GzdIA5ZMHPU5jp5ugBOft8mEKaUxZj94-xSCIzfL3hkXptjs_RewOsf99xoXkcD9CVilM51tCjn6NsL5httqBUEmJU45UQfqQLNgp3DeMxKWxPqQ2Ij2hCQntlMg-EGy3ckue12eNoVHLRL6jT9O_ch0m583NNupXSlXzbBMXxoJ8tq_5l60hl94uqXcLZ7wh6NNMbW5HfqldRUTdIQW198jJIjF0YWFvdLC51I2l24vq8tERhMVgmd' },
                        { title: 'Planet Hop', meta: 'Science • Gr 3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYSFDu9frSYwQ7DPhvrWq8ZSaIh8gD7g_ZtB3f_Wl6oeBXypSJYuukc4LgJIAFOd4MCUiNLi1_iND_6Ppxn2paT3u-fb2knDSf3HzC07hfFRftMazMyqESrHx6Z9MGRaLCVCwkSfNtF8SvPxtbHm1rTk0k00K9yFoGFY9PQPpAeLRCr2PZ64faE1lK86mAI28DN96UDc9B7UfiBeS272tq-fA2hFy_QK5E0f4I7Z3Hca9og7Hbf1fxxfv2ZeLJl3cIaYZUWO53JoC5' },
                        { title: 'Logic Puzzles', meta: 'Logic • Gr 3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoIB336iSzgJjmNh-dQcLWURPpJdMV5iVPWej3fxs4VjZOK9xOHLyoodaKLTZKcr0Pf9csqCJD_eBs40rQUK67kcr481zT2KzveNGfyR3YDVl7fsAlfsnuSKmb52IhYh1mW0QgOjMuDANZnJJtqLcGJNmMRVARhNlThZOSk1VWsyziFiv6VJvxxUJ2abvSJwaERengBz_IrvchlOzWBiEoiQsGGLd5Od5Qyz8NpZFzwjIYcs2tiA-bS3uYOpRc5Zdl9cspsNCIlMIt' }
                    ].map((game, i) => (
                        <div key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-primary/50 hover:shadow-md transition-all">
                            <div className="relative h-32 w-full bg-slate-100">
                                <img src={game.img} alt={game.title} className="h-full w-full object-cover" />
                                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                </button>
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{game.meta}</span>
                                    <div className="flex text-yellow-400 text-xs font-bold gap-0.5">
                                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-900 leading-tight">{game.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
