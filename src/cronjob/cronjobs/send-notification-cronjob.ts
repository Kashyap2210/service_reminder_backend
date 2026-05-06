import { Injectable, Logger } from '@nestjs/common';
import {
  EntityList,
  IUserEntity,
  NotificationStatus,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IServiceReminderTemplateData } from 'src/mail/templates/template-interfaces/service-reminder.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { NotificationService } from 'src/notification/services/notification.service';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserService } from 'src/user/services/user.service';

const MAX_RETRY_COUNT = 3;

@Injectable()
export class SendServiceReminderNotifications {
  private readonly logger = new Logger(SendServiceReminderNotifications.name);

  constructor(
    private readonly mailService: MailService,
    private readonly registryService: RegistryService,
  ) {}

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  get notificationService(): NotificationService {
    return this.registryService.get(
      EntityList.NOTIFICATION,
    ) as NotificationService;
  }

  async processAndSendNotifications(currentUser: IUserEntity): Promise<void> {
    // Fetch PENDING + FAILED notifications that still have retries left
    const eligibleNotifications = await this.notificationService.search(
      {
        status: [NotificationStatus.PENDING, NotificationStatus.FAILED],
      },
      currentUser,
    );
    console.log('eligibleNotifications', eligibleNotifications);

    this.logger.log(
      `[processAndSendNotifications] Found ${eligibleNotifications.length} eligible notification(s)`,
    );

    if (!eligibleNotifications.length) return;

    const results = await Promise.allSettled(
      eligibleNotifications.map((notification) =>
        this.sendSingleNotification(notification, currentUser),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(
      `[processAndSendNotifications] Completed | succeeded=${succeeded} | failed=${failed}`,
    );
  }

  private async sendSingleNotification(
    notification: any,
    currentUser: IUserEntity,
  ): Promise<void> {
    const { id, payload, retryCount } = notification;

    // Hard guard — should never reach here due to the search filter, but be safe
    if (retryCount >= MAX_RETRY_COUNT) {
      this.logger.warn(
        `[sendSingleNotification] Skipping | notificationId=${id} | retryCount=${retryCount} has reached max`,
      );
      return;
    }

    try {
      const templateData: IServiceReminderTemplateData = JSON.parse(
        typeof payload.body === 'string'
          ? payload.body
          : JSON.stringify(payload.body),
      );

      await this.mailService.sendNotification<IServiceReminderTemplateData>(
        EmailTemplate.SERVICE_REMINDER,
        {
          toEmail: payload.recipientEmail,
          fromEmail: 'noreply@servicereminder.com',
          subject: payload.subject,
        },
        templateData,
      );

      await this.notificationService.updateByIdBase(
        id,
        {
          status: NotificationStatus.SENT,
          sentAt: Date.now(),
          updatedBy: currentUser.id,
        },
        undefined,
      );

      this.logger.log(
        `[sendSingleNotification] Sent | notificationId=${id} | to=${payload.recipientEmail} | attempt=${retryCount + 1}`,
      );
    } catch (error) {
      const nextRetryCount = retryCount + 1;
      const exhausted = nextRetryCount >= MAX_RETRY_COUNT;

      this.logger.error(
        `[sendSingleNotification] Failed | notificationId=${id} | attempt=${nextRetryCount}/${MAX_RETRY_COUNT} | exhausted=${exhausted} | error=${error.message}`,
        error.stack,
      );

      await this.notificationService
        .updateByIdBase(
          id,
          {
            // If all retries exhausted → EXHAUSTED so it never gets picked up again
            // Otherwise → back to FAILED so next cron run picks it up
            status: exhausted
              ? NotificationStatus.EXHAUSTED
              : NotificationStatus.FAILED,
            retryCount: nextRetryCount,
            lastError: error.message,
            updatedBy: currentUser.id,
          },
          undefined,
        )
        .catch((updateErr) => {
          this.logger.error(
            `[sendSingleNotification] Failed to update status | notificationId=${id} | error=${updateErr.message}`,
          );
        });
    }
  }
}
