import { createStyles, Theme } from '@material-ui/core/styles'

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    '@global': {
      body: {
        backgroundColor: palette.common.white,
      },
    },
    paper: {
      marginTop: spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: spacing(1),
      backgroundColor: palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: spacing(1),
    },
  })

export default styles
