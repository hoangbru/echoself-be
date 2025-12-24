import { AppError } from "@/shared/errors/app-error";

export class SongUseCase {
  async getSongs(query: any) {
    if (query.limit > 50) {
      throw new AppError(400, "Limit must be <= 50");
    }

    return {
      items: [],
      pagination: {},
    };
  }
}
