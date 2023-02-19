import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { Author } from './entity/Author';
import { Book } from './entity/Book';
import 'reflect-metadata';
import { Version } from './entity/Version';
import { In } from 'typeorm';
import DataLoader from 'dataloader';
import { Item } from './entity/Item';
import { Person } from './entity/Person';
import { Store } from './entity/Store';

// initialize database
await AppDataSource.initialize();

// Prepare for the server
const typeDefs = `#graphql

  # Person, Item, Store
  type Person {
    name: String
    items: [Item]
  }

  type Item {
    name: String
    person: Person
    stores: [Store]
  }

  type Store {
    name: String
    Item: Item
  }

  # Author, Book, Version
  type Author {
    name: String
    books: [Book]
  }
  type Book {
    title: String
    author: Author
    versions: [Version]
  }
  type Version {
    version: Int
    book: Book
  }

  type Query {
    authors: [Author]
  }
  type Query {
    books: [Book]
  }
  type Query {
    getAuthorById(id: Int!): Author
  }
  type Query {
    people: [Person]
  }
  type Query{
    items: [Item]
  }
`;

const resolvers = {
  Person: {
    items: async (parent: Person) => {
      const items = await itemsOfPerson(parent);
      console.log('items are fetched');
      return items;
    },
  },
  Item: {
    stores: async (parent: Item) => {
      const stores = await storesOfItem(parent);
      console.log('stores are fetched');
      return stores;
    },
  },
  Author: {
    books: async (parent: Author) => {
      const books = await booksLoader.load(parent.id);
      console.log('books are fetched');
      return books;
    },
  },
  Book: {
    versions: async (parent: Book) => {
      const versions = await versionsLoader.load(parent.id);
      console.log('versions are fetched');
      return versions;
    },
  },
  Query: {
    people: async () => {
      const p = await people();
      console.log('people are fetched');
      return p;
    },
    authors: async () => {
      const a = await authors();
      console.log('authors are fetched');
      return a;
    },
    getAuthorById: async (id: number) => await getAuthorById(id),
  },
};

// People, Item, Store
async function people(): Promise<Person[]> {
  const userRepository = AppDataSource.getRepository(Person);
  return await userRepository.find();
}
async function itemsOfPerson(person: Person): Promise<Item[]> {
  const itemsRepository = AppDataSource.getRepository(Item);
  return await itemsRepository.find({ where: { person } });
}
async function storesOfItem(item: Item): Promise<Store[]> {
  const storeRepository = AppDataSource.getRepository(Store);
  return await storeRepository.find({ where: { item } });
}

// Author, Book, Version
async function authors(): Promise<Author[]> {
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.find();
}

async function getAuthorById(id: number): Promise<Author> {
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.findOneBy({ id });
}

const booksLoader = new DataLoader(
  async (authorIds: number[]): Promise<Book[][]> => {
    const bookRepository = AppDataSource.getRepository(Book);
    const books = await bookRepository.find({
      where: {
        author: {
          id: In(authorIds),
        },
      },
      relations: {
        author: true,
      },
    });
    return authorIds.map((authorId) =>
      books.filter((book) => book.author.id === authorId),
    );
  },
);

const versionsLoader = new DataLoader(
  async (bookIds: number[]): Promise<Version[][]> => {
    const versionRepository = AppDataSource.getRepository(Version);
    const versions = await versionRepository.find({
      where: {
        book: {
          id: In(bookIds),
        },
      },
      relations: {
        book: true,
      },
    });
    return bookIds.map((bookId) =>
      versions.filter((version) => version.book.id === bookId),
    );
  },
);

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
