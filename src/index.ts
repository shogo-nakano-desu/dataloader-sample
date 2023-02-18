import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { Author } from './entity/Author';
import { Book } from './entity/Book';
import 'reflect-metadata';
import { Version } from './entity/Version';
import { In } from 'typeorm';
import DataLoader from 'dataloader';

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
    books: async (parent: Author) => await booksLoader.load(parent.id),
  },
  Book: {
    versions: async(parent: Book) => await versionsLoader.load(parent.id),
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

const booksLoader = new DataLoader(async(keys: number[]): Promise<Book[][]> =>{
  const bookRepository = AppDataSource.getRepository(Book);
  // const books = await bookRepository.find({author: {id: In(keys)}})
  const books = await bookRepository.find({
    where : {
      author: {
        id: In(keys)
      }
    },
    relations: {
      author: true
    }
  })
  return keys.map((authorId) => books.filter((book)=>book.author.id === authorId))
})

const versionsLoader = new DataLoader(async(keys: number[]): Promise<Version[][]> =>{
  const versionRepository = AppDataSource.getRepository(Version);
  // const books = await bookRepository.find({author: {id: In(keys)}})
  const versions = await versionRepository.find({
    where : {
      book: {
        id: In(keys)
      }
    },
    relations: {
      book: true
    }
  })
  return keys.map((bookId) => versions.filter((version)=>version.book.id === bookId))
})


// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
