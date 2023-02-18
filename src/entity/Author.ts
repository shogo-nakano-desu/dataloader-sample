import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Book } from './Book';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Relation<Book>[];
}
