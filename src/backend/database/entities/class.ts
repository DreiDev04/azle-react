import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity, OneToMany, ManyToOne, JoinTable } from "typeorm";
import { User } from "./user";
import { Deck } from "./deck";

@Entity({ name: "classes" })
export class Class extends BaseEntity {
  @PrimaryGeneratedColumn()
  class_id: number;

  @Column({ type: "varchar", length: 255 })
  class_name: string;

  @Column({ type: "text", nullable: true })
  class_description: string;

  @Column({ type: "integer", default: 0 })
  deckCount: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  class_createdAt: Date;

  @ManyToOne(() => User, (user) => user.classes)
  class_owner: User;

  @ManyToMany(() => User, (user) => user.classes)
  @JoinTable()
  class_members: User[];

  @OneToMany(() => Deck, (deck) => deck.classEntities)
  class_decks: Deck[];
}
