import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
  ManyToOne,
} from 'typeorm';
import { Item } from './Item';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @ManyToOne(() => Item, (item) => item.stores)
  item: Relation<Item>[];
}
