import { ITodoUpdateFormData } from './ITodoUpdateFormData';

export interface ITodoRecord<TDate = Date> extends ITodoUpdateFormData {
  id: number;
  createdAt: TDate;
  fulfilled: boolean;
}
