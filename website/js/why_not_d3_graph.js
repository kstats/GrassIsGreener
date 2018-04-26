'use strict';
const WHY_NOT_DATA = "reason,percent\n\
Family responsibilities,21\n\
Equipment too expensive,18\n\
No friends,17\n\
Lacking skill,16\n\
Physical disability,14\n\
Poor health,11\n\
Location too expensive,10\n\
Other recreation,10\n\
Too far away,10\n\
Not enough info,7\n\
Cannot reach venues,5\n\
Too crowded,4\n\
Family with physical disability,4\n\
Afraid of others,3\n\
Other,15\n\
";

$(function() {
  const LARGE_WIDTH = 400,
        LARGE_HEIGHT = 400,
        SMALL_WIDTH = 200,
        SMALL_HEIGHT = 200,
        LABEL_WIDTH = 200;

  var chart = d3.select('#why_not_chart');
  chart
    .attr('width', LARGE_WIDTH)
    .attr('height', LARGE_HEIGHT);

  var data = d3.csvParse(WHY_NOT_DATA);
  // var max_val = Math.max.apply(Math,data.map(function(o){return o.percent}));
  var max_val = d3.max(data, function(d) { return parseFloat(d.percent) })
  var num_rows = data.length;

  var xScale = d3.scaleLinear().domain([0, max_val]).range([0, LARGE_WIDTH]);
  var yScale = d3.scaleLinear().domain([0, num_rows]).range([0, LARGE_HEIGHT]);

  var bar = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g')

  // Loosely based off of http://bl.ocks.org/juan-cb/faf62e91e3c70a99a306
  // Add category labels
  bar.append('text')
    .attr('y', function(d, i) { return yScale(i) })
    .attr('x', 0)
    .attr('width', LABEL_WIDTH)
    // TODO: Update with dy to fine-tune the centering of text :/
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', 12)
    .text(function(d) { return d.reason });

  // Add bars of bar chart
  bar.append('rect')
    .attr('y', function(d, i) { return yScale(i) })
    // TODO: make dynamic
    .attr('height', LARGE_HEIGHT/num_rows - 10)
    .attr('x', LABEL_WIDTH)
    .attr('width', 0)
    .transition()
      .delay(function(d, i) { return 100 * i})
      .duration(200)
      .attr('width', function(d) { return xScale(parseFloat(d.percent)) })

  // Add percent labels
  bar.append('text')
    .attr('y', function(d, i) { return yScale(i) })
    // TODO: Generalize
    .attr('x', function(d, i) { return LABEL_WIDTH + xScale(parseFloat(d.percent)) - 30 })
    .attr('width', LABEL_WIDTH)
    // TODO: Update with dy to fine-tune the centering of text :/
    .attr('dominant-baseline', 'hanging')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .text(function(d) { return d.percent + "%" });
});
