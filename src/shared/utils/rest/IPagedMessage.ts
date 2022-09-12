import { IPagedMessageMeta } from './IPagedMessageMeta';

export interface IPagedMessage<T> {
  data: T[];
  meta: IPagedMessageMeta;
}
