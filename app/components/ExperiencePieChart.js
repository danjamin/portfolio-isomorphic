"use strict"

var React = require('react'),
  {Pie} = require('react-chartjs')

var {div, a, p, i} = React.DOM,
  pie = React.createFactory(Pie)

var colors = [
  { color: "#7cb5ec", highlight: "#a9cef2" }, // blue
  { color: "#4d5360", highlight: "#646b7c" }, // dark gray
  { color: "#fdb45c", highlight: "#fecb8e" }, // yellow
  { color: "#90ed7d", highlight: "#b6f3aa" }, // green
  { color: "#949fb1", highlight: "#b1b9c7" }, // gray
  { color: "#f7464a", highlight: "#f9777a" }, // red
]

var options = {
  percentageInnerCutout : 5,
  animationSteps: 50,
  responsive: true
}

var chartRef

var _afterRender = function () {
  // get the canvas from the pie ref and set the onclick
  // to the handleClick function
  this.pieRef.getCanvass().onclick = this.handleClick.bind(this)
  chartRef = this.pieRef.getChart()
}

class ExperiencePieChart extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    _afterRender.call(this)
  }

  componentDidUpdate() {
    _afterRender.call(this)
  }

  render() {
    var data = this.props.data.map((item, i) => {
      let index = i >= colors.length ? i % colors.length : i
      item.color = colors[index].color
      item.highlight = colors[index].highlight
      return item
    })

    var back_button
    if (this.props.onBackClick) {
      back_button = p(
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
      back_button,
      pie(
        { ref: (ref) => {this.pieRef = ref}, data: data, options: options,
          redraw: true, maxWidth: 400, maxHeight: 400 }
      )
    )
  }

  handleClick(evt) {
    // get which one was clicked
    var activePoints = chartRef.getSegmentsAtEvent(evt)
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
