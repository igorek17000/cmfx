import React from 'react';
import styled from 'styled-components';
import useI18n from 'hooks/useI18n';
import Page from 'components/layout/Page';
import FarmStakingCard from 'views/Home/components/FarmStakingCard';
import CakeStats from 'views/Home/components/CakeStats';
import {
  Heading,
  Text,
  BaseLayout,
} from '../../packages/@pancakeswap-libs/uikit';

const Hero = styled.div`
  align-items: center;
  // background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
  background-repeat: no-repeat;
  background-position: left top, right top;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 25px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    // background-image: url('/images/pan-bg2.svg'),
    // url('/images/pan-bg.svg');
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`;

const Home: React.FC = () => {
  const TranslateString = useI18n();

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="#C90E8C">
          {TranslateString(576, 'Circumflex')}
        </Heading>
        <Text color="#09D6FE">
          {TranslateString(578, 'New AMM on Astar Network')}
        </Text>
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
        </Cards>
        <Cards>
          <CakeStats />
        </Cards>
      </div>
    </Page>
  );
};

export default Home;
