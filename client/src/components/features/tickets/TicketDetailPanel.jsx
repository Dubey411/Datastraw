import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTickets } from '../../../context/TicketContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../common/Badge';
import { Avatar } from '../../common/Avatar';
import { Button } from '../../common/Button';
import { Dropdown } from '../../common/Dropdown';
import { CANNED_MACROS } from '../../../data/initialData';
import {
  X,
  Send,
  Lock,
  MessageSquare,
  Paperclip,
  Smile,
  AtSign,
  Copy,
  Check,
  Clock,
  Calendar,
  Building2,
  Mail,
  User,
  Sparkles,
  Bold,
  Italic,
  Code,
  List,
  AlertCircle,
  FileText,
  Loader2,
  Trash2,
} from 'lucide-react';

export function TicketDetailPanel({ ticket, onClose }) {
  const {
    updateTicketStatus,
    updateTicketPriority,
    addTimelineEntry,
    deleteTicket,
    currentAgent,
  } = useTickets();

  const [composerMode, setComposerMode] = useState('reply'); // 'reply' | 'internal_note'
  const [replyText, setReplyText] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isMacrosOpen, setIsMacrosOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'Urgent', label: 'Urgent' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const copyEmail = () => {
    if (ticket.customer?.email) {
      navigator.clipboard.writeText(ticket.customer.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    // Smooth simulated response delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    addTimelineEntry(ticket.id, replyText, composerMode === 'internal_note' ? 'internal_note' : 'agent_reply');
    setReplyText('');
    setAttachments([]);
    setIsSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const insertFormatting = (prefix, suffix = '') => {
    setReplyText((prev) => prev + `${prefix}text${suffix}`);
  };

  const insertMacro = (macro) => {
    const formatted = macro.content.replace('{customer_name}', ticket.customer?.name || 'Customer');
    setReplyText(formatted);
    setIsMacrosOpen(false);
  };

  const addSimulatedAttachment = () => {
    const sampleFiles = ['error_stacktrace.log', 'screenshot_bug.png', 'har_network_dump.json'];
    const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    if (!attachments.includes(randomFile)) {
      setAttachments([...attachments, randomFile]);
    }
  };

  const emojis = ['👍', '👋', '✅', '🙏', '💡', '🚀', '🔍', '🎉'];

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl bg-white dark:bg-dark-surface shadow-2xl border-l border-slate-200 dark:border-dark-border flex flex-col animate-in slide-in-from-right duration-300 ease-out">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-slate-200/80 dark:border-dark-border bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-dark-text bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
            {ticket.id}
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-dark-border" />
          
          {/* Quick status dropdown with optimistic update */}
          <Dropdown
            items={statusOptions}
            value={ticket.status}
            onChange={(newStatus) => updateTicketStatus(ticket.id, newStatus)}
            trigger={() => (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-full transition-transform active:scale-95"
                title="Change ticket status"
              >
                <StatusBadge status={ticket.status} size="sm" />
              </button>
            )}
          />

          {/* Quick priority dropdown */}
          <Dropdown
            items={priorityOptions}
            value={ticket.priority}
            onChange={(newPriority) => updateTicketPriority(ticket.id, newPriority)}
            trigger={() => (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-md transition-transform active:scale-95"
                title="Change priority"
              >
                <PriorityBadge priority={ticket.priority} size="sm" />
              </button>
            )}
          />
        </div>

        <div className="flex items-center gap-1.5">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-800 text-xs animate-in fade-in zoom-in-95 duration-150">
              <span className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold">Delete?</span>
              <button
                type="button"
                onClick={async () => {
                  await deleteTicket(ticket.id);
                  onClose();
                }}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-1.5 py-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[11px] transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete ticket"
              aria-label="Delete ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close ticket panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Ticket Subject */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-dark-text tracking-tight leading-snug">
            {ticket.subject}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Opened {formatDate(ticket.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Updated {formatDate(ticket.updatedAt)}
            </span>
            <CategoryBadge category={ticket.category} />
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={ticket.customer?.name} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-dark-text truncate">
                  {ticket.customer?.name}
                </h4>
                {ticket.customer?.role && (
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 rounded">
                    {ticket.customer.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span>{ticket.customer?.email}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                  title="Copy customer email"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] block">Organization</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center sm:justify-end gap-1">
              <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              {ticket.customer?.company || 'Direct Client'}
            </span>
          </div>
        </div>

        {/* Conversation & Activity Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-dark-border pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-dark-text uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Activity & Timeline ({ticket.timeline?.length || 0})
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Chronological</span>
          </div>

          <div className="space-y-3.5">
            {ticket.timeline?.map((item, idx) => {
              const isCustomer = item.type === 'customer_message';
              const isInternalNote = item.type === 'internal_note';
              const isSystemEvent = item.type === 'system_event';

              if (isSystemEvent) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-center gap-2 py-1 text-center text-xs text-slate-500 dark:text-slate-400 animate-in fade-in duration-200"
                  >
                    <div className="h-px bg-slate-200 dark:bg-dark-border flex-1" />
                    <span className="bg-white dark:bg-dark-surface px-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 italic">
                      {item.content} • {formatDate(item.timestamp)}
                    </span>
                    <div className="h-px bg-slate-200 dark:bg-dark-border flex-1" />
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 duration-300',
                    isInternalNote
                      ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100'
                      : isCustomer
                      ? 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-dark-border shadow-2xs text-slate-800 dark:text-slate-100'
                      : 'bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/60 shadow-2xs text-slate-800 dark:text-slate-100'
                  )}
                >
                  {/* Author bar */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        name={item.author?.name}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-dark-text">
                            {item.author?.name}
                          </span>
                          <span
                            className={cn(
                              'text-[10px] font-semibold px-1.5 py-0.2 rounded-full uppercase tracking-wider',
                              isInternalNote
                                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                                : isCustomer
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-200'
                            )}
                          >
                            {isInternalNote ? 'Internal Note' : item.author?.role || (isCustomer ? 'Customer' : 'Agent')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </div>

                  {isInternalNote && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center gap-1.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                      <Lock className="w-3 h-3" />
                      <span>Visible only to Datastraw team members</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Reply Composer */}
      <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-lg space-y-3 flex-shrink-0">
        {/* Composer Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setComposerMode('reply')}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150',
                composerMode === 'reply'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              Public Reply
            </button>
            <button
              type="button"
              onClick={() => setComposerMode('internal_note')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150',
                composerMode === 'internal_note'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Lock className="w-3 h-3" />
              Internal Note
            </button>
          </div>

          {/* Quick Macros Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMacrosOpen(!isMacrosOpen)}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-2 py-1 rounded-lg transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Use Macro</span>
            </button>

            {isMacrosOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-72 bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border shadow-dropdown dark:shadow-dropdown-dark p-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-dark-border">
                  Pre-saved Macros
                </div>
                <div className="py-1 max-h-48 overflow-y-auto">
                  {CANNED_MACROS.map((macro) => (
                    <button
                      key={macro.id}
                      type="button"
                      onClick={() => insertMacro(macro)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-surface-hover rounded-lg transition-colors"
                    >
                      <p className="font-semibold text-slate-900 dark:text-dark-text">{macro.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{macro.content}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Area Container */}
        <div
          className={cn(
            'rounded-xl border transition-all duration-200 overflow-hidden focus-within:ring-2',
            composerMode === 'internal_note'
              ? 'border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20 focus-within:ring-amber-500/20 focus-within:border-amber-500'
              : 'border-slate-200 dark:border-dark-border bg-white dark:bg-slate-900/60 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 dark:focus-within:border-indigo-500'
          )}
        >
          {/* Formatting Toolbar */}
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('`', '`')}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                title="Inline Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('\n- ')}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative flex items-center gap-1">
              {/* Attachment */}
              <button
                type="button"
                onClick={addSimulatedAttachment}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Attach file"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              {/* Mention */}
              <button
                type="button"
                onClick={() => setReplyText((prev) => prev + ` @${ticket.customer?.name} `)}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Mention customer"
              >
                <AtSign className="w-3.5 h-3.5" />
              </button>
              {/* Emoji popover */}
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Add emoji"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>

              {isEmojiPickerOpen && (
                <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl p-2 shadow-dropdown dark:shadow-dropdown-dark flex gap-1 z-50">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setReplyText((prev) => prev + ` ${emoji} `);
                        setIsEmojiPickerOpen(false);
                      }}
                      className="text-base p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={
              composerMode === 'internal_note'
                ? 'Leave a private note for your team (visible only internally)...'
                : `Reply to ${ticket.customer?.name} (Ctrl + Enter to send)...`
            }
            className="w-full bg-transparent p-3 text-xs sm:text-sm text-slate-900 dark:text-dark-text placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap">
              {attachments.map((file, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <FileText className="w-3 h-3 text-slate-400" />
                  {file}
                  <button
                    type="button"
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                    className="hover:text-rose-600 dark:hover:text-rose-400 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">Ctrl+Enter</kbd> to send
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant={composerMode === 'internal_note' ? 'secondary' : 'primary'}
              onClick={handleSend}
              isLoading={isSubmitting}
              disabled={!replyText.trim()}
              icon={Send}
            >
              {composerMode === 'internal_note' ? 'Save Note' : 'Send Reply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
