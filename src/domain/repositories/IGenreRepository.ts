import { Genre } from "../entities/Genre";

export interface IGenreRepository {
  findById(id: string): Promise<Genre | null>;
  findByIds(ids: string[]): Promise<Genre[]>;
  findAll(): Promise<Genre[]>;
  findBySlug(slug: string): Promise<Genre | null>;
}
