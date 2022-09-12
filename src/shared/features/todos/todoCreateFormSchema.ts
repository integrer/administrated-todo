import * as yup from 'yup';

export const todoCreateFormSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  body: yup.string().required(),
});
