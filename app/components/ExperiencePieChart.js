"use strict"

const React = require('react')
const {Pie} = require('react-chartjs')

const {div, a, p, i} = React.DOM
const pie = React.createFactory(Pie)

const colors = [
  { color: "#7cb5ec", highlight: "#a9cef2" }, // blue
  { color: "#4d5360", highlight: "#646b7c" }, // dark gray
  { color: "#fdb45c", highlight: "#fecb8e" }, // yellow
  { color: "#90ed7d", highlight: "#b6f3aa" }, // green
  { color: "#949fb1", highlight: "#b1b9c7" }, // gray
  { color: "#f7464a", highlight: "#f9777a" }, // red
]

const options = {
  percentageInnerCutout : 5,
  animationSteps: 30,
  responsive: true
}

let chartRef

function _afterRender(that) {
  // get the canvas from the pie ref and set the onclick
  // to the handleClick function
  that.pieRef.getCanvass().onclick = that.handleClick.bind(that)
  chartRef = that.pieRef.getChart()
}

class ExperiencePieChart extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    _afterRender(this) // evades strict warnings
  }

  componentDidUpdate() {
    _afterRender(this) // evades strict warnings
  }

  render() {
    const data = this.props.data.map((item, i) => {
      let index = i >= colors.length ? i % colors.length : i
      item.color = colors[index].color
      item.highlight = colors[index].highlight
      return item
    })

    let backButton
    if (this.props.onBackClick) {
      backButton = p(
        { style: {marginBottom: 20} },
        a(
          { onClick: this.props.onBackClick },
          i(
            {className: "fa fa-lg fa-chevron-left"}
          ),
          ' Back'
        )
      )
    }

    return div(
      {},
      backButton,
      pie(
        { ref: (ref) => {this.pieRef = ref}, data: data, options: options,
          redraw: true, maxWidth: 400, maxHeight: 400 }
      )
    )
  }

  handleClick(evt) {
    // get which one was clicked
    const activePoints = chartRef.getSegmentsAtEvent(evt)
    this.props.onClick({label: activePoints[0].label, value: activePoints[0].value})
  }
}

ExperiencePieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  onClick: React.PropTypes.func
}
ExperiencePieChart.defaultProps = {
  onClick: () => {},
  onBackClick: null
}

module.exports = ExperiencePieChart
