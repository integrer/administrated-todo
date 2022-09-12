import { ITodoCreateFormData } from '@app/shared/features/todos/ITodoCreateFormData';

export interface ITodoUpdateFormData extends ITodoCreateFormData {
  fulfilled?: boolean;
}
