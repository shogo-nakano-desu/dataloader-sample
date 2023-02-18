import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  OneToMany,
} from 'typeorm';
import { Author } from './Author';
import { Version } from './Version';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  title: string;

  @ManyToOne(() => Author, (author) => author.books)
  author: Relation<Author>;

  @OneToMany(() => Version, (version) => version.book)
  versions: Relation<Version>[];
}
