import React, { useState } from 'react';
import { Thread } from '@/lib/types';
import { Type } from 'lucide-react';

interface ConnectionLinesProps {
    threads: Thread[];
    zoom: number;
    dimMode: boolean;
    darkMode: boolean;
    updateThread: (id: string, data: Partial<Thread>) => void;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ threads, zoom, dimMode, darkMode, updateThread }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [targetId, setTargetId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const startEditing = (e: React.MouseEvent, threadId: string, connTargetId: string, currentLabel?: string) => {
        e.stopPropagation();
        setEditingId(threadId);
        setTargetId(connTargetId);
        setEditValue(currentLabel || '');
    };

    const saveLabel = (threadId: string, connTargetId: string) => {
        const t = threads.find(th => th.id === threadId);
        if (t) {
            const newLabels = { ...(t.connectionLabels || {}) };
            if (editValue === '') {
                // Safely delete property using Object.prototype.hasOwnProperty
                if (Object.prototype.hasOwnProperty.call(newLabels, connTargetId)) {
                    delete newLabels[connTargetId];
                }
            } else {
                newLabels[connTargetId] = editValue;
            }
            updateThread(threadId, { connectionLabels: newLabels });
        }
        setEditingId(null);
        setTargetId(null);
    };

    const lines: { source: Thread; target: Thread; label: string | null }[] = [];
    threads.forEach(t => {
        if (t.type === 'zone') return;
        let targets: string[] = [];
        if (t.connectedTo) {
            if (Array.isArray(t.connectedTo)) targets = t.connectedTo;
            else targets = [t.connectedTo as unknown as string]; // Handle legacy single string if needed, though type says string[]
        }
        targets.forEach(tid => {
            const target = threads.find(x => x.id === tid);
            if (target) {
                lines.push({
                    source: t,
                    target: target,
                    label: (t.connectionLabels && Object.prototype.hasOwnProperty.call(t.connectionLabels, tid)) ? t.connectionLabels[tid] : null
                });
            }
        });
    });

    return (
        <svg className={`absolute top-0 left-0 w-full h-full overflow-visible -z-10 transition-opacity duration-300 ${dimMode ? 'opacity-10' : 'opacity-100'}`}>
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={darkMode ? "#64748b" : "#94a3b8"} />
                </marker>
            </defs>
            {lines.map(({ source, target, label }) => {
                const startX = source.x + 144;
                const startY = source.y + 60;
                const endX = target.x + 144;
                const endY = target.y + 60;
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                const key = `${source.id}-${target.id}`;

                return (
                    <g key={key} className="group">
                        <path d={`M${startX},${startY} C${startX},${startY + 100} ${endX},${endY - 100} ${endX},${endY}`} stroke="transparent" strokeWidth="24" fill="none" className="pointer-events-auto cursor-pointer" />
                        <path d={`M${startX},${startY} C${startX},${startY + 100} ${endX},${endY - 100} ${endX},${endY}`} stroke={darkMode ? "#475569" : "#cbd5e1"} strokeWidth={2 * (1 / zoom)} fill="none" strokeDasharray="6,4" className="animate-dash pointer-events-none group-hover:stroke-indigo-400" markerEnd="url(#arrowhead)" />
                        <foreignObject x={midX - 75} y={midY - 20} width={150} height={40} className="overflow-visible pointer-events-none">
                            <div className="flex justify-center items-center h-full">
                                {editingId === source.id && targetId === target.id ? (
                                    <div className="pointer-events-auto">
                                        <input autoFocus type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveLabel(source.id, target.id)} onKeyDown={(e) => { if (e.key === 'Enter') saveLabel(source.id, target.id); }} className={`text-[10px] px-2 py-1 rounded shadow-lg outline-none border w-24 text-center ${darkMode ? 'bg-slate-800 text-white border-indigo-500' : 'bg-white text-slate-800 border-indigo-500'}`} placeholder="Label..." />
                                    </div>
                                ) : (
                                    label ? (
                                        <div className={`px-2 py-0.5 text-[9px] rounded-full border shadow-sm cursor-pointer whitespace-nowrap pointer-events-auto ${darkMode ? 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`} onClick={(e) => startEditing(e, source.id, target.id, label ?? undefined)}>{label}</div>
                                    ) : (
                                        <div className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full cursor-pointer pointer-events-auto ${darkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-400 hover:text-slate-600'} shadow-sm border ${darkMode ? 'border-slate-600' : 'border-slate-200'}`} onClick={(e) => startEditing(e, source.id, target.id, label ?? undefined)} title="Add Label"><Type size={12} /></div>
                                    )
                                )}
                            </div>
                        </foreignObject>
                    </g>
                );
            })}
        </svg>
    );
};
