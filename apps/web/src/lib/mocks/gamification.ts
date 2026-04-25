import { NftSticker } from '@/components/gamification/StickerCard';
import { Medal } from '@/components/gamification/MedalBadge';

export const mockNfts: NftSticker[] = [
  { id: '1042', name: 'Mogno Africano #1042', rarity: 'Lenda', height: '3.2m', co2: '210kg', imageUrl: '🌳', isUnlocked: true },
  { id: '893', name: 'Mogno Africano #893', rarity: 'Raro', height: '1.5m', co2: '85kg', imageUrl: '🌲', isUnlocked: true },
  { id: '219', name: 'Mogno Africano #219', rarity: 'Comum', height: '0.4m', co2: '12kg', imageUrl: '🌱', isUnlocked: true },
  { id: 'locked-1', name: 'Próxima Semente', rarity: 'Bloqueado', isUnlocked: false },
  { id: 'locked-2', name: 'Muda em Crescimento', rarity: 'Bloqueado', isUnlocked: false },
];

export const mockMedals: Medal[] = [
  { id: 'm1', title: 'Pioneiro', description: 'Entrou no protocolo no primeiro ano.', tier: 'Ouro', icon: '🌟', isUnlocked: true, date: '10/01/2026' },
  { id: 'm2', title: 'Guardião Verde', description: 'Sequestrou mais de 100kg de CO2 com seus ativos.', tier: 'Esmeralda', icon: '🛡️', isUnlocked: true, date: '05/03/2026' },
  { id: 'm3', title: 'Parceiro B2B', description: 'Primeira compra em empresa parceira com cashback verde.', tier: 'Prata', icon: '🤝', isUnlocked: true, date: '12/04/2026' },
  { id: 'm4', title: 'Lenda Viva', description: 'Evolua uma árvore para o nível Lenda usando LEAFs.', tier: 'Bronze', icon: '👑', isUnlocked: false },
];
