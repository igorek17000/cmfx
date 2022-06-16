import React from 'react';
import useAuth from 'hooks/useAuth';
import useI18n from 'hooks/useI18n';
import {
  Button,
  useWalletModal,
} from '../packages/@pancakeswap-libs/uikit';

const UnlockButton = (props) => {
  const TranslateString = useI18n();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  );
};

export default UnlockButton;
