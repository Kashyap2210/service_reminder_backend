import { IAuditColumnEntity } from '../helpers/audit-column.entity.interface';

export type IEntityCreateDto<T> = Omit<T, 'id' | keyof IAuditColumnEntity>;

export type IEntityUpdateDto<T> = Omit<
  Partial<T>,
  'id' | keyof IAuditColumnEntity
>;

export type IEntityFilterData<T> = {
  [K in keyof T]?: T[K][];
};
