export interface IArtistRepository {
  findById(id: string): Promise<any>;
  existsById(id: string): Promise<boolean>;
}
