import { Nullable } from '../types/types.generic';

export interface IBaseResponse<T> {
  success: boolean;
  message: string;
  data: Nullable<T>;
  error: Nullable<string>;
}
