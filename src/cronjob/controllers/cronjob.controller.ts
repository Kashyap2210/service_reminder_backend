import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegistryService } from 'src/shared/services/registry.service';
import { CronJobCreateDto } from '../dtos/cronjob.create.dto';
import { CronJobSearchDto } from '../dtos/cronjob.search.dto';
import { CronJobUpdateDto } from '../dtos/cronjob.update.dto';
import { CronJobService } from '../services/cronjob.service';
import {
  CreateCronJobSwagger,
  DeleteCronJobSwagger,
  SearchCronJobsSwagger,
  UpdateCronJobSwagger,
} from '../cronjob.swagger';
import { EntityList, ICronJobEntity, IUserEntity } from 'service_reminder_common';

@ApiTags(EntityList.CRONJOB)
@Controller(EntityList.CRONJOB)
export class CronJobController {
  constructor(private readonly registryService: RegistryService) {}

  get cronJobService(): CronJobService {
    return this.registryService.get(EntityList.CRONJOB) as CronJobService;
  }

  @Post()
  @CreateCronJobSwagger()
  @UseGuards(AuthGuard)
  async createCronJob(
    @Body() dto: CronJobCreateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<ICronJobEntity> {
    return this.cronJobService.createCronJob(currentUser, dto);
  }

  @UpdateCronJobSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCronJob(
    @Param('id') id: string,
    @Body() dto: CronJobUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<ICronJobEntity> {
    return this.cronJobService.updateCronJob(+id, currentUser, dto);
  }

  @SearchCronJobsSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchCronJobs(
    @Body() dto: CronJobSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<ICronJobEntity[]> {
    return this.cronJobService.search(dto, currentUser);
  }

  @DeleteCronJobSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCronJob(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.cronJobService.deleteCronJob(+id, currentUser);
  }
}
