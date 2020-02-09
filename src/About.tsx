import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import { useTitle } from "react-use";
import Container from '@material-ui/core/Container';

interface IAboutProps {
};


const messages = defineMessages({
  title: {
    id: "about.title",
    description: "title for about",
    defaultMessage: "关于"
  }
});

const About: React.FunctionComponent<IAboutProps> = () => {
  const intl = useIntl();
  useTitle(intl.formatMessage(messages.title));

  return <Container>
      <FormattedMessage
        id="about.content"
        description="desc"
        defaultMessage="链接直达。交互式存档。无论是哪个地方，哪一天，到那个页面，分享或者保存链接，就永远可以找到那。"
      />
  </Container>
}

export default About;
