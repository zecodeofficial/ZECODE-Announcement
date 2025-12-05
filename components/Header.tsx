import React from 'react';
import { Mic2, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ZECODE</h1>
            <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Voice Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Store Announcement Mode</span>
        </div>
      </div>
    </header>
  );
};