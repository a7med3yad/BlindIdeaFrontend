import { motion } from 'framer-motion';
import SubmitIdeaForm from '../components/features/idea/SubmitIdeaForm';
import IdeaList from '../components/features/idea/IdeaList';
import { useTeamIdeas } from '../hooks/useIdeas';
import PageHeader from '../components/layout/PageHeader';

export default function IdeasPage() {
  const { data: ideas, isLoading } = useTeamIdeas();

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Ideas"
        subtitle="Share and rate ideas anonymously with your team."
      />

      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
            {/* Left — Submit Form */}
            <div>
              <div className="lg:sticky lg:top-24">
                <SubmitIdeaForm />
              </div>
            </div>

            {/* Right — Ideas List */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Team Ideas
                {ideas && ideas.length > 0 && (
                  <span className="text-[#555555] font-normal text-sm">
                    ({ideas.length})
                  </span>
                )}
              </h2>
              <IdeaList ideas={ideas} isLoading={isLoading} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
