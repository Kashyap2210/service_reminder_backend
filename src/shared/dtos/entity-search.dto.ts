import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EntityList, OrderByDirection } from 'service_reminder_common';

/**
 * Mirrors IEntityFilterSearchData<EntityList> as a concrete class
 * so that class-validator can deeply validate `entities` and `relations`
 * arrays recursively.
 *
 * Field-level filters (e.g. `id`, `userId`) inside `include` are
 * intentionally typed as `Record<string, any[]>` — they are dynamic
 * per entity and TypeORM/QueryBuilder will surface invalid field names
 * as runtime errors naturally.
 */
export class EntityFilterSearchDataDto {
  @IsEnum(EntityList)
  name: EntityList;

  // `include` mirrors IEntityFilterData<EntityType<K>> — dynamic keys,
  // so we validate it as a plain object. Field-key validation is
  // deferred to the QueryBuilder layer.
  @IsOptional()
  @IsObject()
  include?: Record<string, any[]> & {};

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityFilterSearchDataDto) // recursive — handles nested relations
  relations?: EntityFilterSearchDataDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityFilterSearchDataDto)
  entities?: EntityFilterSearchDataDto[]; // legacy flat side-load support

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columnKeys?: string[];

  @IsOptional()
  @IsObject()
  orderBy?: Record<string, OrderByDirection>;

  @IsOptional()
  @IsInt()
  limit?: number;
}

/**
 * Mirrors the top-level IEntityFilterData<T> as a concrete class.
 * Dynamic field filters (e.g. `id: [1,2]`, `userId: [3]`) are captured
 * under `[key: string]: any[]` — we cannot class-validate these because
 * the valid keys change per EntityList value. TypeORM surfaces bad keys.
 */
export class EntityFilterDataDto {
  // Dynamic entity-field filters — validated loosely
  [key: string]: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columnKeys?: string[];

  @IsOptional()
  @IsObject()
  orderBy?: Record<string, OrderByDirection>;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityFilterSearchDataDto)
  entities?: EntityFilterSearchDataDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityFilterSearchDataDto)
  relations?: EntityFilterSearchDataDto[];
}

export class EntitySearchDto {
  @IsEnum(EntityList)
  name: EntityList;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityFilterDataDto)
  filter?: EntityFilterDataDto;
}
