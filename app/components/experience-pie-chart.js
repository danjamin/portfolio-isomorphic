"use strict"

var React = require('react'),
  {Pie} = require('react-chartjs')

var {div, a, p} = React.DOM,
  pie = React.createFactory(Pie)

var colors = [
  { color: "#F7464A", highlight: "#FF5A5E" }, // red
  { color: "#46BFBD", highlight: "#5AD3D1" }, // green
  { color: "#FDB45C", highlight: "#FFC870" }, // yellow
  { color: "#949FB1", highlight: "#A8B3C5" }, // gray
  { color: "#4D5360", highlight: "#616774" }, // dark gray
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
  this.pie.getCanvass().onclick = this.handleClick.bind(this)
  chartRef = this.pie.getChart()
}

class ExperiencePieChart extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    _afterRender.call(this)
  }

  // TODO: better way?
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
          '<- Previous'
        )
      )
    }

    return div(
      {},
      back_button,
      pie(
        { ref: (ref) => {this.pie = ref}, data: data, options: options,
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
  isNested: React.PropTypes.boolean,
  onClick: React.PropTypes.func
}
ExperiencePieChart.defaultProps = {
  onClick: () => {},
  onBackClick: null
}

module.exports = ExperiencePieChart
