export class PageRequest {
  constructor(
    readonly first: number | null = null,
    readonly after: string | null = null,
    readonly last: number | null = null,
    readonly before: string | null = null,
    ) {
  }
}
