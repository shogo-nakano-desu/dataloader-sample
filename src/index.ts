import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Author {
    name: String
    books: [Book]
  }

  type Query {
    books: [Book]
  }

  type Query {
    authors: [Author]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'A Night in Acadie',
    author: 'Kate Chopin',
  },
  {
    title: 'Bayou Folk',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    title: 'Squeeze Play ',
    author: 'Paul Auster',
  },
];

const authors = [
  {
    name: 'Kate Chopin',
    books: [
      {
        title: 'The Awakening',
        author: 'Kate Chopin',
      },
      {
        title: 'A Night in Acadie',
        author: 'Kate Chopin',
      },
      {
        title: 'Bayou Folk',
        author: 'Kate Chopin',
      },
    ],
  },
  {
    name: 'Paul Auster',
    books: [
      {
        title: 'City of Glass',
        author: 'Paul Auster',
      },
      {
        title: 'Squeeze Play ',
        author: 'Paul Auster',
      },
    ],
  },
];

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);