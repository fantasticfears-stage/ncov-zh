import * as React from "react";
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";

export interface IErrorBoundaryState {
  hasError: boolean;
}

const styles = ({ palette, spacing, transitions, zIndex, mixins, breakpoints }: Theme) => createStyles({
});

export interface IErrorBoundaryProps extends WithStyles<typeof styles> {
}

const ErrorBoundary = withStyles(styles)(
  class extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError: React.GetDerivedStateFromError<IErrorBoundaryProps, IErrorBoundaryState> = (error) => {
      // Update state so the next render will show the fallback UI.
      console.log(error);
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.log(error, errorInfo);

      // You can also log the error to an error reporting service
      // logErrorToMyService(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }

      return this.props.children;
    }
  }
);

export default ErrorBoundary;
