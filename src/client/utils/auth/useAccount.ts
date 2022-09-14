import { IUserDTO } from '@app/shared/features/users';
import { useAccountQuery } from '@app/client/features/api';
import { HTTPStatusCode } from '@app/shared/utils/rest';

const useAccount = (): readonly [account: IUserDTO | undefined, pending: boolean] => {
  const { data, isLoading, isFetching, error } = useAccountQuery();
  const pending = isLoading || isFetching || (!data && !error);
  if (pending) return [undefined, true];
  if (error) {
    const unauthorized = 'status' in error && error.status === HTTPStatusCode.Unauthorized;
    if (unauthorized) return [undefined, false];
    throw error;
  }
  return [data, false];
};

export default useAccount;
