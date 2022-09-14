import React from 'react';
import { useEventCallback } from '@mui/material';
import { HTTPStatusCode } from '@app/shared/utils/rest';
import { useLoginMutation, useLogoutMutation } from '@app/client/features/api';
import { useAccount } from '@app/client/utils/auth';
import { AuthControlBtn } from './AuthControlBtn';
import { AuthDialog } from './AuthDialog';
import { IUserCredentials } from '@app/shared/features/users';

const AuthControl = () => {
  const [account, accountPending] = useAccount();
  const [login, { isLoading: isLoginLoading, error: loginRawError }] = useLoginMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const [authDialogIsOpen, setAuthDialogIsOpen] = React.useState(false);

  const showAuthDialog = React.useCallback(() => setAuthDialogIsOpen(true), []);
  const hideAuthDialog = React.useCallback(() => setAuthDialogIsOpen(false), []);

  const pending = accountPending || isLogoutLoading || isLoginLoading;

  const unauthorized = !account;

  const handleBtnClick = useEventCallback(() => {
    if (pending) return;
    if (unauthorized) showAuthDialog();
    else logout();
  });

  const loginError = React.useMemo(() => {
    if (!loginRawError) return;
    if ('status' in loginRawError && loginRawError.status === HTTPStatusCode.NotFound)
      return 'Invalid login or password';
    return 'Something went wrong... Try again later. If it persists, please contact us.';
  }, [loginRawError]);

  const handleFormSubmit = useEventCallback(async (credentials: IUserCredentials) => {
    await login(credentials).unwrap();
    hideAuthDialog();
  });

  return (
    <>
      <AuthControlBtn onClick={handleBtnClick} pending={pending} unauthorized={unauthorized} />
      <AuthDialog
        pending={pending}
        open={authDialogIsOpen}
        error={loginError}
        onCloseClick={hideAuthDialog}
        onFormSubmit={handleFormSubmit}
      />
    </>
  );
};

export default AuthControl;
