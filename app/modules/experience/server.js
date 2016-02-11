var ReactDOMServer = require('react-dom/server'),
  React = require('react')

var ExperiencePieChart = require('../../components/experience-pie-chart'),
  {data} = require('./chart')

var experience_pie_chart = React.createFactory(ExperiencePieChart)

module.exports = function (app) {
  app.get('/experience', function (req, res) {
    var model = {
      data: data,
    }
    var html = ReactDOMServer.renderToString(experience_pie_chart(model))
    res.render('experience/index', {
      outlet: {
        html: html,
        model: model
      },
      title: 'Experience',
      scripts: ['/modules/experience.js']
    })
  })
}
