import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedFeature } from 'd3';
import { IRegionData } from "./models";

interface IDisplayBoardProps {
  province: string;
  city?: string;
  data: IRegionData;
};

const messages = defineMessages({
});

const DisplayBoard: React.FunctionComponent<IDisplayBoardProps> = ({province, city, data}) => {
  const ref = useRef<SVGPathElement>(null);
  return <div>
    <p>{province}</p>
    <p>{city}</p>
    <p>Confirmed {data.confirmed}</p>
    <p>cured {data.cured}</p>
    <p>death {data.death}</p>
    <p>suspected {data.suspected}</p>
  </div>;
}

export default DisplayBoard;
