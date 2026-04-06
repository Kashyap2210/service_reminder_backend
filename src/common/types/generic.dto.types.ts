import { IAuditColumnEntity } from '../helpers/audit-column.entity.interface';
import { EntityList, EntityType } from '../utils/entity.utils';

export type IEntityCreateDto<T> = Omit<T, 'id' | keyof IAuditColumnEntity>;

export type IEntityUpdateDto<T> = Omit<
  Partial<T>,
  'id' | keyof IAuditColumnEntity
>;

export type IEntityFilterIncludeData<K extends EntityList = EntityList> = {
  name: K;
  include: IEntityFilterData<EntityType<K>>;
};

export type IEntityFilterData<T> = {
  [K in keyof T]?: T[K][];
} & {
  entities?: IEntityFilterIncludeData<EntityList>[];
};

export type ISearchV2Response = {
  [key in EntityList]?: EntityType<key>[];
};
