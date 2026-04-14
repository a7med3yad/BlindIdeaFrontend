import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, EyeOff, ShieldCheck, Star } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { PartnersSection } from '../components/features/landing/PartnersSection';

const viewportOnce = { once: true, margin: '-80px' };
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeInOut = [0.65, 0, 0.35, 1] as const;

const revealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const wordItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

function AnimatedWords({
  words,
  className = '',
  wordClassName = '',
}: {
  words: string[];
  className?: string;
  wordClassName?: string;
}) {
  return (
    <motion.span variants={wordContainer} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={wordItem}
          className={`inline-block ${wordClassName}`}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#000000] relative overflow-hidden"
    >
      {/* Landing navbar */}
      <nav className="sticky top-0 z-50 h-16 bg-[#000000]/80 backdrop-blur-xl border-b border-[#1A1A1A]/80">
        <div className="max-w-6xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="shrink-0">
            <Logo size="sm" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-[#AAAAAA] hover:text-white text-sm font-medium transition-colors no-underline">
              Features
            </a>
            <a href="#how" className="text-[#AAAAAA] hover:text-white text-sm font-medium transition-colors no-underline">
              How it works
            </a>
            <a href="#pricing" className="text-[#AAAAAA] hover:text-white text-sm font-medium transition-colors no-underline">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="h-9 px-5 rounded-lg text-sm font-semibold text-[#AAAAAA] hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="h-9 px-5 rounded-lg text-sm font-semibold bg-[#E8003D] hover:bg-[#CC0035] text-white transition-all duration-200 inline-flex items-center hover:shadow-[0_0_32px_rgba(232,0,61,0.35)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-6 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(232,0,61,0.08)_0%,transparent_70%)]">
        {/* Background lightbulb SVG (exact spec) */}
        <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none">
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
              <stop offset="0%" stopColor="#E8003D" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#E8003D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E8003D" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lightBeam" cx="50%" cy="45%" r="60%" fx="50%" fy="45%">
              <stop offset="0%" stopColor="#E8003D" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E8003D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="300" ry="280" fill="url(#lightBeam)" />
          <path
            d="M200 80 C140 80 100 120 100 170
               C100 210 120 240 150 260
               L150 300 L250 300 L250 260
               C280 240 300 210 300 170
               C300 120 260 80 200 80Z"
            fill="none"
            stroke="#E8003D"
            strokeWidth="2"
          />
          <rect x="155" y="300" width="90" height="15" rx="4" fill="#E8003D" opacity="0.6" />
          <rect x="160" y="315" width="80" height="15" rx="4" fill="#E8003D" opacity="0.4" />
          <rect x="165" y="330" width="70" height="12" rx="4" fill="#E8003D" opacity="0.3" />
          <path
            d="M185 260 L185 220 L200 200 L215 220 L215 260"
            fill="none"
            stroke="#E8003D"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <ellipse cx="200" cy="185" rx="60" ry="65" fill="url(#bulbGlow)" />
          <line x1="200" y1="60" x2="200" y2="20" stroke="#E8003D" strokeWidth="1.5" opacity="0.5" />
          <line x1="320" y1="100" x2="350" y2="70" stroke="#E8003D" strokeWidth="1.5" opacity="0.4" />
          <line x1="80" y1="100" x2="50" y2="70" stroke="#E8003D" strokeWidth="1.5" opacity="0.4" />
          <line x1="340" y1="180" x2="380" y2="175" stroke="#E8003D" strokeWidth="1.5" opacity="0.3" />
          <line x1="60" y1="180" x2="20" y2="175" stroke="#E8003D" strokeWidth="1.5" opacity="0.3" />
          <line x1="310" y1="260" x2="340" y2="280" stroke="#E8003D" strokeWidth="1" opacity="0.25" />
          <line x1="90" y1="260" x2="60" y2="280" stroke="#E8003D" strokeWidth="1" opacity="0.25" />
        </svg>

        <motion.div
          initial="hidden"
          animate="show"
          variants={revealContainer}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div variants={revealItem} className="flex justify-center mb-8">
            <span className="bg-[#E8003D]/10 border border-[#E8003D]/30 text-[#E8003D] text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
              Anonymous · Encrypted · Unbiased
            </span>
          </motion.div>

          <motion.h1
            variants={revealItem}
            className="font-black text-white"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            <div className="text-[#AAAAAA]">
              <AnimatedWords words={['The', 'future', 'of']} />
            </div>
            <div className="text-white">
              <AnimatedWords words={['anonymous', 'ideas']} />
            </div>
            <div className="text-[#E8003D]">
              <AnimatedWords words={['starts', 'here.']} />
            </div>
          </motion.h1>

          <motion.p
            variants={revealItem}
            className="text-[#AAAAAA] text-lg max-w-lg mx-auto leading-relaxed mt-6 mb-10"
          >
            Share ideas freely. Stay completely anonymous. The best idea wins — not the loudest voice.
          </motion.p>

          <motion.div variants={revealItem} className="flex items-center justify-center gap-4 mt-10 flex-wrap">
            <Link
              to="/register"
              className="
                h-14 px-10 rounded-xl font-bold text-base
                bg-[#E8003D] hover:bg-[#CC0035] text-white
                transition-all duration-200
                hover:shadow-[0_0_32px_rgba(232,0,61,0.4)]
                hover:scale-105
                inline-flex items-center justify-center
              "
            >
              Get Started Free
            </Link>
            <a
              href="#how"
              className="
                h-14 px-10 rounded-xl font-semibold text-base
                bg-transparent border border-[#2A2A2A]
                hover:border-[#E8003D]/50 text-[#AAAAAA] hover:text-white
                transition-all duration-200
                inline-flex items-center justify-center
              "
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden
          className="text-[#555555] absolute bottom-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: easeInOut }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="w-full bg-[#0D0D0D] border-y border-[#2A2A2A] py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-center">
          {[
            { number: '100%', label: 'Anonymous always' },
            { number: 'AES-256', label: 'Encrypted ideas' },
            { number: '0', label: 'Bias in ratings' },
            { number: '∞', label: 'Ideas per team' },
          ].map((s, idx) => (
            <div key={s.label} className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-black text-white">{s.number}</div>
                <div className="text-sm text-[#555555] mt-1">{s.label}</div>
              </div>
              {idx !== 3 ? <div className="hidden md:block h-12 w-px bg-[#2A2A2A] ml-8" /> : null}
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section id="features" className="py-32 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={revealContainer}>
          <motion.h2 variants={revealItem} className="text-5xl font-black text-white mb-20">
            Why BlindIdea?
          </motion.h2>

          <motion.div variants={revealContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: EyeOff,
                title: 'Fully anonymous',
                body: 'No one knows who submitted what. Ideas are judged purely on merit.',
              },
              {
                icon: ShieldCheck,
                title: 'AES-256 encrypted',
                body: 'Every idea is encrypted before it touches the database.',
              },
              {
                icon: Star,
                title: 'Bias-free ratings',
                body: 'Star ratings are anonymous too. The best idea always rises to the top.',
              },
            ].map((c) => (
              <motion.div
                key={c.title}
                variants={revealItem}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="
                  bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-8
                  hover:border-[#E8003D]/40
                  hover:shadow-[0_0_40px_rgba(232,0,61,0.06)]
                  transition-all duration-300
                  group text-left
                "
              >
                <div
                  className="
                    w-14 h-14 rounded-2xl bg-[#1A1A1A]
                    border border-[#2A2A2A] flex items-center justify-center mb-6
                    group-hover:border-[#E8003D]/40 group-hover:bg-[#E8003D]/5
                    transition-all duration-300
                  "
                >
                  <c.icon className="w-7 h-7 text-[#E8003D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-[#AAAAAA] text-base leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="py-32 bg-[#000000] max-w-3xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={revealContainer}>
          <motion.h2 variants={revealItem} className="text-4xl font-black text-white mb-3">
            How it works
          </motion.h2>
          <motion.p variants={revealItem} className="text-[#AAAAAA] mb-12">
            Three steps to better team innovation.
          </motion.p>

          <motion.div variants={revealContainer} className="text-left">
            {[
              {
                n: '01',
                title: 'Join or create a team',
                body: 'Get a unique invite code and bring your team together.',
              },
              {
                n: '02',
                title: 'Submit ideas anonymously',
                body: 'Write your idea. We encrypt it. Nobody knows it came from you.',
              },
              {
                n: '03',
                title: 'Rate and discover',
                body: 'Everyone rates. The top ideas surface automatically.',
              },
            ].map((s, idx) => (
              <div key={s.n}>
                <motion.div variants={revealItem} className="flex items-start gap-6 mb-10">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#E8003D] flex items-center justify-center text-white font-black text-lg">
                    {s.n}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white mb-2">{s.title}</div>
                    <div className="text-[#AAAAAA] text-base leading-relaxed">{s.body}</div>
                  </div>
                </motion.div>
                {idx !== 2 ? <div className="h-8 w-px bg-[#2A2A2A] ml-6 my-2" /> : null}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Partners section (kept as-is, moved to correct spot) */}
      <PartnersSection />

      {/* Pricing (lightweight section to match navbar anchor) */}
      <section id="pricing" className="py-28 max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={revealContainer}>
          <motion.div variants={revealItem} className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">Pricing</h2>
            <p className="text-[#AAAAAA] max-w-2xl mx-auto">
              Start free. Keep teams focused on ideas, not ego.
            </p>
          </motion.div>
          <motion.div variants={revealContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', note: 'For every team', highlight: true },
              { name: 'Pro', price: 'Soon', note: 'Advanced workflows', highlight: false },
              { name: 'Enterprise', price: 'Soon', note: 'SSO & compliance', highlight: false },
            ].map((p) => (
              <motion.div
                key={p.name}
                variants={revealItem}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`
                  bg-[#0D0D0D] border rounded-2xl p-8
                  ${p.highlight ? 'border-[#E8003D]/35 shadow-[0_0_40px_rgba(232,0,61,0.06)]' : 'border-[#2A2A2A]'}
                `}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <div className="text-white font-black text-xl">{p.name}</div>
                    <div className="text-[#555555] text-sm mt-1">{p.note}</div>
                  </div>
                  <div className="text-white font-black text-2xl">{p.price}</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="text-[#AAAAAA]">- Anonymous submissions</div>
                  <div className="text-[#AAAAAA]">- Encrypted ideas</div>
                  <div className="text-[#AAAAAA]">- Bias-free ratings</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="py-40 text-center relative overflow-hidden px-6 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(232,0,61,0.06),transparent)]">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={revealContainer} className="max-w-3xl mx-auto">
          <motion.h2 variants={revealItem} className="text-6xl font-black text-white mb-4">
            Ready to innovate?
          </motion.h2>
          <motion.p variants={revealItem} className="text-[#AAAAAA] text-xl mb-12 max-w-md mx-auto">
            Start sharing ideas with your team — completely anonymous, completely free.
          </motion.p>
          <motion.div variants={revealItem}>
            <Link
              to="/register"
              className="
                h-14 px-12 rounded-xl font-bold text-base
                bg-[#E8003D] hover:bg-[#CC0035] text-white
                transition-all duration-200
                hover:shadow-[0_0_32px_rgba(232,0,61,0.4)]
                hover:scale-105
                inline-flex items-center justify-center
              "
            >
              Create Free Account
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
