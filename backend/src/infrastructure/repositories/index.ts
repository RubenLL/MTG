// Repository implementations
import { CardId, CardName } from '../../domain/valueObjects';
import { Card, Deck } from '../../domain/entities';

// TODO: Implement when needed

// Example repository interface:
export interface CardRepository {
  findById(id: CardId): Promise<Card | null>;
  findByName(name: CardName): Promise<Card[]>;
  save(card: Card): Promise<void>;
  update(card: Card): Promise<void>;
  delete(id: CardId): Promise<void>;
}

export interface DeckRepository {
  save(deck: Deck): Promise<void>;
  findById(id: string): Promise<Deck | null>;
  findByUserId(userId: string): Promise<Deck[]>;
  update(deck: Deck): Promise<void>;
  delete(id: string): Promise<void>;
}
