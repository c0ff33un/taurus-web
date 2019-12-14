import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import {Button,  Container, Typography, Grid} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import PieChart, {
  Series,
  Label,
  Connector,
  Size
} from 'devextreme-react/pie-chart';

const styles = theme => ({
  body: {
      backgroundColor: theme.palette.common.white,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const data = [
  { region: 'Wins', val: 2010200 },
  { region: 'Loses', val: 5104756 }
];

class Stats extends React.Component {
  constructor(props){
    super(props)
    this.state = { data }
    this.pointClickHandler = this.pointClickHandler.bind(this);
    this.legendClickHandler = this.legendClickHandler.bind(this);
  }

  goToMenu = (event) => {
    event.preventDefault()
    this.props.history.push('/menu') 
  }

  handleChange = (event, name) => {
    event.preventDefault()
    this.setState({[name] : event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
  }

  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  legendClickHandler(e) {
    let arg = e.target;
    let item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    item.isVisible() ? item.hide() : item.show();
  }

  render() {
    const { classes, connected, loading } = this.props
    const { data: chartData } = this.state
    return (
      <Fragment>
        {connected? (
          <Redirect to={'/game'} />
        ) : (
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <Typography  variant="h2">
                {this.props.handle}
              </Typography>
              <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                        fullWidth
                        disabled={this.props.loading}
                        variant="contained"
                        color="primary"
                        className={classes.customBtn}
                        onClick={this.goToMenu}
                    >
                        Return to menu
                    </Button>
                  </Grid>  

                  <Grid item xs={12}>
                      <PieChart
                        id="pie"
                        dataSource={chartData}
                        type="doughnut"
                        title="Wins vs Loses"
                        palette={['#00F59E', '#F50057']}
                        onPointClick={this.pointClickHandler}
                        onLegendClick={this.legendClickHandler}
                        innerRadius={0.6}
                      >
                        <Series
                          argumentField="region"
                          valueField="val"
                        >
                        <Label visible={true}>
                          <Connector visible={true} width={1} />
                        </Label>
                      </Series>

                      <Size width={500} />
                    </PieChart> 
                  </Grid>
              </Grid>
            </form>
            </div>
          </Container>
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { logginIn, user } = state.authentication
  const { loading, websockets } = state
  return { logginIn, token: user.token, handle: user.data.handle, loading, connected: websockets.connected }
}

export default connect(mapStateToProps) ( withStyles(styles)(Stats))
