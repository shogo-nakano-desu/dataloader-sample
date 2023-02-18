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
    items: async (parent: Person) => await itemsOfPerson(parent),
  },
  Item: {
    stores: async (parent: Item) => await storesOfItem(parent),
  },
  Author: {
    books: async (parent: Author) => await booksLoader.load(parent.id),
  },
  Book: {
    versions: async (parent: Book) => await versionsLoader.load(parent.id),
  },
  Query: {
    people: async () => await people(),
    authors: async () => await authors(),
    getAuthorById: async (id: number) => await getAuthorById(id),
  },
};

async function people(): Promise<Person[]> {
  const userRepository = AppDataSource.getRepository(Person);
  return await userRepository.find();
}
async function itemsOfPerson(person: Person): Promise<Item[]> {
  const itemsRepository = AppDataSource.getRepository(Item);
  return await itemsRepository.find({ where: { person } });
}
async function storesOfItem(item:Item): Promise<Store[]>{
  const storeRepository = AppDataSource.getRepository(Store);
  return await storeRepository.find({ where: { item } });
}

async function authors(): Promise<Author[]> {
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.find();
}

async function getAuthorById(id: number): Promise<Author> {
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.findOneBy({ id });
}

const booksLoader = new DataLoader(
  async (keys: number[]): Promise<Book[][]> => {
    const bookRepository = AppDataSource.getRepository(Book);
    const books = await bookRepository.find({
      where: {
        author: {
          id: In(keys),
        },
      },
      relations: {
        author: true,
      },
    });
    return keys.map((authorId) =>
      books.filter((book) => book.author.id === authorId),
    );
  },
);

const versionsLoader = new DataLoader(
  async (keys: number[]): Promise<Version[][]> => {
    const versionRepository = AppDataSource.getRepository(Version);
    const versions = await versionRepository.find({
      where: {
        book: {
          id: In(keys),
        },
      },
      relations: {
        book: true,
      },
    });
    return keys.map((bookId) =>
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
