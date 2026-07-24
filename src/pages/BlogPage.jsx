import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { Search, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';

const allCategories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

const BlogPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = blogPosts.filter(post => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = blogPosts[0];
  const rest = filtered.filter(p => p.id !== featured.id || activeCategory !== 'All' || search);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 transition-colors duration-200">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 py-20">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 40%, white 1px, transparent 0), radial-gradient(circle at 80% 70%, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Fusion Themes Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Design. Develop. <span className="text-yellow-300">Inspire.</span>
          </h1>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Expert articles on React, UI design, Tailwind CSS, eCommerce, and building beautiful products.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 text-sm font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Category Pills ──────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-white dark:bg-navy-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-navy-800 hover:border-purple-400 hover:text-purple-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Featured Post (only shown when no filter applied) ─── */}
        {activeCategory === 'All' && !search && (
          <div className="mb-12 group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 shadow-sm hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                ✦ Featured
              </span>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${featured.categoryColor}`}>
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-purple-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={featured.author.avatar} alt={featured.author.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">{featured.author.name}</div>
                    <div className="text-[11px] text-gray-400">{featured.date}</div>
                  </div>
                </div>
                <Link
                  to={`/blog/${featured.id}`}
                  className="flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Posts Grid ──────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">No articles found</h3>
            <p className="text-sm text-gray-500 mt-1">Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeCategory === 'All' && !search ? rest : filtered).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className={`absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${post.categoryColor}`}>
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400 rounded-md">
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-navy-800">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{post.author.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
