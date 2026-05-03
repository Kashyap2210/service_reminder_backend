import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { EntityList, IEntityFilterSearchData } from 'service_reminder_common';

export class EntityFilterIncludeDataDto {
  @IsEnum(EntityList)
  name: EntityList;

  @IsOptional()
  include?: Record<string, any[]>; // loose typed — getByFilter handles the actual filtering
}

export class BaseSearchDto {
  @ApiPropertyOptional({
    type: [EntityFilterIncludeDataDto],
    example: [
      {
        name: EntityList.VENDOR,
        include: [{ name: EntityList.VENDOR, filter: { id: [10] } }],
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true }) // validates each object in the array
  @Type(() => EntityFilterIncludeDataDto) // class-transformer needs this to instantiate the class
  entities?: IEntityFilterSearchData<EntityList>[];
}
