import React, { useRef, useEffect } from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { RouteComponentProps } from "@reach/router";
import { useIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from "react-intl";
import { useTitle, useEffectOnce, useAsync } from "react-use";
import * as d3 from "d3";
import { Selection, ExtendedFeature } from 'd3';
import { IRegionData, FilterType } from "./models";
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Typograph from '@material-ui/core/Typography';

const styles = ({ spacing, transitions }: Theme) => createStyles({
  filterButton: {
    minWidth: spacing(10)
  }
});

interface IDisplayBoardProps extends WithStyles<typeof styles> {
  name: string;
  data: IRegionData;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, filter: FilterType) => void;
};

const messages = defineMessages({
  labels: {
    confirmed: {
      id: "components.display_board.labels.confirmed",
      description: "Label used on display board",
      defaultMessage: "确诊 {num}"
    }
  }
});

const _DisplayBoard: React.FunctionComponent<IDisplayBoardProps> = ({ classes, name, data, onClick }) => {
  return <div>
    <Typograph variant="h4">{name}</Typograph>

    <ButtonGroup size="large" variant="text" color="primary" aria-label="text primary button group">
      <Button className={classes.filterButton} onClick={(e) => onClick(e, "confirmed")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.confirmed"
          description="Label used on display board"
          defaultMessage="确诊<br>{num}"
          values={{
            num: data.confirmed
          }}
        />
      </Button>
      <Button className={classes.filterButton} onClick={(e) => onClick(e, "cured")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.cured"
          description="Label used on display board"
          defaultMessage="治愈<br>{num}"
          values={{
            num: data.cured
          }}
        />
      </Button>
      <Button className={classes.filterButton} onClick={(e) => onClick(e, "death")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.death"
          description="Label used on display board"
          defaultMessage="死亡<br>{num}"
          values={{
            num: data.death
          }}
        />
      </Button>
      {/* <Button className={classes.filterButton} onClick={(e) => onClick(e, "suspected")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.suspected"
          description="Label used on display board"
          defaultMessage="疑似<br>{num}"
          values={{
            num: data.suspected
          }}
        />
      </Button> */}
    </ButtonGroup>

  </div>;
}


const DisplayBoard = withStyles(styles)(_DisplayBoard);
export default DisplayBoard;
