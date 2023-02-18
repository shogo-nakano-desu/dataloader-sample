import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { Author } from './entity/Author';
import { Book } from './entity/Book';
import 'reflect-metadata';

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
  }
type Query {
    authors: [Author]
  }
  type Query {
    books: [Book]
  }

  
`;

const resolvers = {
  Author: {
    books: async (parent: Author) => await booksOfAuthor(parent),
  },
  Query: {
    authors: async () => await authors,
  },
};
async function authors(): Promise<Author[]> {
  const authorRepository = AppDataSource.getRepository(Author);
  return await authorRepository.find();
}
async function booksOfAuthor(author: Author): Promise<Book[]> {
  const booksRepository = AppDataSource.getRepository(Book);
  return await booksRepository.find({ where: { author } });
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
