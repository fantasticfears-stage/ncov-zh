import React from 'react';
import { WithStyles } from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import { useTitle } from "react-use";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = ({ spacing, transitions }: Theme) => createStyles({
  container: {}
});

interface IAboutProps extends WithStyles<typeof styles> {
};

const messages = defineMessages({
  title: {
    id: "about.title",
    description: "title for about",
    defaultMessage: "关于"
  }
});

// // @ts-ignore
// function linesToParagraphs(...nodes) {
//   console.log(nodes);
//   return nodes.map((node, idx) => node.props.children
//     .map((node: any) => typeof node === 'string' ? 
//         node.split('\n').map((text, idx2) => <p key={(idx+1)*1000+idx2+1}>{text}</p>) : node)
//     .reduce((nodes: any, node: any) => nodes.concat(node), []));
// }

const _About: React.FunctionComponent<IAboutProps> = ({ classes }) => {
  const intl = useIntl();
  useTitle(intl.formatMessage(messages.title));

  return <Container className={classes.container}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography>
            <FormattedMessage
              id="about.content.main"
              description="desc"
              defaultMessage="链接直达。交互式存档。无论你需要看哪个地方，哪一天的信息，只要到那个页面，分享或者保存链接，就永远可以找到那。

              继续阅读：{caixin}、{caixin2}、{a2n}、{github}"
              values={{
                github: <a href="https://github.com/fantasticfears-stage/ncov-zh">GitHub 代码</a>,
                caixin: <a href="http://weekly.caixin.com/2020/cw891/">财新周刊-抢救新冠病人</a>,
                caixin2: <a href="http://m.app.caixin.com/m_topic_detail/1473.html">财新-新冠肺炎防疫全纪录（限时免费）</a>,
                a2n: <a href="http://a2n.io/">A2N-疫情图表和相关信息</a>
              }}
            />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>;
}

const About = withStyles(styles)(_About);
export default About;
