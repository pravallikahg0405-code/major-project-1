import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Edit3, Check, Sparkles } from 'lucide-react';

export interface SkillTagInputProps {
  label: string;
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  helperText?: string;
  badgeVariant?: 'brand' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'slate';
  icon?: React.ReactNode;
}

export const SkillTagInput: React.FC<SkillTagInputProps> = ({
  label,
  skills = [],
  onChange,
  placeholder = 'Type a skill and press comma or Enter...',
  suggestions = [],
  helperText,
  badgeVariant = 'brand',
  icon
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync bulk text when entering text mode or when skills update externally
  useEffect(() => {
    if (!isTextMode) {
      setBulkText(skills.join(', '));
    }
  }, [skills, isTextMode]);

  // Variant color definitions
  const badgeColors: Record<string, string> = {
    brand: 'bg-brand-500/15 border-brand-500/35 text-brand-300 hover:border-brand-400',
    emerald: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 hover:border-emerald-400',
    amber: 'bg-amber-500/15 border-amber-500/35 text-amber-300 hover:border-amber-400',
    purple: 'bg-purple-500/15 border-purple-500/35 text-purple-300 hover:border-purple-400',
    cyan: 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300 hover:border-cyan-400',
    slate: 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
  };

  const currentBadgeColor = badgeColors[badgeVariant] || badgeColors.brand;

  // Add one or more skills with case-insensitive deduplication
  const addSkills = (incoming: string[]) => {
    const seen = new Set(skills.map(s => s.toLowerCase().trim()));
    const toAdd: string[] = [];

    for (const item of incoming) {
      const clean = item.trim();
      if (clean && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        toAdd.push(clean);
      }
    }

    if (toAdd.length > 0) {
      onChange([...skills, ...toAdd]);
    }
  };

  const removeSkill = (indexToRemove: number) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Handle comma typed or pasted
    if (val.includes(',')) {
      const parts = val.split(',');
      const lastPart = parts.pop() || '';
      const completed = parts.map(p => p.trim()).filter(Boolean);

      if (completed.length > 0) {
        addSkills(completed);
      }
      setInputValue(lastPart);
      setSelectedSuggestionIndex(-1);
    } else {
      setInputValue(val);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Enter pressed
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
        addSkills([filteredSuggestions[selectedSuggestionIndex]]);
        setInputValue('');
        setSelectedSuggestionIndex(-1);
        return;
      }

      if (inputValue.trim()) {
        addSkills([inputValue.trim()]);
        setInputValue('');
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      // Remove last skill on backspace in empty input
      removeSkill(skills.length - 1);
    } else if (e.key === 'ArrowDown' && filteredSuggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp' && filteredSuggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',')) {
      e.preventDefault();
      const tokens = pasted.split(',').map(s => s.trim()).filter(Boolean);
      if (tokens.length > 0) {
        addSkills(tokens);
      }
      setInputValue('');
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Prevent closing if clicking inside dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
      return;
    }

    if (inputValue.trim()) {
      addSkills([inputValue.trim()]);
      setInputValue('');
    }
    setTimeout(() => {
      setIsFocused(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  // Text Mode (Bulk comma-separated editor)
  const handleBulkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBulkText(text);

    const parsed = text
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Case-insensitive deduplication
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const item of parsed) {
      const lower = item.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        deduped.push(item);
      }
    }
    onChange(deduped);
  };

  // Autocomplete matching
  const trimmedInput = inputValue.trim().toLowerCase();
  const filteredSuggestions = trimmedInput.length >= 1
    ? (suggestions || [])
        .filter(s => s.toLowerCase().includes(trimmedInput))
        .filter(s => !skills.some(existing => existing.toLowerCase() === s.toLowerCase()))
        .slice(0, 8)
    : [];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
          <span className="text-[10px] font-normal text-slate-500">
            ({skills.length} {skills.length === 1 ? 'skill' : 'skills'})
          </span>
        </label>
        <button
          type="button"
          onClick={() => {
            if (!isTextMode) {
              setBulkText(skills.join(', '));
            }
            setIsTextMode(!isTextMode);
          }}
          className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-800"
          title={isTextMode ? 'Switch to interactive tags view' : 'Switch to comma-separated text view'}
        >
          <Edit3 className="w-3 h-3" />
          <span>{isTextMode ? 'Chips View' : 'Edit as Text'}</span>
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      {isTextMode ? (
        <div>
          <input
            type="text"
            value={bulkText}
            onChange={handleBulkChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 transition-colors"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Type values separated by commas. Each comma automatically updates your resume without duplicating skills.
          </span>
        </div>
      ) : (
        <div className="relative">
          <div
            onClick={() => inputRef.current?.focus()}
            className={`w-full min-h-[42px] px-2.5 py-1.5 bg-slate-950 border rounded-lg flex flex-wrap items-center gap-1.5 cursor-text transition-colors ${
              isFocused ? 'border-brand-400 ring-1 ring-brand-400/20' : 'border-slate-800'
            }`}
          >
            {/* Rendered Skill Chips */}
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all animate-fadeIn ${currentBadgeColor}`}
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(index);
                  }}
                  className="opacity-70 hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Inline Input for typing with commas */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              placeholder={skills.length === 0 ? placeholder : 'Add more (press comma or Enter)...'}
              className="flex-1 min-w-[140px] bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none py-1 px-1"
            />
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isFocused && filteredSuggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl shadow-black/60 overflow-hidden divide-y divide-slate-800/60"
            >
              <div className="px-2.5 py-1.5 bg-slate-950/80 text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  Suggested Matching Skills
                </span>
                <span className="text-[9px] text-slate-500">Press Enter or click to add</span>
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {filteredSuggestions.map((suggestion, sIdx) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // keep focus
                      addSkills([suggestion]);
                      setInputValue('');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      selectedSuggestionIndex === sIdx
                        ? 'bg-brand-500/20 text-brand-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{suggestion}</span>
                    <Plus className="w-3.5 h-3.5 text-brand-400 opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
