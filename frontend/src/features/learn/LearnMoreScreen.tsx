import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Search, ExternalLink, ShieldCheck, Heart, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { SAMPLE_ARTICLES, CATEGORIES, type Article } from './articles.data';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function LearnMoreScreen() {
  const [activeSection, setActiveSection] = useState<'Understand' | 'Manage' | 'Hygiene'>('Understand');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.Understand[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 250);

  const filteredArticles = useMemo(() => {
    let filtered = SAMPLE_ARTICLES;

    if (debouncedSearch.trim() !== "") {
      const q = debouncedSearch.toLowerCase().trim();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.teaser.toLowerCase().includes(q) ||
        a.tags.some(tag => tag.toLowerCase().includes(q))
      );
    } else {
      // If not searching, respect section and category filters
      filtered = filtered.filter(a => a.section === activeSection);
      if (!activeCategory.startsWith("All ")) {
        filtered = filtered.filter(a => a.category === activeCategory);
      }
    }

    return filtered;
  }, [activeSection, activeCategory, debouncedSearch]);

  const selectedArticle = SAMPLE_ARTICLES.find(a => a.id === selectedArticleId);

  // When changing section, reset category to "All ..."
  const handleSectionChange = (section: 'Understand' | 'Manage' | 'Hygiene') => {
    setActiveSection(section);
    setActiveCategory(CATEGORIES[section][0]);
  };

  if (selectedArticle && selectedArticle.type === 'INTERNAL') {
    return (
      <div className="space-y-6 pb-safe animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-screen flex flex-col">
        <button 
          onClick={() => setSelectedArticleId(null)}
          className="text-sm font-medium text-muted-foreground flex items-center hover:text-primary transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-3xl flex items-center justify-center text-6xl shadow-sm border border-emerald-100/50 relative overflow-hidden">
          <div className="absolute top-4 left-4 inline-flex items-center space-x-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 shadow-sm border border-emerald-100">
            <Heart className="w-3.5 h-3.5" />
            <span>From our team</span>
          </div>
          {selectedArticle.icon}
        </div>
        
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-2 text-xs font-medium text-primary uppercase tracking-wider">
            <span>{selectedArticle.category}</span>
            <span>•</span>
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {selectedArticle.time}</span>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-foreground leading-tight">
            {selectedArticle.title}
          </h1>
          
          <div className="prose prose-stone max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed pt-2">
            <p className="text-lg font-medium text-foreground/80 mb-6">
              {selectedArticle.teaser}
            </p>
            {selectedArticle.content}
          </div>
        </div>

        <div className="mt-12 mb-4 p-5 bg-muted/30 border border-muted/50 rounded-2xl">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="font-semibold text-foreground/70">Disclaimer:</strong> This is general information, not medical advice. For anything specific to your health, please talk to a doctor or healthcare provider.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-safe">
      <header className="flex flex-col space-y-4">
        <h1 className="text-3xl font-serif font-bold text-primary">Learn More</h1>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, symptoms, topics..." 
            className="w-full bg-card border border-muted/20 rounded-full py-3.5 pl-11 pr-10 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full bg-muted/20"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {!searchQuery && (
        <>
          {/* Top-level sections */}
          <div className="flex bg-muted/20 p-1 rounded-full">
            <button
              onClick={() => handleSectionChange('Understand')}
              className={cn(
                "flex-1 text-sm font-medium py-2 rounded-full transition-all",
                activeSection === 'Understand' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Understand (Facts)
            </button>
            <button
              onClick={() => handleSectionChange('Manage')}
              className={cn(
                "flex-1 text-sm font-medium py-2 rounded-full transition-all",
                activeSection === 'Manage' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Manage (Remedies)
            </button>
            <button
              onClick={() => handleSectionChange('Hygiene')}
              className={cn(
                "flex-1 text-sm font-medium py-2 rounded-full transition-all",
                activeSection === 'Hygiene' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Hygiene
            </button>
          </div>

          {/* Categories for active section */}
          {activeSection !== 'Hygiene' && (
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {CATEGORIES[activeSection].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-full text-[15px] font-medium transition-all",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground border border-muted/20 hover:border-primary/30 hover:bg-muted/10"
                  )}
                >
                  {category.replace('All Understand', 'All').replace('All Manage', 'All')}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {searchQuery && filteredArticles.length > 0 && (
        <div className="text-sm font-medium text-muted-foreground">
          Showing results for "{searchQuery}"
        </div>
      )}

      <motion.div layout className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredArticles.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center text-muted-foreground px-6 border-2 border-dashed border-muted/20 rounded-3xl bg-card/50"
            >
              <p className="text-[15px]">No articles found for "{searchQuery}" — try a different word.</p>
            </motion.div>
          ) : (
            filteredArticles.map(article => (
              article.type === 'OFFICIAL' ? (
                <motion.a
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left bg-card p-4 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-muted/20 hover:border-primary/40 hover:shadow-md transition-colors group relative overflow-hidden"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex flex-shrink-0 items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      {article.icon}
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="inline-flex items-center space-x-1 bg-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1.5 border border-indigo-200/50">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Official Source: {article.sourceName}</span>
                      </div>
                      
                      <h3 className="font-serif font-bold text-foreground line-clamp-2 text-[17px] leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-[14px] text-muted-foreground line-clamp-2 mt-1.5 leading-snug">
                        {article.teaser}
                      </p>
                      <div className="mt-3 flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                        Read on {article.sourceName} <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              ) : (
                <motion.button
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className="w-full text-left bg-card p-4 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-muted/20 hover:border-primary/40 hover:shadow-md transition-colors group flex items-start space-x-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex flex-shrink-0 items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {article.icon}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="inline-flex items-center space-x-1 bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1.5 border border-emerald-200/50">
                      <Heart className="w-3 h-3" />
                      <span>From our team</span>
                    </div>
                    
                    <h3 className="font-serif font-bold text-foreground line-clamp-2 text-[17px] leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-[14px] text-muted-foreground line-clamp-2 mt-1.5 leading-snug">
                      {article.teaser}
                    </p>
                    <div className="flex items-center text-[11px] text-muted-foreground/80 mt-2.5 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.time}
                    </div>
                  </div>
                </motion.button>
              )
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
