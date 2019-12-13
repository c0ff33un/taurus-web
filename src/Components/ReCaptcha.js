import React from 'react'
import { ReCaptcha as GoogleReCaptcha } from 'react-recaptcha-google'

class ReCaptcha extends React.Component {
  constructor(props) {
    super(props)
    const { visible } = props
    const size = visible ? 'normal' : 'invisible'
    this.state = { size }
    this.reRef = React.createRef()
  }

  onLoadCallback = () => {
    if (this.reRef.current) {
      this.reRef.current.reset()
    }
  }

  render() {
    const { size } = this.state
    return (
      <GoogleReCaptcha
        ref={this.reRef}
        size={size}
        render="explicit"
        sitekey={process.env.REACT_APP_SITE_KEY}
        onloadCallback={this.onLoadCallback}
        verifyCallback={this.props.verifyCallback}
      />
    )
  }

}

export default ReCaptcha
