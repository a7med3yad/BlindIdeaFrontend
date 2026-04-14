import { Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useCallback, useState } from 'react';
import StarRating from '../../ui/StarRating';
import { useRateIdea, useDeleteIdea, useRemoveRating } from '../../../hooks/useIdeas';
import type { Idea } from '../../../types/idea.types';
import { formatTimeAgo } from '../../../utils/time';

interface IdeaCardProps {
  idea: Idea;
  index?: number;
}

export default function IdeaCard({ idea, index = 0 }: IdeaCardProps) {
  const { mutate: rateIdea } = useRateIdea();
  const { mutate: deleteIdea, isPending: isDeleting } = useDeleteIdea();
  const { mutate: removeRating } = useRemoveRating();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleRate = (score: number) => {
    if (score === idea.userRating) {
      removeRating(idea.id);
    } else {
      rateIdea({ ideaId: idea.id, data: { score } });
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const card = cardRef.current;
    if (!card) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = card.offsetWidth;
    const startHeight = card.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(280, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(180, startHeight + (moveEvent.clientY - startY));
      card.style.width = `${newWidth}px`;
      card.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Reset size on double-click of the handle
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const card = cardRef.current;
    if (!card) return;
    card.style.width = '';
    card.style.height = '';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={isResizing ? undefined : { scale: 1.02 }}
      style={{ overflow: 'visible' }}
    >
      <div
        ref={cardRef}
        className="idea-card-resizable bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 md:p-6 hover:border-[#E8003D]/30 hover:shadow-[0_0_40px_rgba(232,0,61,0.06)] transition-[border,box-shadow] duration-200 space-y-3 relative group/card"
        style={{ minWidth: 280, minHeight: 180 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-white leading-tight break-words">
              {idea.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-[#555555]">{formatTimeAgo(idea.createdAt)}</span>
              {idea.isOwner ? (
                <span className="h-6 px-2.5 rounded-md text-[11px] font-semibold bg-[#E8003D]/10 text-[#E8003D] border border-[#E8003D]/25">
                  Your idea
                </span>
              ) : idea.userRating ? (
                <span className="h-6 px-2.5 rounded-md text-[11px] font-semibold bg-white/5 text-[#AAAAAA] border border-[#2A2A2A]">
                  Rated {idea.userRating}★
                </span>
              ) : null}
            </div>
          </div>
          {idea.isOwner && (
            <button
              type="button"
              onClick={() => deleteIdea(idea.id)}
              disabled={isDeleting}
              className="p-1.5 text-[#555555] hover:text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              title="Delete idea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-[#AAAAAA] text-[13px] md:text-sm leading-[1.6] break-words whitespace-pre-wrap flex-1 overflow-auto">
          {idea.content}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#F59E0B]" fill="#F59E0B" />
              <span className="text-sm font-semibold text-white">
                {idea.averageRating > 0 ? idea.averageRating.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-[#555555]">
                ({idea.totalRatings})
              </span>
            </div>
            {!idea.isOwner ? (
              <span className="text-xs text-[#555555]">
                Your rating
              </span>
            ) : null}
          </div>

          {idea.isOwner ? (
            <div className="text-xs text-[#555555] font-medium">
              You can't rate your own idea
            </div>
          ) : (
            <StarRating
              value={idea.userRating ?? 0}
              onChange={handleRate}
              size={16}
            />
          )}
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          className="absolute bottom-1.5 right-1.5 w-7 h-7 flex items-center justify-center cursor-nwse-resize rounded-lg opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-white/5 active:bg-white/10"
          title="Drag to resize · Double-click to reset"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-[#555555]">
            <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
            <circle cx="10.5" cy="10.5" r="1" fill="currentColor" />
            <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
            <circle cx="4.5" cy="10.5" r="1" fill="currentColor" />
            <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
            <circle cx="10.5" cy="4.5" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
