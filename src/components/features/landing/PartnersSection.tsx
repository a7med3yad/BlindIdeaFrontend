import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'

// ─── Partner data ────────────────────────────────────────────
const partners = [
  {
    name: 'BlindIdea',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="20" r="10" stroke="#E8003D" strokeWidth="2.5"/>
        <line x1="24" y1="10" x2="24" y2="6" stroke="#E8003D" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="24" y1="34" x2="24" y2="44" stroke="#E8003D" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="14" y1="20" x2="10" y2="20" stroke="#E8003D" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="38" y1="20" x2="34" y2="20" stroke="#E8003D" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'AWS',
    icon: (
      <svg viewBox="0 0 80 48" className="w-10 h-8" fill="none">
        <text x="10" y="30" fontSize="16" fontWeight="800" fill="#FF9900"
          fontFamily="Arial, sans-serif">aws</text>
        <path d="M52 28 Q60 20 68 28 Q76 36 84 28"
          stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'SQL Server',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <ellipse cx="24" cy="14" rx="16" ry="6" stroke="#00A1F1" strokeWidth="2"/>
        <path d="M8 14 L8 34 Q8 40 24 40 Q40 40 40 34 L40 14" stroke="#00A1F1" strokeWidth="2"/>
        <ellipse cx="24" cy="24" rx="16" ry="6" stroke="#00A1F1" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  {
    name: 'Claude AI',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <polygon points="24,6 42,38 6,38" stroke="#CC785C" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
        <line x1="24" y1="18" x2="24" y2="30" stroke="#CC785C" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="34" r="1.5" fill="#CC785C"/>
      </svg>
    ),
  },
  {
    name: 'React',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="3.5" fill="#61DAFB"/>
        <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none"/>
        <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 24 24)"/>
        <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 24 24)"/>
      </svg>
    ),
  },
  {
    name: '.NET',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="18" stroke="#512BD4" strokeWidth="2"/>
        <text x="12" y="29" fontSize="11" fontWeight="700" fill="#512BD4" fontFamily="Arial, sans-serif">.NET</text>
      </svg>
    ),
  },
  {
    name: 'AES-256',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M24 4 L38 10 L38 24 Q38 36 24 44 Q10 36 10 24 L10 10 Z"
          stroke="#E8003D" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <circle cx="24" cy="22" r="4" stroke="#E8003D" strokeWidth="2"/>
        <line x1="24" y1="26" x2="24" y2="32" stroke="#E8003D" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Terraform',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <polygon points="24,4 40,14 40,34 24,44 8,34 8,14"
          stroke="#7B42BC" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <polygon points="24,14 32,19 32,29 24,34 16,29 16,19"
          stroke="#7B42BC" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

// ─── Developer links ─────────────────────────────────────────
const devLinks = [
  {
    icon: <Mail className="w-3.5 h-3.5" />,
    label: 'ahmed.ibrahim01974@gmail.com',
    href: 'mailto:ahmed.ibrahim01974@gmail.com',
  },
  {
    icon: <Github className="w-3.5 h-3.5" />,
    label: 'a7med3yad',
    href: 'https://github.com/a7med3yad',
  },
  {
    icon: <Linkedin className="w-3.5 h-3.5" />,
    label: 'ahmedabouayad',
    href: 'https://www.linkedin.com/in/ahmedabouayad/',
  },
]

// ─── Main section ─────────────────────────────────────────────
export const PartnersSection = () => {
  return (
    <section className="relative w-full bg-[#000000] overflow-hidden">

      {/* Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8003D]/30 to-transparent" />

      {/* Subtle radial background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(232,0,61,0.03),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[#E8003D] text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
            Technology Stack
          </p>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Trusted By
          </h2>
          <p className="text-[#666666] text-sm max-w-md mx-auto leading-relaxed">
            Built with best-in-class technologies trusted by modern teams.
          </p>
        </motion.div>

        {/* ── Logo grid ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="
            flex flex-wrap items-center justify-center
            gap-x-2 gap-y-2
            mb-10
          "
        >
          {partners.map((p) => (
            <div
              key={p.name}
              className="
                group flex items-center gap-2.5
                px-5 py-3 rounded-xl
                bg-[#0A0A0A] border border-[#1A1A1A]
                transition-all duration-300 ease-out
                hover:border-[#2A2A2A]
                hover:bg-[#0F0F0F]
                hover:shadow-[0_0_20px_rgba(232,0,61,0.08)]
                hover:scale-[1.04]
                cursor-default select-none
              "
            >
              <div className="
                flex items-center justify-center
                w-9 h-9 rounded-lg
                bg-[#111111] border border-[#1A1A1A]
                group-hover:border-[#2A2A2A]
                transition-colors duration-300
              ">
                {p.icon}
              </div>
              <span className="text-[#888888] text-xs font-semibold tracking-wide group-hover:text-[#BBBBBB] transition-colors duration-300">
                {p.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent mb-8" />

        {/* ── Developer credit ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-[#444444] text-[11px] tracking-widest uppercase font-medium">
            Developed by{' '}
            <span className="text-[#777777] font-bold">Ahmed Ayad</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {devLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-1.5
                  text-[#444444] text-[11px]
                  transition-colors duration-200
                  hover:text-[#E8003D]
                "
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default PartnersSection
