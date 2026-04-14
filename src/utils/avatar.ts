export function stringToHue(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export function avatarColorsFromEmail(email: string | null | undefined) {
  const safe = (email || 'user').toLowerCase();
  const hue = stringToHue(safe);
  return {
    bg: `hsl(${hue} 45% 12%)`,
    border: `hsl(${hue} 55% 22%)`,
    text: `hsl(${hue} 60% 75%)`,
  };
}

