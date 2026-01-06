import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Thread } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import { SENTIMENTS } from '@/lib/constants';
import { TickerWidget } from './TickerWidget';
import {
    Plus,
    MessageSquare,
    Share2,
    Link as LinkIcon,
    X,
    Send,
    Image as ImageIcon,
    Activity,
    Lock,
    Unlock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to get top reaction from reactions object
function getTopReaction(reactions: Record<string, number> | undefined): { emoji: string; count: number } | null {
    if (!reactions || Object.keys(reactions).length === 0) return null;
    
    const entries = Object.entries(reactions);
    const topReaction = entries.sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    const totalCount = Object.values(reactions).reduce((a, b) => (a as number) + (b as number), 0);
    
    return { emoji: topReaction[0], count: totalCount };
}

interface CardProps {
    data: Thread;
    onDragStart: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
    isDragging: boolean;
    isSelected: boolean;
    updateThread: (id: string, data: Partial<Thread>) => void;
    user: User | null;
    connectMode: boolean;
    setConnectMode: (id: string) => void;
    addComment: (threadId: string, comment: { text: string }) => void;
    isDimmed: boolean;
    toggleSelection: (id: string) => void;
    darkMode: boolean;
    onQuickSpawn: (id: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
    onShare: (id: string) => void | Promise<void>;
    creatorName?: string;
    onReact: (id: string, emoji: string) => void;
}

export const Card: React.FC<CardProps> = ({
    data, onDragStart, isDragging, isSelected, updateThread, user, setConnectMode, connectMode, addComment, isDimmed, toggleSelection, darkMode, onQuickSpawn, onShare, creatorName, onReact
}) => {
    const [localTitle, setLocalTitle] = useState(data.title || '');
    const [localContent, setLocalContent] = useState(data.content || '');
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newTag, setNewTag] = useState('');
    const [showTagInput, setShowTagInput] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [showTickerInput, setShowTickerInput] = useState(false);
    const [tickerInput, setTickerInput] = useState('');
    const [imageError, setImageError] = useState<Record<string, boolean>>({});

    const sentimentKey = data.sentiment || 'neutral';
    // Validate sentiment key to prevent object injection
    const sentiment = (sentimentKey in SENTIMENTS) 
        ? SENTIMENTS[sentimentKey as keyof typeof SENTIMENTS]
        : SENTIMENTS.neutral;
    const theme = darkMode ? sentiment.dark : sentiment.light;
    const SentimentIcon = sentiment.icon;
    const titleInputRef = useRef<HTMLInputElement>(null);
    
    // Check if the current user is the owner of this card
    const isOwner = user && data.author === user.id;

    // Calculate top reaction for display
    const topReaction = getTopReaction(data.reactions);

    useEffect(() => {
        if (data.isNewSpawn && titleInputRef.current) {
            titleInputRef.current.focus();
            updateThread(data.id, { isNewSpawn: false });
        }
    }, [data.isNewSpawn, data.id, updateThread]);

    const handleReaction = (emoji: string) => {
        onReact(data.id, emoji);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (addComment) {
            addComment(data.id, { text: newComment });
        }
        setNewComment('');
    };

    const cycleSentiment = (e: React.MouseEvent) => {
        e.stopPropagation();
        const keys = Object.keys(SENTIMENTS) as Array<keyof typeof SENTIMENTS>;
        const currentIndex = keys.indexOf(data.sentiment || 'neutral');
        const nextSentiment = keys[(currentIndex + 1) % keys.length];
        updateThread(data.id, { sentiment: nextSentiment });
    };

    return (
        <div
            className={cn(
                `absolute w-72 rounded-xl shadow-lg transition-all duration-200 flex flex-col backdrop-blur-md group border`,
                theme.bg, theme.border,
                isDragging ? 'cursor-grabbing shadow-2xl scale-105 z-50' : data.locked ? 'cursor-default z-10' : 'cursor-grab hover:shadow-xl z-20',
                isSelected ? `ring-2 ${theme.ring} ring-offset-2 ${darkMode ? 'ring-offset-slate-900' : 'ring-offset-white'} z-40` : '',
                connectMode ? 'hover:ring-4 hover:ring-blue-400' : '',
                isDimmed ? 'opacity-20 grayscale scale-95 pointer-events-none' : 'opacity-100'
            )}
            style={{ transform: `translate(${data.x}px, ${data.y}px)`, touchAction: 'none' }}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                const tagName = target.tagName;
                if (tagName && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(tagName)) return;
                if (data.locked && !e.shiftKey) return;
                if (connectMode) { e.stopPropagation(); setConnectMode(data.id); }
                else if (!showComments && !showImageInput) {
                    if (e.shiftKey) { e.stopPropagation(); toggleSelection(data.id); }
                    else if (!data.locked) onDragStart(e, data.id);
                }
            }}
            onTouchStart={(e) => {
                const target = e.target as HTMLElement;
                const tagName = target?.tagName;
                if (tagName && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(tagName)) return;
                if (connectMode) { e.stopPropagation(); setConnectMode(data.id); }
                else if (!showComments && !showImageInput && !data.locked) onDragStart(e, data.id);
            }}
        >
            {!data.locked && !isDragging && (
                <>
                    <button onMouseDown={(e) => { e.stopPropagation(); onQuickSpawn(data.id, 'right'); }} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-50"><Plus size={14} /></button>
                    <button onMouseDown={(e) => { e.stopPropagation(); onQuickSpawn(data.id, 'bottom'); }} className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-50"><Plus size={14} /></button>
                    <button onMouseDown={(e) => { e.stopPropagation(); onQuickSpawn(data.id, 'left'); }} className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-50"><Plus size={14} /></button>
                    <button onMouseDown={(e) => { e.stopPropagation(); onQuickSpawn(data.id, 'top'); }} className="absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-50"><Plus size={14} /></button>
                </>
            )}

            {/* Header */}
            <div className="p-3 pb-1">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                        <button onClick={!data.locked ? cycleSentiment : undefined} className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border border-transparent cursor-pointer shadow-sm ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/60 hover:bg-white/90'}`}>
                            <SentimentIcon size={12} className={theme.text} />
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${theme.text}`}>{sentiment.label}</span>
                        </button>
                        {isOwner && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`} title="You own this card">
                                YOU
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1 items-center">
                        <button onClick={(e) => { e.stopPropagation(); void onShare(data.id); }} className={`p-1.5 hover:bg-white/20 rounded transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} title="Share Link"><Share2 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); updateThread(data.id, { locked: !data.locked }); }} className={`p-1.5 rounded transition-colors ${data.locked ? 'text-indigo-500' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>{data.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
                        {!data.locked && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); setShowTickerInput(!showTickerInput); setShowImageInput(false); }} className={`p-1.5 hover:bg-white/20 rounded transition-colors ${showTickerInput ? 'text-indigo-500' : 'text-slate-400'}`} title="Add Ticker"><Activity size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); setShowImageInput(!showImageInput); setShowTickerInput(false); }} className={`p-1.5 hover:bg-white/20 rounded transition-colors ${showImageInput ? 'text-indigo-500' : 'text-slate-400'}`}><ImageIcon size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); setConnectMode(data.id); }} className={`p-1.5 hover:bg-white/20 rounded transition-colors ${connectMode ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400'}`}><LinkIcon size={14} /></button>
                            </>
                        )}
                    </div>
                </div>
                <input ref={titleInputRef} disabled={data.locked} type="text" value={localTitle} onChange={(e) => { setLocalTitle(e.target.value); updateThread(data.id, { title: e.target.value }); }} className={`w-full bg-transparent font-bold text-lg focus:outline-none ${theme.text} placeholder-slate-500/50`} placeholder="Topic..." onMouseDown={(e) => e.stopPropagation()} />
            </div>

            {/* Ticker Input & Widget */}
            {showTickerInput && !data.locked && (
                <form onSubmit={(e) => { e.preventDefault(); if (tickerInput.trim()) { updateThread(data.id, { ticker: tickerInput.toUpperCase() }); setShowTickerInput(false); setTickerInput(''); } }} className="px-3 pb-2">
                    <div className="flex gap-2">
                        <input type="text" value={tickerInput} onChange={(e) => { setTickerInput(e.target.value); }} placeholder="Symbol (e.g. BTC)" className={`flex-1 text-xs px-2 py-1 rounded border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-indigo-200 text-slate-800'}`} autoFocus />
                        <button type="submit" className="bg-indigo-500 text-white p-1 rounded hover:bg-indigo-600"><Plus size={12} /></button>
                    </div>
                </form>
            )}
            {data.ticker && (
                <div className="px-3 relative group">
                    <TickerWidget symbol={data.ticker} sentiment={data.sentiment} darkMode={darkMode} />
                    {!data.locked && <button onClick={() => { updateThread(data.id, { ticker: null }); }} className="absolute top-1 right-4 bg-black/50 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>}
                </div>
            )}

            {/* Image Input & Image */}
            {showImageInput && !data.locked && (
                <form onSubmit={(e) => { e.preventDefault(); if (imageUrlInput.trim()) { updateThread(data.id, { imageUrl: imageUrlInput }); setShowImageInput(false); setImageUrlInput(''); } }} className="px-3 pb-2">
                    <div className="flex gap-2">
                        <input type="text" value={imageUrlInput} onChange={(e) => { setImageUrlInput(e.target.value); }} placeholder="Paste image URL..." className={`flex-1 text-xs px-2 py-1 rounded border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-indigo-200 text-slate-800'}`} autoFocus />
                        <button type="submit" className="bg-indigo-500 text-white p-1 rounded hover:bg-indigo-600"><Plus size={12} /></button>
                    </div>
                </form>
            )}
            {data.imageUrl && !imageError[data.imageUrl] && (
                <div className="px-3 pb-2">
                    <div className="relative group rounded-lg overflow-hidden border border-black/5 bg-white h-32">
                        <Image 
                            src={data.imageUrl} 
                            alt="Chart" 
                            fill 
                            className="object-cover" 
                            onError={() => {
                                const imageUrl = data.imageUrl;
                                if (imageUrl) {
                                    setImageError(prev => ({ ...prev, [imageUrl]: true }));
                                }
                            }}
                        />
                        {!data.locked && <button onClick={() => { updateThread(data.id, { imageUrl: null }); }} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><X size={10} /></button>}
                    </div>
                </div>
            )}

            {/* Body */}
            <div className="px-3 pb-2">
                <textarea disabled={data.locked} value={localContent} onChange={(e) => { setLocalContent(e.target.value); updateThread(data.id, { content: e.target.value }); }} className={`w-full bg-transparent resize-none text-sm focus:outline-none min-h-[50px] leading-relaxed font-medium ${darkMode ? 'text-slate-300 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'}`} placeholder="Analysis..." onMouseDown={(e) => e.stopPropagation()} />
            </div>

            {/* Tags */}
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {data.tags && data.tags.map(tag => (
                    <span key={tag} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${darkMode ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-white/50 text-slate-600 border-white/20'}`}>
                        {tag}
                        {!data.locked && <button onClick={() => { updateThread(data.id, { tags: data.tags?.filter(t => t !== tag) }); }} className="ml-1 hover:text-red-500"><X size={8} /></button>}
                    </span>
                ))}
                {!data.locked && (
                    showTagInput ? (
                        <form onSubmit={(e) => { e.preventDefault(); if (newTag.trim()) { updateThread(data.id, { tags: [...(data.tags || []), newTag.trim().toUpperCase()] }); setNewTag(''); setShowTagInput(false); } }} className="flex items-center">
                            <input autoFocus type="text" value={newTag} onChange={(e) => { setNewTag(e.target.value); }} onBlur={() => { setShowTagInput(false); }} className={`w-16 text-xs rounded px-1 py-0.5 outline-none ${darkMode ? 'bg-slate-800 text-white' : 'bg-white/70'}`} placeholder="TAG" />
                        </form>
                    ) : (
                        <button onClick={() => { setShowTagInput(true); }} className="p-0.5 text-slate-400 hover:text-slate-500"><Plus size={12} /></button>
                    )
                )}
            </div>

            {/* Footer */}
            <div className={`px-3 py-2 backdrop-blur-sm rounded-b-xl flex justify-between items-center border-t ${darkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/40 border-white/20'}`}>
                <div className="flex items-center gap-2 group/footer">
                    <div className={`flex items-center gap-1 rounded-full px-1.5 py-1 transition-colors ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/40 hover:bg-white/80'}`}>
                        <button onClick={() => { handleReaction('🚀'); }} className="text-xs hover:scale-125 transition-transform" title="To the moon">🚀</button>
                        <button onClick={() => { handleReaction('📉'); }} className="text-xs hover:scale-125 transition-transform" title="Short it">📉</button>
                        <button onClick={() => { handleReaction('💎'); }} className="text-xs hover:scale-125 transition-transform" title="Diamond Hands">💎</button>
                    </div>
                    {topReaction && (
                        <div className="text-[10px] text-slate-500 font-bold ml-1">
                            {topReaction.emoji} {topReaction.count}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {creatorName && <span className="text-[9px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">{creatorName}</span>}
                    <button onClick={() => { setShowComments(!showComments); }} className={`flex items-center gap-1 transition-colors ${showComments ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-500'}`}>
                        <MessageSquare size={12} /><span className="text-[10px] font-medium">{data.comments?.length || 0}</span>
                    </button>
                </div>
            </div>

            {/* Comments */}
            {showComments && (
                <div className={`backdrop-blur-xl border-t rounded-b-xl p-3 max-h-48 overflow-y-auto ${darkMode ? 'bg-slate-900/90 border-slate-700 text-slate-300' : 'bg-white/90 border-slate-200'}`} onMouseDown={e => e.stopPropagation()}>
                    <div className="space-y-3 mb-3">
                        {data.comments?.map((c, i) => (
                            <div key={i} className="text-xs"><div className="flex items-baseline gap-2 mb-0.5"><span className={`font-bold ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>{c.authorName || 'User ' + (c.author ? c.author.slice(0, 3) : '')}</span><span className="text-[9px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString()}</span></div><p className={`leading-snug ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{c.text}</p></div>
                        ))}
                        {(!data.comments || data.comments.length === 0) && <p className="text-xs text-slate-500 italic text-center py-2">No comments yet.</p>}
                    </div>
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input type="text" value={newComment} onChange={(e) => { setNewComment(e.target.value); }} placeholder="Add a comment..." className={`flex-1 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 ${darkMode ? 'bg-slate-800 text-slate-200 placeholder-slate-500' : 'bg-slate-100 text-slate-800'}`} />
                        <button type="submit" className="p-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"><Send size={12} /></button>
                    </form>
                </div>
            )}
        </div>
    );
};
