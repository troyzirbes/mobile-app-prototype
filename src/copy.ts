export function formatLikedNames(names: readonly string[]): string {
  if (names.length === 0) {
    return 'You passed on everyone in this deck.';
  }
  if (names.length === 1) {
    return `You liked ${names[0]}.`;
  }
  if (names.length === 2) {
    return `You liked ${names[0]} and ${names[1]}.`;
  }
  const head = names.slice(0, -1).join(', ');
  return `You liked ${head}, and ${names[names.length - 1]}.`;
}
