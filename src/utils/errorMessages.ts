/**
 * Centralized error-message extraction and classification helpers.
 * Used by hooks and pages to map backend errors to user-friendly text.
 */

// ── Extract a single human-readable message from any error shape ──

export const extractMessage = (error: any): string => {
  const data = error?.response?.data;

  if (!data) return 'Something went wrong. Please try again.';

  // plain string
  if (typeof data === 'string' && data.length < 200) return data;

  // { message: "..." }
  if (data.message && typeof data.message === 'string') return data.message;

  // { errors: { Email: ["Email is required"] } }  (ASP.NET ModelState)
  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const firstKey = Object.keys(data.errors)[0];
    const firstMsg = data.errors[firstKey]?.[0];
    if (firstMsg) return firstMsg;
  }

  // { errors: ["msg1", "msg2"] }  (array shape)
  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors[0];
  }

  // { error: "..." }
  if (data.error && typeof data.error === 'string') return data.error;

  // { title: "..." } (ASP.NET ProblemDetails / validation)
  if (data.title && typeof data.title === 'string') return data.title;

  return 'Something went wrong. Please try again.';
};

// ── Silent error patterns — expected states that should NOT toast ──

const SILENT_PATTERNS = [
  'you are not in a team',
  'must be in a team',
  'not in any team',
  'no active team',
  'team not found',
  'no ideas yet',
];

export const isSilent = (msg: string): boolean =>
  SILENT_PATTERNS.some((p) => msg.toLowerCase().includes(p));

// ── Domain-specific error mappers ────────────────────────────────

const _msg = (error: any) => extractMessage(error).toLowerCase();

export const getAuthError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('invalid credentials') || msg.includes('wrong password') || msg.includes('incorrect'))
    return 'Wrong email or password. Please try again.';
  if (msg.includes('not verified') || msg.includes('not confirmed') || msg.includes('email not confirmed'))
    return 'Please verify your email before logging in.';
  if (msg.includes('not found') || msg.includes('no account') || msg.includes('does not exist'))
    return 'No account found with this email.';
  if (msg.includes('locked') || msg.includes('too many attempts'))
    return 'Account temporarily locked. Try again in 15 minutes.';

  return extractMessage(error);
};

export const getRegisterError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('email already') || msg.includes('already registered') || msg.includes('already exists') || msg.includes('is already taken') || msg.includes('duplicate'))
    return 'This email is already registered. Try logging in.';
  if (msg.includes('password') && (msg.includes('weak') || msg.includes('requirement') || msg.includes('uppercase') || msg.includes('number')))
    return 'Password must be at least 8 characters with uppercase, number, and special character.';

  return extractMessage(error);
};

export const getTeamError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('already exists') || msg.includes('name taken'))
    return 'A team with this name already exists.';
  if (msg.includes('too short') || msg.includes('too long') || msg.includes('name must'))
    return 'Team name must be between 3 and 50 characters.';
  if (msg.includes('invalid invite') || msg.includes('invalid code') || msg.includes('not found'))
    return 'Invalid invite code. Please check and try again.';
  if (msg.includes('already') && msg.includes('member'))
    return 'You are already a member of this team.';
  if (msg.includes('expired'))
    return 'This invite code has expired.';
  if (msg.includes('admin') && (msg.includes('cannot') || msg.includes('leave')))
    return 'Admins cannot leave. Delete the team or transfer admin first.';
  if (msg.includes('not admin') || msg.includes('unauthorized'))
    return 'Only the team admin can perform this action.';
  if (msg.includes('not a member'))
    return 'You are not a member of this team.';

  return extractMessage(error);
};

export const getIdeaError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('not in') && msg.includes('team'))
    return 'You must join a team before submitting ideas.';
  if (msg.includes('title') && (msg.includes('short') || msg.includes('long') || msg.includes('required')))
    return 'Title must be between 5 and 100 characters.';
  if (msg.includes('content') && (msg.includes('short') || msg.includes('long') || msg.includes('required')))
    return 'Description must be between 20 and 1000 characters.';
  if (msg.includes('own idea') || msg.includes('your own') || msg.includes('cannot rate'))
    return "You can't rate your own idea.";
  if (msg.includes('already rated') || msg.includes('already submitted'))
    return 'You have already rated this idea.';
  if (msg.includes('not your') || msg.includes('not the owner') || msg.includes('unauthorized'))
    return 'You can only delete your own ideas.';
  if (msg.includes('rating') && (msg.includes('1') || msg.includes('5') || msg.includes('between') || msg.includes('range')))
    return 'Rating must be between 1 and 5.';
  if (msg.includes('not found') || msg.includes('no rating'))
    return 'No rating found to remove.';

  return extractMessage(error);
};

export const getVerifyEmailError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('invalid otp') || msg.includes('wrong otp') || msg.includes('incorrect otp') || msg.includes('invalid code'))
    return 'Invalid OTP code. Please check and try again.';
  if (msg.includes('otp expired') || msg.includes('expired'))
    return 'OTP has expired. Request a new one.';
  if (msg.includes('already verified'))
    return 'Email already verified. Redirecting to login...';

  return extractMessage(error);
};

export const getForgotPasswordError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('not found') || msg.includes('no account'))
    return 'No account found with this email address.';
  if (msg.includes('oauth') || msg.includes('google') || msg.includes('github') || msg.includes('social'))
    return 'This account uses Google or GitHub login. No password to reset.';

  return extractMessage(error);
};

export const getResetPasswordError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('invalid otp') || msg.includes('wrong otp') || msg.includes('invalid code'))
    return 'Invalid reset code. Please check your email.';
  if (msg.includes('otp expired') || msg.includes('expired'))
    return 'Reset code has expired. Request a new one.';
  if (msg.includes('password') && (msg.includes('requirement') || msg.includes('weak') || msg.includes('uppercase')))
    return 'New password must be 8+ chars with uppercase, number and special character.';

  return extractMessage(error);
};

export const getChangePasswordError = (error: any): string => {
  const msg = _msg(error);

  if (msg.includes('incorrect') || msg.includes('wrong') || msg.includes('current password'))
    return 'Current password is incorrect.';
  if (msg.includes('same') || msg.includes('must be different'))
    return 'New password must be different from current password.';
  if (msg.includes('password') && (msg.includes('requirement') || msg.includes('weak')))
    return 'Password must meet the strength requirements.';

  return extractMessage(error);
};

/** Check if an error is an OAuth-only account error */
export const isOAuthOnlyError = (error: any): boolean => {
  const msg = _msg(error);
  return msg.includes('null password') || msg.includes('login with google') || msg.includes('oauth') || msg.includes('social login');
};

/** Check if a login error is an unverified email error */
export const isUnverifiedError = (error: any): boolean => {
  const msg = _msg(error);
  return msg.includes('email not confirmed') || msg.includes('not verified') || msg.includes('verify');
};
