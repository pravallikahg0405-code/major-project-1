import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { INewsArticle } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  Newspaper, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Calendar, 
  TrendingUp, 
  Cpu, 
  Terminal, 
  Briefcase 
} from 'lucide-react';

export const TechNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<INewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'AI & ML', 'Cloud & DevOps', 'Frontend & Web', 'Backend & Systems', 'Hiring & Career Trends'];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const categoryParam = selectedCategory === 'All' ? '' : selectedCategory;
      const res = await api.get(`/news?category=${encodeURIComponent(categoryParam)}`);
      if (res.data?.success && res.data?.data) {
        setArticles(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching tech news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.originalSummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">Industry Intelligence</Badge>
            <Badge variant="success" size="sm">Open Public Access</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tech News
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Verified engineering feeds, hiring trends, and AI-generated 3-bullet developer takeaways.
          </p>
        </div>

        {/* Search Bar with clear placeholder */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles, hiring trends, AI..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredArticles.map(article => (
            <Card key={article.id} hoverEffect className="flex flex-col justify-between p-6 bg-slate-900/90 border-slate-800 shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="primary" size="sm">{article.category}</Badge>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {article.publishedDate}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white leading-snug mb-2 hover:text-brand-400 transition-colors">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>

                <div className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>{article.source}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {article.originalSummary}
                </p>

                {/* AI 3-Bullet Takeaways */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-brand-500/20 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-400 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Executive Takeaways:</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    {article.aiKeyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-brand-400 font-mono">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Verified Publisher</span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  Read Full Article <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 mt-6">
          <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300 mb-1">No Articles Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
        </div>
      )}

    </div>
  );
};
