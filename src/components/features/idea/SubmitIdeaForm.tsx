import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { submitIdeaSchema, type SubmitIdeaFormData } from '../../../schemas/idea.schema';
import { useSubmitIdea } from '../../../hooks/useIdeas';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubmitIdeaForm() {
  const [submittedOk, setSubmittedOk] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<SubmitIdeaFormData>({
    resolver: zodResolver(submitIdeaSchema),
    mode: 'onChange',
  });

  const { mutate, isPending } = useSubmitIdea();
  const title = watch('title', '');
  const content = watch('content', '');

  const titlePreview = useMemo(() => {
    const t = (title || '').trim();
    return t.length > 0 ? t : 'Your idea title preview…';
  }, [title]);

  useEffect(() => {
    if (!submittedOk) return;
    const t = window.setTimeout(() => setSubmittedOk(false), 1800);
    return () => window.clearTimeout(t);
  }, [submittedOk]);

  const onSubmit = (data: SubmitIdeaFormData) => {
    mutate(data, {
      onSuccess: () => {
        setSubmittedOk(true);
        window.setTimeout(() => reset(), 650);
      },
    });
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-5 h-5 text-[#E8003D]" />
        <h2 className="text-lg font-bold text-white">Submit an Idea</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Title"
            placeholder="What's your idea?"
            error={errors.title?.message}
            disabled={isPending}
            {...register('title')}
          />
          <div className="mt-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#555555]">
              Title preview
            </div>
            <div className="text-sm font-semibold text-white mt-1 truncate">
              {titlePreview}
            </div>
          </div>
          <p className={`text-xs text-right mt-1 ${title.length > 80 ? 'text-[#EF4444]' : 'text-[#555555]'}`}>
            {title.length}/100
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#AAAAAA] mb-2">
            Content
          </label>
          <textarea
            placeholder="Describe your idea in detail (min. 20 characters)"
            disabled={isPending}
            {...register('content')}
            rows={5}
            className={`
              w-full min-h-[140px] bg-[#1A1A1A] border text-white rounded-lg
              px-4 py-3 text-base placeholder:text-[#555555]
              transition-all duration-200 resize-none
              ${
                errors.content
                  ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/50'
                  : 'border-[#2A2A2A] hover:border-[#3A3A3A] focus:border-[#E8003D] focus:ring-1 focus:ring-[#E8003D]/50'
              }
              focus:outline-none disabled:opacity-50
            `}
          />
          <div className="flex justify-between mt-1">
            {errors.content && (
              <p className="text-xs text-[#EF4444]">{errors.content.message}</p>
            )}
            <p className={`text-xs ml-auto ${content.length > 1000 ? 'text-[#EF4444]' : 'text-[#555555]'}`}>
              {content.length}/1000
            </p>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isPending}
          disabled={!isValid || isPending}
          className="mt-2"
        >
          <Send className="w-4 h-4" />
          {isPending ? 'Submitting...' : 'Submit Anonymously'}
        </Button>
      </form>

      <AnimatePresence>
        {submittedOk ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute inset-x-6 bottom-6"
          >
            <div className="bg-[#E8003D]/10 border border-[#E8003D]/25 rounded-xl px-4 py-3">
              <div className="text-sm font-semibold text-white">Idea submitted</div>
              <div className="text-xs text-[#AAAAAA] mt-0.5">
                Your idea was posted anonymously.
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
