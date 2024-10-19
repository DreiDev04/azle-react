import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import { User } from "./user";
import { Class } from "./class";
import { Card } from "./card";

@Entity({ name: "decks" })
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn()
  deck_id: number;

  @Column({ type: "varchar", length: 255 })
  deck_name: string;

  @Column({ type: "text", nullable: true })
  deck_description: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  deck_createdAt: Date;

  @Column({ type: "integer", default: 0 })
  deck_cardCount: number;

  @ManyToOne(() => User, (user) => user.decks, { eager: true })
  deck_userOwner: User;

  @ManyToMany(() => Class, (deck_classEntities) => deck_classEntities.class_decks)
  @JoinTable() 
  deck_classEntities: Class[];

  @OneToMany(() => Card, (card) => card.deck)
  deck_cards: Card[];
}
