"use strict"

const React = require('react')

const {div, h2, p, img, button} = React.DOM

class RentalListing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isImageShowing: false
    }
  }

  render() {
    let image
    let showButton
    let hideButton

    if (this.state.isImageShowing) {
      image = p({}, img({
        src: this.props.rental.image,
        alt: this.props.rental.type,
        width: 500
      }))
      hideButton = button({
        onClick: this.handleHideImage.bind(this)
      }, 'Hide image')
    } else {
      showButton = button({
        onClick: this.handleShowImage.bind(this)
      }, 'Show image')
    }

    return div({},
      h2({}, this.props.rental.title),
      p({}, `Owner: ${this.props.rental.owner}`),
      p({}, `Type: ${this.props.rental.type}`),
      p({}, `Location: ${this.props.rental.city}`),
      p({}, `Number of bedrooms: ${this.props.rental.bedrooms}`),
      image,
      hideButton,
      showButton
    )
  }

  handleShowImage(e) {
    this.setState({ isImageShowing: true })
  }

  handleHideImage(e) {
    this.setState({ isImageShowing: false })
  }
}

RentalListing.propTypes = {
  rental: React.PropTypes.object.isRequired,
}

module.exports = RentalListing
