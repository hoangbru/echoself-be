import { IAlbumRepository } from "../../../domain/repositories/IAlbumRepository";
import { Album } from "../../../domain/entities/Album";
import { v4 as uuidv4 } from "uuid";
import { AlbumType } from "@prisma/client";

export interface CreateAlbumInput {
  artistId: string;
  title: string;
  description?: string;
  coverImage: string;
  albumType: AlbumType;
  releaseDate: Date;
}

export class CreateAlbum {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  async execute(input: CreateAlbumInput): Promise<Album> {
    const album = Album.create({
      id: uuidv4(),
      artistId: input.artistId,
      title: input.title,
      description: input.description,
      coverImage: input.coverImage,
      albumType: input.albumType,
      releaseDate: input.releaseDate,
    });

    return await this.albumRepository.save(album);
  }
}
