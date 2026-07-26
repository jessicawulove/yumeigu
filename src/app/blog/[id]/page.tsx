'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Tag,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { blogStore } from '@/lib/blog-store';
import type { BlogPost } from '@/lib/types';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const id = params.id as string;
    const found = blogStore.getById(id);
    if (found) {
      blogStore.incrementView(id);
      setPost(found);

      // 相关文章：同分类的其他文章
      const related = blogStore
        .getAll()
        .filter((p) => p.category === found.category && p.id !== id)
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [params.id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">文章不存在或已被删除</p>
          <Link
            href="/blog"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  // 简单的 Markdown 渲染
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="text-2xl font-bold text-gray-900 mt-8 mb-4"
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3
            key={i}
            className="text-xl font-semibold text-gray-800 mt-6 mb-3"
          >
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('| ')) {
        // 简单表格处理
        const cells = line
          .split('|')
          .filter((c) => c.trim())
          .map((c) => c.trim());
        if (cells.every((c) => /^[-:]+$/.test(c))) return null;
        return (
          <div key={i} className="flex gap-4 py-1.5 text-sm">
            {cells.map((cell, j) => (
              <span
                key={j}
                className={
                  j === 0
                    ? 'font-medium text-gray-700 w-32 shrink-0'
                    : 'text-gray-600'
                }
              >
                {cell}
              </span>
            ))}
          </div>
        );
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*[：:](.+)/);
        if (match) {
          return (
            <div key={i} className="flex gap-2 py-1 text-sm text-gray-700">
              <span className="text-amber-600">•</span>
              <span>
                <strong>{match[1]}</strong>
                {match[2]}
              </span>
            </div>
          );
        }
      }
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 py-0.5 text-sm text-gray-700">
            <span className="text-amber-600">•</span>
            <span>{line.replace('- ', '')}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        return (
          <div key={i} className="flex gap-2 py-0.5 text-sm text-gray-700">
            <span className="text-amber-600 font-medium w-5 shrink-0">
              {num}.
            </span>
            <span>{line.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-3" />;
      }
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-amber-600 transition-colors">
            博客
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">{post.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 truncate">{post.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-6">
            {post.summary}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.createdAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.viewCount} 次阅读
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              约 {Math.ceil(post.content.length / 500)} 分钟
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-xl overflow-hidden mb-8 shadow-sm">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-[21/9] object-cover"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white text-gray-600 border border-gray-100"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="prose-custom">{renderContent(post.content)}</div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客列表
          </button>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">相关文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img
                    src={rp.coverImage}
                    alt={rp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {rp.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{rp.createdAt}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {rp.viewCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
