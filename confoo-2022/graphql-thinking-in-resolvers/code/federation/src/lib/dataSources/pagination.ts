export interface PageRequest {
  first: number | null;
  after: string | null;
  last: number | null;
  before: string | null;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export class Connection<TData> {
  constructor(
    readonly nodes: TData[],
    readonly pageInfo: PageInfo,
    readonly totalCount: () => Promise<number>
  ) {
  }
}
