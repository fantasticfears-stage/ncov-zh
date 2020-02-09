import React from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { useIntl, defineMessages } from "react-intl";
import { IRegionData, FilterType, DATE_RANGE, FILTER_MESSAGES } from "./models";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typograph from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { DatePicker } from "@material-ui/pickers/DatePicker";
import moment from 'moment';


const styles = ({ spacing, transitions }: Theme) => createStyles({
  filterButton: {
    minWidth: spacing(10),
    color: 'rgba(0,0,0,1)',
    '& > *': {
      display: 'block',
    }
  },
  root: {
    '& > *': {
      margin: spacing(1, 1),
    }
  }
});

interface IDisplayBoardProps extends WithStyles<typeof styles> {
  name: string;
  data: IRegionData | null;
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

  const [START_DATE, END_DATE] = DATE_RANGE;
  console.log(data);
  return <div className={classes.root}>
    <Typograph variant="h4">{name}</Typograph>

    <ToggleButtonGroup size="large" color="primary" aria-label="text primary button group">
      <ToggleButton value="confirmed" selected={filter === "confirmed"} className={classes.filterButton} onClick={(e) => onClick(e, "confirmed")}>
        <div>{intl.formatMessage(FILTER_MESSAGES["confirmed"])}</div>
        <div>{data ? data.confirmed : <Skeleton variant="text"/>}</div>
      </ToggleButton>
      <ToggleButton value="discharged" selected={filter === "discharged"} className={classes.filterButton} onClick={(e) => onClick(e, "discharged")}>
        <div>{intl.formatMessage(FILTER_MESSAGES["discharged"])}</div>
        <div>{data ? data.discharged : <Skeleton variant="text"/>}</div>
      </ToggleButton>
      <ToggleButton value="deceased" selected={filter === "deceased"} className={classes.filterButton} onClick={(e) => onClick(e, "deceased")}>
        <div>{intl.formatMessage(FILTER_MESSAGES["deceased"])}</div>
        <div>{data ? data.deceased : <Skeleton variant="text"/>}</div>
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
      minDate={START_DATE}
      maxDate={END_DATE}
      // shouldDisableDate={shouldDisableDate}
      format="MMMD日"
      variant="inline"
      label={intl.formatMessage(messages.date)}
      value={selectedDate}
      onChange={onDateChange}
      inputVariant="outlined"
      animateYearScrolling
    />

  </div>;
}


const DisplayBoard = withStyles(styles)(_DisplayBoard);
export default DisplayBoard;
