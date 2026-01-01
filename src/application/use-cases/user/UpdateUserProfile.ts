import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors";

export interface UpdateUserProfileInput {
  userId: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export class UpdateUserProfile {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = user.updateProfile({
      displayName: input.displayName,
      bio: input.bio,
      avatar: input.avatar,
    });

    return await this.userRepository.update(updatedUser);
  }
}