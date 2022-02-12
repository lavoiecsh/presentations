import { ApolloClient, createHttpLink, gql, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { Chirp, ChirpPayload, CreateUserPayload, ReplyPayload, User } from './types';
import { PageRequest } from './PageRequest';
import fetch from 'cross-fetch';
import { ChirpFragment, ErrorsFragment, UserFragment } from './fragments';
import { Connection } from '../src/lib/dataSources/pagination';
import { sign } from 'jsonwebtoken';

export class TestClient extends ApolloClient<NormalizedCacheObject> {
  private url: string;
  private userId: string | null;

  constructor() {
    super({ cache: new InMemoryCache() });
  }

  setUrl(url: string): this {
    this.url = url;
    super.setLink(createHttpLink({
      uri: this.url,
      fetch,
      headers: { 'authorization': this.userId },
    }));
    return this;
  }

  authenticated(userId: string): this {
    this.userId = userId;
    super.setLink(createHttpLink({
      uri: this.url,
      fetch,
      headers: { 'authorization': sign(this.userId, 'secret') },
    }));
    return this;
  }

  unauthenticated(): this {
    this.userId = null;
    super.setLink(createHttpLink({
      uri: this.url,
      fetch,
      headers: { 'authorization': this.userId },
    }));
    return this;
  }

  queryUser(id: string): Promise<User> {
    return super.query<{ user: User }>({
      query: gql`
          ${UserFragment}
          
          query ($id: ID!) {
              user(id: $id) {
                  ...UserFragment
              }
          }
      `,
      variables: { id },
    }).then(result => result.data.user);
  }

  queryChirp(id: string): Promise<Chirp> {
    return super.query<{ chirp: Chirp }>({
      query: gql`
          ${ChirpFragment}
          
          query ($id: ID!) {
              chirp(id: $id) {
                  ...ChirpFragment
              }
          }
      `,
      variables: { id },
    }).then(result => result.data.chirp);
  }

  queryChirps(pageRequest: PageRequest): Promise<Connection<Chirp>> {
    return super.query<{ chirps: Connection<Chirp> }>({
      query: gql`
          query ($first: Int, $after: String, $last: Int, $before: String) {
              chirps(first: $first, after: $after, last: $last, before: $before) {
                  totalCount
                  pageInfo {
                      hasPreviousPage
                      hasNextPage
                      startCursor
                      endCursor
                  }
                  nodes {
                      id
                      contents
                      author {
                          id
                          username
                      }
                  }
              }
          }
      `,
      variables: {
        first: pageRequest.first,
        after: pageRequest.after,
        last: pageRequest.last,
        before: pageRequest.before,
      },
    })
    .then(result => result.data.chirps);
  }

  createUser(username: string): Promise<CreateUserPayload> {
    return super.mutate<{ createUser: CreateUserPayload }>({
      mutation: gql`
          ${UserFragment}
          ${ErrorsFragment}
          
          mutation ($username: String!) {
              createUser(input: { username: $username }) {
                  user { ...UserFragment }
                  errors { ...ErrorsFragment }
              }
          }
      `,
      variables: { username },
    }).then(result => result.data.createUser);
  }

  chirp(contents: string): Promise<ChirpPayload> {
    return super.mutate<{ chirp: ChirpPayload }>({
      mutation: gql`
          ${ChirpFragment}
          ${ErrorsFragment}
          
          mutation ($contents: String!) {
              chirp(input: { contents: $contents }) {
                  chirp { ...ChirpFragment }
                  errors { ...ErrorsFragment }
              }
          }
      `,
      variables: { contents },
    }).then(result => result.data.chirp);
  }

  reply(chirp: string, contents: string): Promise<ReplyPayload> {
    return super.mutate<{ reply: ReplyPayload }>({
      mutation: gql`
          ${ChirpFragment}
          ${ErrorsFragment}
          
          mutation ($chirp: ID!, $contents: String!) {
              reply(input: {
                  chirp: $chirp
                  contents: $contents
              }) {
                  reply { ...ChirpFragment }
                  errors { ...ErrorsFragment }
              }
          }
      `,
      variables: { chirp, contents },
    }).then(result => result.data.reply);
  }
}
