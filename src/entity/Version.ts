import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Relation } from 'typeorm';
import { Author } from './Author';
import { Book } from './Book';

@Entity()
export class Version {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: number;

  @ManyToOne(() => Book, (book) => book.versions)
  book: Relation<Book>;
}
