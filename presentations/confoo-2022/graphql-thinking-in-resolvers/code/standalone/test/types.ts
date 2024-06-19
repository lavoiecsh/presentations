export interface User {
  id: string;
  username: string;
  chirps: Chirp[];
}

export interface Chirp {
  id: string;
  contents: string;
  author: User;
  date: string;
  parent: Chirp | null;
  replies: Chirp[];
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface UsageError {
  __typename: string;
  message: string;
  [key: string]: any;
}

export interface CreateUserPayload {
  user: User;
  errors: UsageError[];
}

export interface ChirpPayload {
  chirp: Chirp;
  errors: UsageError[];
}

export interface ReplyPayload {
  reply: Chirp;
  errors: UsageError[];
}
