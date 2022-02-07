import { ApolloClient, createHttpLink, gql, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { Chirp, ChirpConnection, ChirpPayload, CreateUserPayload, ReplyPayload, User } from './types';
import { PageRequest } from './PageRequest';
import fetch from 'cross-fetch';

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
      headers: { 'authorization': this.userId },
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
          query ($id: ID!) {
              user(id: $id) {
                  id
                  username
                  chirps {
                      id
                      contents
                  }
              }
          }
      `,
      variables: { id },
    }).then(result => result.data.user);
  }

  queryChirp(id: string): Promise<Chirp> {
    return super.query<{ chirp: Chirp }>({
      query: gql`
          query ($id: ID!) {
              chirp(id: $id) {
                  id
                  contents
                  author {
                      id
                      username
                  }
              }
          }
      `,
      variables: { id },
    }).then(result => result.data.chirp);
  }

  queryChirps(pageRequest: PageRequest): Promise<ChirpConnection> {
    return super.query<{ chirps: ChirpConnection }>({
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
          mutation ($username: String!) {
              createUser(input: { username: $username }) {
                  user {
                      id
                      username
                      chirps {
                          id
                          contents
                          author {
                              id
                          }
                      }
                  }
                  errors {
                      __typename
                      ... on UsageError {
                          message
                      }
                      ... on InvalidUsername {
                          username
                      }
                      ... on UsernameTaken {
                          username
                      }
                  }
              }
          }
      `,
      variables: { username },
    }).then(result => result.data.createUser);
  }

  chirp(contents: string): Promise<ChirpPayload> {
    return super.mutate<{ chirp: ChirpPayload }>({
      mutation: gql`
          mutation ($contents: String!) {
              chirp(input: { contents: $contents }) {
                  chirp {
                      id
                      contents
                      author {
                          id
                          username
                          chirps {
                              id
                              contents
                          }
                      }
                      parent {
                          id
                      }
                      replies {
                          id
                      }
                  }
                  errors {
                      __typename
                      ... on UsageError {
                          message
                      }
                      ... on TooLongContents {
                          length
                          maxLength
                      }
                  }
              }
          }
      `,
      variables: { contents },
    }).then(result => result.data.chirp);
  }

  reply(chirp: string, contents: string): Promise<ReplyPayload> {
    return super.mutate<{ reply: ReplyPayload }>({
      mutation: gql`
          mutation ($chirp: ID!, $contents: String!) {
              reply(input: {
                  chirp: $chirp
                  contents: $contents
              }) {
                  reply {
                      id
                      contents
                      author {
                          id
                          username
                      }
                      parent {
                          id
                          contents
                          replies {
                              id
                          }
                      }
                  }
                  errors {
                      __typename
                      ... on UsageError {
                          message
                      }
                      ... on TooLongContents {
                          length
                          maxLength
                      }
                      ... on ChirpNotFound {
                          chirpId
                      }
                  }
              }
          }
      `,
      variables: { chirp, contents },
    }).then(result => result.data.reply);
  }
}
