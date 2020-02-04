import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedFeature } from 'd3';
import { IRegionData } from "./models";
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

interface IDisplayBoardProps {
  name: string;
  data: IRegionData;
};

const messages = defineMessages({
});

const DisplayBoard: React.FunctionComponent<IDisplayBoardProps> = ({ name, data }) => {
  const ref = useRef<SVGPathElement>(null);
  return <div>
    <p>{name}</p>

    <ButtonGroup size="large" variant="text" color="primary" aria-label="text primary button group">
      <Button>Confirmed {data.confirmed}</Button>
      <Button>cured {data.cured}</Button>
      <Button>death {data.death}</Button>
      <Button>suspected {data.suspected}</Button>
    </ButtonGroup>

  </div>;
}

export default DisplayBoard;
