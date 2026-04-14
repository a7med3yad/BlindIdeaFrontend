import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const requirements: Requirement[] = useMemo(
    () => [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Number', met: /[0-9]/.test(password) },
      { label: 'Special character', met: /[^a-zA-Z0-9]/.test(password) },
    ],
    [password]
  );

  const strength = requirements.filter((r) => r.met).length;

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return { text: '', color: '' };
    if (strength <= 1) return { text: 'Weak', color: '#EF4444' };
    if (strength <= 2) return { text: 'Fair', color: '#F59E0B' };
    if (strength <= 3) return { text: 'Good', color: '#3B82F6' };
    return { text: 'Strong', color: '#22C55E' };
  }, [password, strength]);

  if (password.length === 0) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i <= strength ? strengthLabel.color : '#2A2A2A',
              }}
            />
          ))}
        </div>
        <span
          className="text-xs font-medium transition-colors duration-300"
          style={{ color: strengthLabel.color }}
        >
          {strengthLabel.text}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-1.5">
            {req.met ? (
              <Check className="w-3 h-3 text-[#22C55E] shrink-0" />
            ) : (
              <X className="w-3 h-3 text-[#555555] shrink-0" />
            )}
            <span
              className={`text-[11px] transition-colors duration-200 ${
                req.met ? 'text-[#22C55E]' : 'text-[#555555]'
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
