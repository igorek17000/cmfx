import React from "react";

import styled from "styled-components";

import {
  ButtonMenu,
  ButtonMenuItem,
} from "../../packages/@pancakeswap-libs/uikit";

const StyledNav = styled.div`
  padding: 12px;
`;

function CurrencySwitch({
  onChange,
  value,
  disableUsd,
}: {
  onChange: (currentNav: string) => void;
  value: string;
  disableUsd: boolean;
}) {
  return (
    <StyledNav>
      <ButtonMenu
        activeIndex={value === "ASTAR" ? 0 : 1}
        scale="sm"
        variant="subtle"
        onItemClick={(index) =>
          index === 0 ? onChange("ASTAR") : onChange("USD")
        }
      >
        <ButtonMenuItem as="button" id="swap-nav-link">
          ASTAR
        </ButtonMenuItem>
        {!disableUsd ? (
          <ButtonMenuItem as="button" id="pool-nav-link">
            USD
          </ButtonMenuItem>
        ) : (
          <div />
        )}
      </ButtonMenu>
    </StyledNav>
  );
}

export default CurrencySwitch;
