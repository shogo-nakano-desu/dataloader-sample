import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { Author } from './entity/Author';
import { Book } from './entity/Book';
import 'reflect-metadata';
import { Version } from './entity/Version';

// initialize database
await AppDataSource.initialize();

// Prepare for the server
const typeDefs = `#graphql
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

  
`;

const resolvers = {
  Author: {
    books: async (parent: Author) => await booksOfAuthor(parent),
  },
  Book: {
    versions: async(parent: Book) => await versionsOfBook(parent),
  },
  Query: {
    authors: async () => await authors(),
    getAuthorById: async (id:number) => await getAuthorById(id),
  },
};
async function authors(): Promise<Author[]> {
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.find();
}

async function getAuthorById(id: number): Promise<Author>{
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.findOneBy({id})
}

async function booksOfAuthor(author: Author): Promise<Book[]> {
  const booksRepository = AppDataSource.getRepository(Book);
  return await booksRepository.find({ where: { author } });
}

async function versionsOfBook(book: Book): Promise<Version[]> {
  const versionsRepository = AppDataSource.getRepository(Version);
  return await versionsRepository.find({ where: { book } });
}

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

// Add initial data into database
