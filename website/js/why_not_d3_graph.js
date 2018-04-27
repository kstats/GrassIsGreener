'use strict';
const WHY_NOT_DATA = "reason,svg_name,percent\n\
Family responsibilities,family,21\n\
Equipment too expensive,family,18\n\
No friends,family,17\n\
Lacking skill,family,16\n\
Physical disability,family,14\n\
Poor health,family,11\n\
Location too expensive,family,10\n\
Other recreation,family,10\n\
Too far away,family,10\n\
Not enough info,family,7\n\
Cannot reach venues,family,5\n\
Too crowded,family,4\n\
Family with physical disability,family,4\n\
Afraid of others,family,3\n\
Other,family,15\n\
";

$(function() {
  const LARGE_WIDTH = 800,
        LARGE_HEIGHT = 600,
        SMALL_WIDTH = 300,
        SMALL_HEIGHT = 300,
        LABEL_WIDTH = 200;

  let chart = d3.select('#whyNotChart');
  chart
    .attr('width', LARGE_WIDTH)
    .attr('height', LARGE_HEIGHT);

  let data = d3.csvParse(WHY_NOT_DATA);
  let max_val = d3.max(data, function(d) { return parseFloat(d.percent) })
  let num_rows = data.length;

  let bar = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g');

  let reasonLabel = bar.append('text');
  let rect = bar.append('rect');
  let percentLabel = bar.append('text');
  let icon = bar.append('svg:image');

  let xScale, yScale;
  let barHeight;

  function createLargeBar() {
    console.log('createLargeBar');

    xScale = d3.scaleLinear().domain([0, max_val]).range([0, LARGE_WIDTH - LABEL_WIDTH]);
    yScale = d3.scaleLinear().domain([0, num_rows]).range([0, LARGE_HEIGHT]);
    barHeight = LARGE_HEIGHT/num_rows - 10;

    // Loosely based off of http://bl.ocks.org/juan-cb/faf62e91e3c70a99a306
    // Add category labels
    reasonLabel
      .attr('y', function(d, i) { return yScale(i) + barHeight / 2})
      .attr('x', 0)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', 12)
      .text(function(d) { return d.reason });

    // Add bars of bar chart
    rect
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', LABEL_WIDTH)
      .attr('width', 0)
      .attr('opacity', .6)
      .transition()
        .delay(function(d, i) { return 100 * i})
        .duration(200)
        .attr('width', function(d) { return xScale(parseFloat(d.percent)) })

    // Add percent labels
    percentLabel
      .attr('y', function(d, i) { return yScale(i) + barHeight / 2})
      .attr('x', function(d, i) { return LABEL_WIDTH + xScale(parseFloat(d.percent)) - 10 })
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'end')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .text(function(d) { return d.percent + "%" });

    icon
      .attr('xlink:href', function(d) { return 'img/why_not/' + d.svg_name + '.svg' })
      .attr('opacity', 0);
  }

  function largeBar() {
    console.log('largeBar');
    // chart.attr('height', LARGE_HEIGHT);
    // chart.attr('width', LARGE_WIDTH);

    xScale = d3.scaleLinear().domain([0, max_val]).range([0, LARGE_WIDTH - LABEL_WIDTH]);
    yScale = d3.scaleLinear().domain([0, num_rows]).range([0, LARGE_HEIGHT]);
    barHeight = LARGE_HEIGHT/num_rows - 10;

    reasonLabel.transition()
      .attr('opacity', 1)
      .delay(200);
    percentLabel.transition()
      .attr('opacity', 1)
      .delay(200);
    icon.transition()
      .attr('opacity', 0);

    rect.transition()
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', LABEL_WIDTH)
      .attr('width', function(d) { return xScale(parseFloat(d.percent)) })
      .duration(200)
  }

  function smallBar(highlightReasons = [], disableReasons = [], enableReasons = []) {
    console.log('smallBar');

    yScale = d3.scaleLinear().domain([0, num_rows]).range([0, SMALL_HEIGHT]);
    barHeight = SMALL_HEIGHT/num_rows - 5;
    xScale = d3.scaleLinear().domain([0, max_val]).range([0, SMALL_WIDTH - (barHeight + 5)]);

    // TODO: Also move them as they disappear, probably?
    // Hide labels
    reasonLabel.transition()
      .attr('opacity', 0);
    percentLabel.transition()
      .attr('opacity', 0);

    // Resize and place icons appropriately.
    icon
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', 0)
      .attr('width', barHeight)
      .transition()
        .attr('opacity', 1);
    
    // Update rectangles
    rect.transition()
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', barHeight + 5)
      .attr('width', function(d) { return xScale(parseFloat(d.percent)) })
      .attr('opacity', function(d) {
        if (highlightReasons.indexOf(d.reason) > -1) {
          return 1;
        } else if (disableReasons.indexOf(d.reason) > -1) {
          return .2;
        } else if (enableReasons.indexOf(d.reason) > -1) {
          return .6;
        } else {
          return this.getAttribute('opacity');
        }
      });
  }

  function makeFixedStart() {
    console.log('makeFixedStart');
    chart.style('position', 'fixed');
    chart.style('top', '100px');
    chart.style('left', '0px');
    // TODO: Do something to smooth snap-left with $("#whyNotChart").position()
    $("#whyNotChartFillerStart").css('position', 'static');
  }

  function makeStaticStart() {
    console.log('makeStaticStart');
    chart.style('position', 'static');
    $("#whyNotChartFillerStart").css('position', 'fixed');
  }

  function makeFixedEnd() {
    console.log('makeFixedEnd');
    chart.style('position', 'fixed');
    chart.style('top', '100px');
    chart.style('left', '0px');

    $("#whyNotChart").insertBefore($("#whyNotChartFillerStart"));
    $("#whyNotChartFillerEnd").css('position', 'static');
  }

  function makeStaticEnd() {
    console.log('makeStaticEnd');
    chart.style('position', 'static');
    $("#whyNotChart").insertBefore($("#whyNotChartFillerEnd"));
    // TODO: Do something to smooth snap-left with $("#whyNotChart").position()
    $("#whyNotChartFillerEnd").css('position', 'fixed');
  }

  function setWaypoint(triggerElmt, offset, downFunc, upFunc) {
    return new Waypoint({
      element: document.getElementById(triggerElmt),
      handler: function(direction) {
        direction == 'down' ? downFunc() : upFunc();
      },
      offset: offset
    });
  };

  // TODO: Destroy the bars if scroll is above this.
  setWaypoint('whyNot', '80%', createLargeBar, () => {});
  setWaypoint('whyNot1', '80%', () => { smallBar(['Family responsibilities']) }, largeBar);
  setWaypoint('whyNot2', '80%', () => { smallBar(['No friends'], ['Family responsibilities']) }, () => { smallBar(['Family responsibilities'], [], ['No friends']) });
  setWaypoint('whyNot3', '80%', () => { smallBar(['Equipment too expensive', 'Location too expensive'], ['No friends']) }, () => { smallBar(['No friends'], [], ['Equipment too expensive', 'Location too expensive']) });
  setWaypoint('whyNot4', '80%', () => { smallBar(['Too crowded'], ['Equipment too expensive', 'Location too expensive']) }, () => { smallBar(['Equipment too expensive', 'Location too expensive'], [], ['Too crowded']) });
  setWaypoint('whyNotChart', '100px', makeFixedStart, makeStaticStart);
  setWaypoint('whyNotChartFillerEnd', '100px', makeStaticEnd, makeFixedEnd);
});
