const ADJECTIVES = ['Nagy', 'Apró', 'Gyors', 'Bátor', 'Vidám']
const COLORS = ['Kék', 'Piros', 'Zöld', 'Sárga', 'Lila']
const ANIMALS = ['Flamingó', 'Papagáj', 'Panda', 'Cápa', 'Görény']

// Knuth's multiplicative hash scatters sequential ids across the combo space
// so consecutive sidequests don't end up with visibly similar display ids.
export function sidequestDisplayId(id) {
  const hash = (id * 2654435761) >>> 0
  const adjective = ADJECTIVES[hash % ADJECTIVES.length]
  const color = COLORS[Math.floor(hash / ADJECTIVES.length) % COLORS.length]
  const animal = ANIMALS[Math.floor(hash / (ADJECTIVES.length * COLORS.length)) % ANIMALS.length]
  return `${adjective} ${color} ${animal}`
}
