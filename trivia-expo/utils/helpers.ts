export function cleanCategoryName(name: string): string {
  return name.replace('Entertainment: ', '').replace('Science: ', '')
}

export function categoryEmoji(name: string): string {
  const map: Record<string, string> = {
    'General Knowledge': '🧠',
    'Entertainment: Books': '📚',
    'Entertainment: Film': '🎬',
    'Entertainment: Music': '🎵',
    'Entertainment: Television': '📺',
    'Entertainment: Video Games': '🎮',
    'Entertainment: Board Games': '♟️',
    'Science & Nature': '🔬',
    'Science: Computers': '💻',
    'Science: Mathematics': '🔢',
    Mythology: '⚡',
    Sports: '⚽',
    Geography: '🌍',
    History: '🏛️',
    Politics: '🗳️',
    Art: '🎨',
    Celebrities: '⭐',
    Animals: '🐾',
    Vehicles: '🚗',
    'Entertainment: Comics': '💥',
    'Science: Gadgets': '📱',
    'Entertainment: Japanese Anime & Manga': '⛩️',
    'Entertainment: Cartoon & Animations': '🎠',
  }
  return map[name] || '❓'
}
