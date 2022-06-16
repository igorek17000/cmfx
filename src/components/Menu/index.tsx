import React, { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';

import { allLanguages } from 'config/localisation/languageCodes';

import { LanguageContext } from 'contexts/Localisation/languageContext';

import useTheme from 'hooks/useTheme';
import useAuth from 'hooks/useAuth';
import { useCmfxPrice } from 'subgraph/hooks';

// import { usePriceCakeBusd, useProfile } from 'state/hooks';

import { Menu as UikitMenu } from '../../packages/@pancakeswap-libs/uikit';

import config from './config';

const Menu = (props) => {
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const { selectedLanguage, setSelectedLanguage } = useContext(
    LanguageContext
  );
  const { isDark, toggleTheme } = useTheme();
  const dexTokenPriceUsd = useCmfxPrice();

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={dexTokenPriceUsd}
      links={config}
      // profile={{
      //   username: profile?.username,
      //   image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
      //   profileLink: '/profile',
      //   noProfileLink: '/profile',
      //   showPip: !profile?.username,
      // }}
      {...props}
    />
  );
};

export default Menu;
