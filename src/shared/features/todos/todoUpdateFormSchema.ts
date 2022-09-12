import * as yup from 'yup';
import { todoCreateFormSchema } from './todoCreateFormSchema';

export const todoUpdateFormSchema = yup.object({
  ...todoCreateFormSchema.fields,
  fulfilled: yup.boolean(),
});
