import { ChevronLeft, ChevronRight, GripVertical, Clock, X, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-hot-toast';
import { getDrafts, type Post } from '@/lib/api';
import { SEO } from '@/components/seo/SEO';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ScheduledPost extends Post {
    day: number;
    time?: string;
    platform: string;
}

export function Calendar() {
    const mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [drafts, setDrafts] = useState<Post[]>([]);
    const [loadingDrafts, setLoadingDrafts] = useState(false);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingDrop, setPendingDrop] = useState<{ id: string, day: number } | null>(null);
    const [scheduleTime, setScheduleTime] = useState("09:00");

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        setLoadingDrafts(true);
        try {
            const data = await getDrafts();
            setDrafts(data);
        } catch {
            console.error("Failed to load drafts");
        } finally {
            setLoadingDrafts(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && (over.id as string).startsWith('day-')) {
            const day = parseInt((over.id as string).replace('day-', ''));
            const draft = drafts.find(d => d.id === active.id) ||
                // Also check viral drops if any
                (VIRAL_DROPS.find(d => d.id === active.id) as unknown as Post);

            if (draft) {
                setPendingDrop({ id: draft.id, day });
                setModalOpen(true);
            }
        }
    };

    const confirmSchedule = async () => {
        if (pendingDrop) {
            const draft = drafts.find(d => d.id === pendingDrop.id);
            if (draft) {
                // Ideally call API to update status to SCHEDULED here
                setScheduledPosts([...scheduledPosts, { ...draft, day: pendingDrop.day, time: scheduleTime, platform: (draft as unknown as { platform: string }).platform || 'twitter' }]);
                setDrafts(drafts.filter(d => d.id !== draft.id)); // Remove from drafts
                toast.success("Post scheduled!");
            }
        }
        setModalOpen(false);
        setPendingDrop(null);
    };

    const VIRAL_DROPS = mockMode ? [
        { id: 'v1', content: "Stop scrolling. Read this if you want to scale. 🛑 #GrowthHacking", platform: 'twitter', isViral: true, status: 'DRAFT' },
        { id: 'v2', content: "My morning routine for max productivity (Thread) 🧵", platform: 'linkedin', isViral: true, status: 'DRAFT' },
        { id: 'v3', content: "POV: You just hit $10k MRR. 🍾", platform: 'instagram', isViral: true, status: 'DRAFT' },
    ] : [];



    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const startPadding = getFirstDayOfMonth(currentDate);
    const endPadding = 42 - (daysInMonth + startPadding); // Ensure 6 rows for consistency

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SEO title="Calendar" description="Schedule your viral posts." />
            <div className="flex h-screen overflow-hidden">
                {/* Main Calendar Area */}
                <div className="flex-1 p-8 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-white text-glow">Calendar</h1>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-md text-white"><ChevronLeft className="w-4 h-4" /></button>
                            <span className="font-semibold w-40 text-center text-white">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-md text-white"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex-1 flex flex-col shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
                            {DAYS.map(day => (
                                <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground border-r border-white/10 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                            {Array.from({ length: startPadding }).map((_, i) => (
                                <div key={`empty-start-${i}`} className="border-b border-r border-white/10 bg-black/20" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => (
                                <CalendarDay
                                    key={i + 1}
                                    day={i + 1}
                                    posts={scheduledPosts.filter(p => p.day === i + 1)}
                                />
                            ))}
                            {Array.from({ length: endPadding > 0 ? endPadding : 0 }).map((_, i) => (
                                <div key={`empty-end-${i}`} className="border-b border-r border-white/10 bg-black/20" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Drafts */}
                <div className="w-80 bg-black/40 border-l border-white/10 p-6 overflow-y-auto">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                        Saved Drafts
                    </h2>

                    {loadingDrafts ? (
                        <div className="text-center py-4"><Loader2 className="animate-spin w-5 h-5 mx-auto text-primary" /></div>
                    ) : (
                        <div className="space-y-3 mb-8">
                            {drafts.length === 0 ? <p className="text-muted-foreground text-sm">No drafts found.</p> : null}
                            {drafts.map(draft => (
                                <DraggableDraft key={draft.id} draft={draft} />
                            ))}
                        </div>
                    )}

                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-400" />
                        Viral Daily Drops
                    </h2>
                    <div className="space-y-3">
                        {VIRAL_DROPS.map((viral) => (
                            <DraggableDraft key={viral.id} draft={viral as unknown as Post} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeId ? (
                    <div className="bg-primary/90 text-white p-3 rounded shadow-xl w-64 cursor-grabbing transform rotate-3">
                        Dragging Post...
                    </div>
                ) : null}
            </DragOverlay>

            {/* Scheduling Modal */}
            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-gray-900/95 p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-white">Schedule Post</Dialog.Title>
                            <Dialog.Description className="text-sm text-muted-foreground">
                                Set the time for this post to go live.
                            </Dialog.Description>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium text-white">Time</label>
                                <div className="col-span-3 relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium text-white">Add-ons</label>
                                <div className="col-span-3 flex gap-2">
                                    <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded">#Hashtags</span>
                                    <span className="text-xs bg-white/5 text-muted-foreground border border-white/10 px-2 py-1 rounded">Location</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-white">Cancel</button>
                            <button onClick={confirmSchedule} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium">Confirm Schedule</button>
                        </div>
                        <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4 text-white" />
                            <span className="sr-only">Close</span>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </DndContext>
    );
}

function CalendarDay({ day, posts }: { day: number, posts: ScheduledPost[] }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `day-${day}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "border-b border-r border-white/10 p-2 min-h-[100px] relative transition-colors",
                isOver ? "bg-primary/20" : "hover:bg-white/5"
            )}
        >
            <span className="text-sm font-medium text-muted-foreground">{day}</span>
            <div className="mt-2 space-y-1">
                {posts.map((post, i) => (
                    <div key={i} className="text-xs bg-secondary/20 text-secondary-foreground p-1.5 rounded-sm border border-secondary/30 truncate flex justify-between">
                        <span className="truncate flex-1">{post.content}</span>
                        <span className="opacity-70 ml-1">{post.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DraggableDraft({ draft }: { draft: Post }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: draft.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const platform = (draft as unknown as { platform: string }).platform || 'twitter';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-card border border-white/10 p-3 rounded-lg shadow-sm cursor-grab hover:border-primary/50 transition-colors group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                    platform === 'twitter' ? "bg-black text-white" :
                        platform === 'instagram' ? "bg-pink-600 text-white" : "bg-blue-700 text-white"
                )}>
                    {platform}
                </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-white transition-colors">{draft.content}</p>
        </div>
    )
}
