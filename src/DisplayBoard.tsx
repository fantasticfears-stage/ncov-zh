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
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Button from '@material-ui/core/Button';
import Typograph from '@material-ui/core/Typography';
import { DatePicker } from "@material-ui/pickers/DatePicker";
import moment from 'moment';


const styles = ({ spacing, transitions }: Theme) => createStyles({
  filterButton: {
    minWidth: spacing(10)
  }
});

interface IDisplayBoardProps extends WithStyles<typeof styles> {
  name: string;
  data: IRegionData;
  filter: FilterType;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, filter: FilterType) => void;
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
};

const messages = defineMessages({
  date: {
    id: "display_board.date",
    description: "datepick title",
    defaultMessage: "日期"
  },
});

const _DisplayBoard: React.FunctionComponent<IDisplayBoardProps> = ({ filter, classes, name, data, onClick, selectedDate, handleDateChange }) => {
  const intl = useIntl();

  const onDateChange = (date: moment.Moment | null) => {
    if (!date) { return; }
    handleDateChange(date.toDate());
  };
  return <div>
    <Typograph variant="h4">{name}</Typograph>

    <ToggleButtonGroup size="large" color="primary" aria-label="text primary button group">
      <ToggleButton value="confirmed" selected={filter === "confirmed"} className={classes.filterButton} onClick={(e) => onClick(e, "confirmed")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.confirmed"
          description="Label used on display board"
          defaultMessage="确诊<br>{num}"
          values={{
            num: data.confirmed
          }}
        />
      </ToggleButton>
      <ToggleButton value="discharged" selected={filter === "discharged"} className={classes.filterButton} onClick={(e) => onClick(e, "discharged")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.discharged"
          description="Label used on display board"
          defaultMessage="治愈<br>{num}"
          values={{
            num: data.discharged
          }}
        />
      </ToggleButton>
      <ToggleButton value="deceased" selected={filter === "deceased"} className={classes.filterButton} onClick={(e) => onClick(e, "deceased")}>
        <FormattedHTMLMessage
          id="components.display_board.labels.deceased"
          description="Label used on display board"
          defaultMessage="去世<br>{num}"
          values={{
            num: data.deceased
          }}
        />
      </ToggleButton>
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
    </ToggleButtonGroup>
    <DatePicker
      disableToolbar
      variant="inline"
      label={intl.formatMessage(messages.date)}
      value={selectedDate}
      onChange={onDateChange}
      animateYearScrolling
    />

  </div>;
}


const DisplayBoard = withStyles(styles)(_DisplayBoard);
export default DisplayBoard;
