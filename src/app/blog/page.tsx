'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Eye, Tag, ArrowRight } from 'lucide-react';
import { blogStore } from '@/lib/blog-store';
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(blogStore.getAll());
  }, []);

  useEffect(() => {
    let result =
      activeCategory === '全部'
        ? posts
        : posts.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const kw = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.summary.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw))
      );
    }

    setFilteredPosts(result);
  }, [posts, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold mb-3">钰美固博客</h1>
          <p className="text-amber-100 text-lg max-w-2xl">
            产品动态、技术干货、行业洞察 — 了解地面研磨与抛光的前沿知识
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文章标题、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            暂无相关文章
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Cover Image */}
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category Badge */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 mb-3">
                    {post.category}
                  </span>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-500"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount}
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
}
