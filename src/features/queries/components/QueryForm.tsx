import { useState, useRef, useEffect } from 'react';
import type { QueryFormData } from '../types/query.types';
import { CATEGORIES } from '../mocks/query.mock';
import type { ValidationErrors } from '../utils/queryValidationUtils';

interface Props {
  errors: ValidationErrors;
  isSubmitting: boolean;
  onSubmit: (data: QueryFormData) => void;
  onCancel: () => void;
}

export function QueryForm({ errors, isSubmitting, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function addTag(raw: string) {
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }
    setTagInput('');
  }
  

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
    title,
    description,
    category,
    tags,
    attachment,
  });
  }

  const canSubmit = title.trim() && description.trim() && category && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-0">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="q-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          ref={titleRef}
          id="q-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Stipend not credited this month"
          maxLength={200}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-w-0 break-words ${
            errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between items-start gap-2">
          {errors.title ? (
            <p className="text-xs text-red-600 min-w-0 break-words">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400 shrink-0">{title.length}/200</span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="q-desc" className="text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="q-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue in detail..."
          rows={5}
          maxLength={2000}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed min-w-0 break-words ${
            errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between items-start gap-2">
          {errors.description ? (
            <p className="text-xs text-red-600 min-w-0 break-words">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400 shrink-0">{description.length}/2000</span>
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="q-category" className="text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="q-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-w-0 ${
            errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-600 min-w-0 break-words">{errors.category}</p>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="q-tags" className="text-sm font-medium text-gray-700">
          Tags (optional)
        </label>
        <div
          className={`flex flex-wrap gap-1.5 px-3 py-2 border rounded-lg text-sm min-w-0 break-words bg-white focus-within:ring-2 focus-within:ring-blue-500 ${
            isSubmitting ? 'bg-gray-100' : ''
          } border-gray-300`}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs min-w-0 break-words"
            >
              #{tag}
              <button
                type="button"
                onClick={() => !isSubmitting && removeTag(tag)}
                disabled={isSubmitting}
                className="text-blue-400 hover:text-blue-700 disabled:cursor-not-allowed leading-none"
              >
                ×
              </button>
            </span>
          ))}
          <input
            id="q-tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => tagInput && addTag(tagInput)}
            placeholder={tags.length === 0 ? 'Add tags (press Enter to add)' : ''}
            disabled={isSubmitting}
            className="flex-1 min-w-24 py-0.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-400">Press Enter or comma to add a tag</p>
      </div>

      {/* Attachment */}
<div className="flex flex-col gap-1.5">
  <label htmlFor="q-attachment" className="text-sm font-medium text-gray-700">
    Attachment (optional)
  </label>

  <input
    id="q-attachment"
    type="file"
    accept=".jpg,.jpeg,.png,.pdf"
    disabled={isSubmitting}
    onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
  />

  {attachment && (
    <p className="text-xs text-green-600">
      Selected: {attachment.name}
    </p>
  )}

  <p className="text-xs text-gray-400">
    Upload screenshots, PDFs, or supporting documents.
  </p>
</div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed min-w-0"
        >
          {isSubmitting ? 'Submitting…' : 'Raise Query'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-0"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}