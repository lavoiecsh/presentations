import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';

import { UserInMemoryDataSource } from '../dataSources/UserInMemoryDataSource';
import { BlogInMemoryDataSource } from '../dataSources/BlogInMemoryDataSource';
import { CommentInMemoryDataSource } from '../dataSources/CommentInMemoryDataSource';

import { resolvers } from '../resolvers';

const users = new UserInMemoryDataSource();
const blogs = new BlogInMemoryDataSource();
const comments = new CommentInMemoryDataSource();

export function makeServer(): ApolloServer {
    return new ApolloServer({
        typeDefs: gql(readFileSync(join(process.cwd(), 'resources', 'schema.graphql'), 'utf8')),
        context: ({ req }) => ({
            user: req.header('Authorization'),
        }),
        dataSources: () => ({
            users,
            blogs,
            comments,
        }),
        resolvers,
    })
}
