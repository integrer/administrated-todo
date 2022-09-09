import * as yup from 'yup';

export const userCredentialsSchema = yup.object({
  login: yup.string().required(),
  password: yup.string().required(),
});
