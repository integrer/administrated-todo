interface IFieldMeta {
  touched: boolean;
  error?: string;
}

export const createGetFieldError = (getFieldMeta: (key: string) => IFieldMeta) => (key: string) => {
  const fieldMeta = getFieldMeta(key);
  return fieldMeta.touched ? fieldMeta.error : undefined;
};
