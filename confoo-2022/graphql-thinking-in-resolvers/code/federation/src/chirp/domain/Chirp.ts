export interface Chirp {
  id: string;
  contents: string;
  authorId: string;
  parentId: string | null;
}
