import React from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { useIntl, defineMessages } from "react-intl";
import { IRegionData, FilterType, DATE_RANGE, FILTER_MESSAGES } from "./models";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Skeleton from '@material-ui/lab/Skeleton';
import { DatePicker } from "@material-ui/pickers/DatePicker";
import moment from 'moment';
import { darken } from "@material-ui/core/styles/colorManipulator";

const styles = ({ spacing, palette }: Theme) => createStyles({
  filterButton: {
    minWidth: spacing(10),
    color: darken(palette.text.primary, 0.2),
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
  name: string | null;
  subName?: string | null;
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

const _DisplayBoard: React.FunctionComponent<IDisplayBoardProps> = ({ filter, classes, name, subName, data, onClick, selectedDate, handleDateChange }) => {
  const intl = useIntl();

  const onDateChange = (date: moment.Moment | null) => {
    if (!date) { return; }
    handleDateChange(date.toDate());
  };

  const [START_DATE, END_DATE] = DATE_RANGE;
  return <Card>
    <CardHeader title={name} subheader={subName}/>
    <CardContent className={classes.root}>

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
  </CardContent>
  </Card>;
}


const DisplayBoard = withStyles(styles)(_DisplayBoard);
export default DisplayBoard;
