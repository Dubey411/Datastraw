import React, { useState } from 'react';
import { Search, BookOpen, ChevronRight, Key, CreditCard, Webhook, ShieldAlert } from 'lucide-react';

export function KnowledgeBaseView() {
  const [kbSearch, setKbSearch] = useState('');

  const articles = [
    {
      id: 'kb-1',
      title: 'Configuring SSO & SAML 2.0 with Okta & Azure AD',
      category: 'Authentication',
      readTime: '4 min read',
      icon: Key,
      description: 'Step-by-step instructions for enterprise IT admins to map directory groups and configure SP-initiated SAML assertions.',
    },
    {
      id: 'kb-2',
      title: 'Webhook Signature Verification (HMAC-SHA256)',
      category: 'API & Integrations',
      readTime: '3 min read',
      icon: Webhook,
      description: 'Authenticate incoming webhook payloads securely using SHA256 hashes computed over the raw HTTP request body.',
    },
    {
      id: 'kb-3',
      title: 'Handling Duplicate Charges & Invoice Receipts',
      category: 'Billing',
      readTime: '2 min read',
      icon: CreditCard,
      description: 'Understanding authorization holds vs settled charges, triggering proration, and managing seat counts.',
    },
    {
      id: 'kb-4',
      title: 'Troubleshooting File Upload Timeouts & Limits',
      category: 'Technical',
      readTime: '5 min read',
      icon: ShieldAlert,
      description: 'Recommendations for chunked multipart uploads and handling gateway timeouts on CSV files over 15MB.',
    },
  ];

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(kbSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(kbSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="type-eyebrow mb-1">DOCUMENTATION & GUIDES</div>
          <h1 className="type-h2 !text-2xl sm:!text-3xl text-slate-900 dark:text-dark-text tracking-tight">
            Knowledge <em>Base & Guides</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Internal documentation, troubleshooting guides, and API integration references.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={kbSearch}
            onChange={(e) => setKbSearch(e.target.value)}
            placeholder="Search documentation..."
            className="w-full bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-900 dark:text-dark-text rounded-xl border border-slate-200 dark:border-dark-border pl-9 pr-3 py-2 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.readTime}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Read guide</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
