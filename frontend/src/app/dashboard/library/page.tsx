export default function LibraryPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Reading Library</h1>
                    <p className="text-slate-500 text-base mt-2 max-w-xl">Browse and assign digital books to support your curriculum.</p>
                </div>
                <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Request New Book</span>
                </button>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-base"
                        placeholder="Search by title, author, or keyword..."
                        type="text"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button className="hidden sm:flex items-center justify-center h-10 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-4 hover:bg-slate-50 transition-colors">
                        <span className="text-slate-700 text-sm font-bold">All Ages</span>
                        <span className="material-symbols-outlined text-[20px] text-slate-500">expand_more</span>
                    </button>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-primary bg-primary/5 px-4">
                        <span className="text-primary text-sm font-bold">Key Stage 1</span>
                        <span className="material-symbols-outlined text-[20px] text-primary">close</span>
                    </button>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-4 hover:bg-slate-50 transition-colors">
                        <span className="text-slate-700 text-sm font-bold">Topic: Science</span>
                        <span className="material-symbols-outlined text-[20px] text-slate-500">expand_more</span>
                    </button>
                    <button className="ml-auto text-primary text-sm font-bold hover:underline whitespace-nowrap px-2">Clear All</button>
                </div>
            </div>

            {/* Featured Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">local_fire_department</span>
                    <h2 className="text-xl font-bold text-slate-900">New Arrivals & Featured</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "The Little Astronaut's Guide", author: "Science • Level 3", desc: "An interactive journey through our solar system designed for Key Stage 1 students.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQotQqHnyzMetLiNmU1sKPgRd8tCeRlvWI5HfVojEzFrOdU5edW4_8gcCsfMVNaNT5opzd8QUyMLGh08X6CGa8qpmwSksziT7MZZW7-9L1niX9vL8bqp6E8NRYJGAa7FmoNummFtt8lPgYr9NSNh128WEtGeAgteCNWpe7L0fLJ3q6PUJ-PFmiHRqjq4t5KxXsM60obo3SwVfV51yPYO16DIuL02Wy0nQ9X8tcyubviOm6sa9byQmyhZfUkuFvW6un0Znjj7VI05in" },
                        { title: "Whose Footprint is This?", author: "Nature • Level 1", desc: "Discover the animals of the forest by following their tracks. A perfect autumn read.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgMdJv4xWotTRpZlDZmTMb29OGLJex9dYRWxIqazWdxn3fc7gy6R6uKsJhC-0Z22pdtVVmyZJiZh2pkr4JC3Y9iCG9j4ynSNXgDLQvLAaJP97bqkDxSXCc1dMnamZYxPN1mIgF92Nh_4ljiszZufH9Gh5khKVBmbwC5eWHwoxfRcRLuI6L4bJxXJInsvKVmJyX6Me2vuetv5NNE6L8QOh_7gPGAoo1PljaFxEJp5HkAwP72vYgpdRTr7xT88I1a4r-hyiB2bNwtUm5" }
                    ].map((book, i) => (
                        <div key={i} className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all">
                            <div className="w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto relative overflow-hidden bg-slate-100">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${book.img}")` }}></div>
                                {i === 0 && <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">NEW</div>}
                            </div>
                            <div className="flex flex-col justify-center p-6 sm:w-3/5 gap-3">
                                <span className="text-xs font-bold tracking-wider text-primary uppercase">{book.author}</span>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight">{book.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{book.desc}</p>
                                <div className="flex gap-3 mt-2">
                                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">Assign</button>
                                    <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-bold transition-colors">Preview</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Library Catalog</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <span>Sort by:</span>
                        <button className="flex items-center gap-1 font-bold text-slate-700">Popularity <span className="material-symbols-outlined text-[18px]">expand_more</span></button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[
                        { title: "Colors of Chemistry", author: "Dr. A. Smith", tag: "Science", lvl: "Lvl 2", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmauJRhfCuA6l71U20WGcfVWMl7B0hgVRSZUewHX81Z6xm1vsAUedK1Bjz1IZ4eFec_Q4hwGdO-TPTPkzO5ifGgeuUI58D_SCje0EpIUR4p4dHEA3rZr7ydN1-Oy8FNqsHk2HOmD024HOCHuTpwI2QtzxxAgqz7nJQtFrsCWBOErK9oIZwMTjbWSduRX9MYBUFtGqb7M9pPGh4KcuzCVJjR4BeDJ7Wn9tRW17An7piD4e22ViS6-RrG9ze9WlXdzp3WGi7MQ_1zCKn" },
                        { title: "The Cat's Hat", author: "J. Doe", tag: "Fiction", lvl: "Lvl 1", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjBpfM6gaWv-A09_elFh3vH4x7b3BFJEnRHtrw1Q8CFkCNPscY7atlcYqTYhph1IxzaluQ8f2-ZEyZjoFR8KxrhiZN7KDYK-glRq1zmeZppO1MxEB59ifb8LMXMgyYgBenszn7rfx40WTz39L-R3p2HGOU2AD0jItNK1Z8h9W-spRFZQpIXQ0quMxIn-gXZ8uWPhepDphfTppUpztPDVQU33PmEut6wGzWPjnsskFTqJXDoVL1M5s5K4IU1u5Bp9DhB8gwlYWYZhXg" },
                        { title: "Counting Stars", author: "M. Johnson", tag: "Math", lvl: "Lvl 2", badge: "Popular", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1nb88Sg117wCyJZxNKhHq0XY4cF1sAMketTqaW_3odm_oLKmkLHoHUkgAKcPOKo-6b79oV99-dJmnT-79Lpu0V6iopQ8wXG2MZp2UzpFgHUd8dGlSGpUHk-dVsQsNI9VXehud5vSWEeFt_tgVKYZ5aX2xzFD8HPf4JePltbb3BhaV3BxTgB4loZUgfX8HbKqnOjRo7tWZqNGShwbZ8dpR3BIUGs3QDEQXO-OjR6ZRVn-v_EXLm2-Y0mVpawmiw4J5aCvLvu81tXH-" },
                        { title: "Knights & Castles", author: "Sir R. Time", tag: "History", lvl: "Lvl 3", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmTo-KJLutZ40ECrroQDVAYE0HpQiWhM2Lzcn_t-bAX8g01j9qVKnRkM8o88aylgLKfI1V4ebRTBVWip3tUPFlZCUfZATkwLdAP0-MqTBB6-53KTo6hzAA-TVdIvNY-_wVV40jjzpcDEFlKy3vOJNQo6J7LRAAeI4ZbZqlGMIbY8iCud2y1dBQZL-uGqF-eNDGYtp51H1Q9ShzRR-ZJoSQUA2n72sdlsJh0DReKE9CDaKsfZ790Zy-XOvShFH2JX3lkfAspOr5iCUu" },
                    ].map((book, i) => (
                        <div key={i} className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
                                <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${book.img}")` }}></div>
                                {book.badge && <div className="absolute top-2 left-2 z-10"><span className="inline-flex items-center rounded bg-secondary/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white tracking-wide uppercase">Popular</span></div>}
                                <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-slate-400 hover:text-secondary opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-[20px] block">favorite</span>
                                </button>
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                                <div className="mb-2 flex justify-between items-start">
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wide">{book.tag}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{book.lvl}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{book.title}</h3>
                                <p className="text-xs text-slate-500 mb-3 font-medium">by {book.author}</p>
                                <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                                    <button className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Preview</button>
                                    <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-colors">Assign</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center py-6">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <span>Load More Books</span>
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
