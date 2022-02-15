export interface Chirp {
  id: string;
  contents: string;
  date: Date;
  authorId: string;
  parentId: string | null;
}
