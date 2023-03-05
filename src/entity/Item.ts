import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Person } from './Person';
import { Store } from './Store';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @ManyToOne(() => Person, (person) => person.items)
  person: Relation<Person>;

  @OneToMany(() => Store, (store) => store.item)
  stores: Relation<Store>[];
}
