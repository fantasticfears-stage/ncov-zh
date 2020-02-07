import React, { useRef, useEffect, useCallback } from 'react';
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import { useTitle, useEffectOnce, useAsync, useUpdateEffect } from "react-use";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

interface IAboutProps {
};


const messages = defineMessages({
  title: {
    id: "about.title",
    description: "title for about",
    defaultMessage: "关于"
  }
});

const About: React.FunctionComponent<IAboutProps> = ({}) => {
  const intl = useIntl();
  useTitle(intl.formatMessage(messages.title));

  return <Container>
      <FormattedMessage
        id="about.content"
        description="desc"
        defaultMessage="链接直达。交互式存档。"
      />
  </Container>
}

export default About;
