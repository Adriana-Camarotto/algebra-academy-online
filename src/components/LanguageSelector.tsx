
import React from 'react';
import { useAuthStore } from '@/lib/auth';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAuthStore();
  
  return (
    <div className="relative flex items-center">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'uk' | 'pt')}
        className="appearance-none bg-transparent border-none text-sm cursor-pointer focus:outline-none pr-8"
        aria-label="Select language"
      >
        <option value="en">🇺🇸 EN (US)</option>
        <option value="uk">🇬🇧 EN (UK)</option>
        <option value="pt">🇧🇷 PT</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
        <svg className="h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
