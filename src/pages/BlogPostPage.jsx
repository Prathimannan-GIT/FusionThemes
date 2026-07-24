import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { Clock, ArrowLeft, Tag, User, Calendar } from 'lucide-react';

const BlogPostPage = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-navy-950">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Article not found</h2>
        <Link to="/blog" className="text-purple-600 font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const related = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  // Simple markdown-to-HTML converter for headings, bold, code blocks, inline code
  const renderContent = (md) => {
    const lines = md.trim().split('\n');
    const html = [];
    let inCode = false;
    let codeBuffer = [];
    let lang = '';

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (!inCode) {
          inCode = true;
          lang = line.slice(3).trim();
          codeBuffer = [];
        } else {
          inCode = false;
          html.push(
            <pre key={i} className="bg-gray-900 text-green-300 rounded-xl p-4 text-xs font-mono overflow-x-auto my-4">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
        }
        return;
      }

      if (inCode) { codeBuffer.push(line); return; }

      if (line.startsWith('## ')) {
        html.push(<h2 key={i} className="text-2xl font-extrabold text-gray-900 dark:text-white mt-10 mb-4">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        html.push(<h3 key={i} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">{line.slice(4)}</h3>);
      } else if (line.startsWith('- ')) {
        html.push(
          <li key={i} className="text-gray-600 dark:text-gray-400 text-base mb-1.5 ml-5 list-disc">
            {parseBold(line.slice(2))}
          </li>
        );
      } else if (line.trim() === '') {
        html.push(<div key={i} className="my-2" />);
      } else {
        html.push(
          <p key={i} className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-3">
            {parseBold(line)}
          </p>
        );
      }
    });

    return html;
  };

  const parseBold = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1
        ? <strong key={i} className="text-gray-900 dark:text-white font-bold">{p}</strong>
        : p
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 transition-colors duration-200">

      {/* Cover Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${post.categoryColor} mb-3 inline-block`}>
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-navy-800">
          <div className="flex items-center gap-2.5">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{post.author.name}</div>
              <div className="text-xs text-gray-400">Author</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400 rounded-md">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8 border-l-4 border-purple-500 pl-5 italic">
          {post.excerpt}
        </p>

        {/* Rendered content */}
        <div className="prose-custom">
          {renderContent(post.content)}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-navy-800">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/blog/${r.id}`}
                  className="group flex flex-col bg-white dark:bg-navy-900 rounded-xl border border-gray-200 dark:border-navy-800 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-36 overflow-hidden">
                    <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors line-clamp-2">{r.title}</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-2"><Clock className="w-3 h-3" /> {r.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
