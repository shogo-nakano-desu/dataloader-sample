import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Author } from './entity/Author';
import { Book } from './entity/Book';
import { Version } from './entity/Version';
import { Item } from './entity/Item';
import { Person } from './entity/Person';
import { Store } from './entity/Store';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 15432,
  username: 'postgres',
  password: 'password',
  database: 'docker',
  synchronize: true,
  logging: true,
  entities: [Person, Item, Store, Author, Book, Version],
});
