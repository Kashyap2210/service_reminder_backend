import { Injectable, Logger } from '@nestjs/common';
import { EntityList, UserStatus } from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class UserDeleteCronJob {
  private readonly logger = new Logger(UserDeleteCronJob.name);
  private readonly BATCH_SIZE = 5;

  constructor(private readonly registryService: RegistryService) {}

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  async deleteMarkedUsers(): Promise<void> {
    const systemUser = await this.userService.getSystemUser();
    const deletedUsers = (
      await this.userService.searchV2(
        { include: { status: [UserStatus.DELETED] } },
        systemUser,
      )
    )[EntityList.USER];
    console.log('deletedUsers', deletedUsers);

    if (!deletedUsers?.length) {
      this.logger.log('No deleted users to process');
      return;
    }

    this.logger.log(`Processing ${deletedUsers.length} deleted users`);

    for (let i = 0; i < deletedUsers.length; i += this.BATCH_SIZE) {
      const batch = deletedUsers.slice(i, i + this.BATCH_SIZE);
      await Promise.all(
        batch.map((user) => this.userService.deleteUser(user.id, systemUser)),
      );
      this.logger.log(`Batch ${i / this.BATCH_SIZE + 1} completed`);
    }

    this.logger.log('Finished processing all deleted users');
  }
}
