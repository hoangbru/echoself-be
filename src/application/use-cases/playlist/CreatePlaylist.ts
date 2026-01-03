import { IPlaylistRepository } from "@/domain/repositories/IPlaylistRepository";
import { Playlist } from "@/domain/entities/Playlist";
import { v4 as uuidv4 } from "uuid";
import { PlaylistVisibility } from "@prisma/client";

export interface CreatePlaylistInput {
  userId: string;
  title: string;
  description?: string;
  coverImage?: string;
  visibility?: PlaylistVisibility;
}

export class CreatePlaylist {
  constructor(private readonly playlistRepository: IPlaylistRepository) {}

  async execute(input: CreatePlaylistInput): Promise<Playlist> {
    const playlist = Playlist.create({
      id: uuidv4(),
      userId: input.userId,
      title: input.title,
      description: input.description,
      coverImage: input.coverImage,
      visibility: input.visibility || PlaylistVisibility.PUBLIC,
    });

    return await this.playlistRepository.save(playlist);
  }
}
