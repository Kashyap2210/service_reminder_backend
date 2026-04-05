import { IAuditColumnEntity } from '../helpers/audit-column.entity.interface';
import { EntityList, EntityType } from '../utils/entity.utils';

export type IEntityCreateDto<T> = Omit<T, 'id' | keyof IAuditColumnEntity>;

export type IEntityUpdateDto<T> = Omit<
  Partial<T>,
  'id' | keyof IAuditColumnEntity
>;

export type IEntityFilterData<T> = {
  [K in keyof T]?: T[K][];
} & {
  entities?: Array<
    {
      [N in EntityList]: {
        name: N;
        filter: IEntityFilterData<EntityType<N>>;
      };
    }[EntityList]
  >;
};
