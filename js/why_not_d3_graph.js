'use strict';
const WHY_NOT_DATA = "reason,svg_name,percent\n\
Family responsibilities,family,21\n\
Equipment too expensive,money,18\n\
No friends,alone,17\n\
Lacking skill,accident,16\n\
Physical disability,wheelchair,14\n\
Poor health,sick,11\n\
Location too expensive,money,10\n\
Other recreation,videogame,10\n\
Too far away,far,10\n\
Not enough info,question,7\n\
Cannot reach venues,far,5\n\
Too crowded,crowd,4\n\
Family with physical disability,wheelchair,4\n\
Afraid of others,criminal,3\n\
Other,question,15\n\
";

const WHY_NOT_TRANSITION_MS = 500;

$(function() {
  const LARGE_WIDTH = 800,
        LARGE_HEIGHT = 600,
        SMALL_WIDTH = 280,
        SMALL_HEIGHT = 300,
        LABEL_WIDTH = 200;

  let chart = d3.select('#whyNotChart');
  chart
    .attr('width', LARGE_WIDTH)
    .attr('height', LARGE_HEIGHT);

  let data = d3.csvParse(WHY_NOT_DATA);
  let max_val = d3.max(data, function(d) { return parseFloat(d.percent) })
  let num_rows = data.length;

  for (var i = 0; i < data.length; i++) {
    data[i].state = 'default';
  }

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
      .text(function(d) { return d.reason })
      .attr('opacity', 0)
      .transition()
        .delay(function(d, i) { return 100 * i})
        .duration(WHY_NOT_TRANSITION_MS)
        .attr('opacity', 1);

    // Add bars of bar chart
    rect
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', LABEL_WIDTH)
      .attr('width', 0)
      .attr('opacity', .6)
      .style('fill', '#93BA04')
      // Uncomment to make the bars click-able. If doing so, also add css to
      // make the mouse change when hovering over them.
      // .on('click', function(d) {
      //   if (waypointMap[d.reason]) {
      //     window.scrollTo(0, waypointMap[d.reason].triggerPoint + 10)
      //   }
      // })
      .transition('updateChartSize')
        .delay(function(d, i) { return 100 * (i + 1)})
        .duration(WHY_NOT_TRANSITION_MS)
        .attr('width', function(d) { return xScale(parseFloat(d.percent)) })

    // Add percent labels
    percentLabel
      .attr('y', function(d, i) { return yScale(i) + barHeight / 2})
      .attr('x', function(d, i) { return LABEL_WIDTH + xScale(parseFloat(d.percent)) - 10 })
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'end')
      .style('fill', 'white')
      .attr('font-size', 12)
      .attr('opacity', 0)
      .text(function(d) { return d.percent + "%" })
      .transition()
        .delay(function(d, i) { return 100 * (i + 1) + WHY_NOT_TRANSITION_MS })
        .attr('opacity', 1);

    icon
      .attr('xlink:href', function(d) { return 'img/why_not/' + d.svg_name + '.svg' })
      .attr('opacity', 0);
  }

  function destroyBar() {
    console.log('destroyBar');

    reasonLabel.attr('opacity', 0);
    rect.attr('width', 0);
    percentLabel.attr('opacity', 0);
    icon.attr('opacity', 0);
  }

  function largeBar() {
    console.log('largeBar');

    xScale = d3.scaleLinear().domain([0, max_val]).range([0, LARGE_WIDTH - LABEL_WIDTH]);
    yScale = d3.scaleLinear().domain([0, num_rows]).range([0, LARGE_HEIGHT]);
    barHeight = LARGE_HEIGHT/num_rows - 10;

    reasonLabel
      .transition()
        .duration(0)
        .attr('y', function(d, i) { return yScale(i) + barHeight / 2})
        .attr('x', 0)
        .attr('alignment-baseline', 'middle')
        .attr('opacity', 0)
        .transition()
          .duration(WHY_NOT_TRANSITION_MS)
          .attr('opacity', 1)
          .delay(WHY_NOT_TRANSITION_MS);
    percentLabel.transition()
      .duration(WHY_NOT_TRANSITION_MS)
      .attr('opacity', 1)
      .delay(WHY_NOT_TRANSITION_MS);
    icon.transition()
      .duration(0)
      .attr('opacity', 0);

    rect.transition('updateChartSize')
      .duration(WHY_NOT_TRANSITION_MS)
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', LABEL_WIDTH)
      .attr('width', function(d) { return xScale(parseFloat(d.percent)) });
  }

  function smallBar() {
    console.log('smallBar');

    yScale = d3.scaleLinear().domain([0, num_rows]).range([0, SMALL_HEIGHT]);
    barHeight = SMALL_HEIGHT/num_rows - 5;
    xScale = d3.scaleLinear().domain([0, max_val]).range([0, SMALL_WIDTH - (barHeight + 5)]);

    // Hide labels
    reasonLabel.transition()
      .duration(0)
      .attr('opacity', 0);
    percentLabel.transition()
      .duration(0)
      .attr('opacity', 0);

    // Resize and place icons appropriately.
    icon
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', barHeight)
      .attr('width', barHeight)
      .transition()
        .delay(WHY_NOT_TRANSITION_MS)
        .attr('opacity', 1);

    // Update rectangles
    rect.transition('updateChartSize')
      .duration(WHY_NOT_TRANSITION_MS)
      .attr('y', function(d, i) { return yScale(i) })
      .attr('height', barHeight)
      .attr('x', 3 * barHeight + 2)
      .attr('width', function(d) { return xScale(parseFloat(d.percent)) });
  }

  function updateReasonState(highlightReasons = [], disableReasons = [], enableReasons = []) {
    return function() {
      console.log('updateReasonState');
      d3.select('#whyNotChart').selectAll('g').each(
        function(d) {
          if (highlightReasons.indexOf(d.reason) > -1) {
            d.state = 'highlight';
          } else if (disableReasons.indexOf(d.reason) > -1) {
            d.state = 'disable';
          } else if (enableReasons.indexOf(d.reason) > -1) {
            d.state = 'default';
          }
        }
      );

      rect.transition('updateReasonState')
        .duration(WHY_NOT_TRANSITION_MS)
        .attr('opacity', function(d) {
          if (d.state === 'highlight') {
            return 1
          } else if (d.state === 'disable') {
            return .2
          } else {
            return .6
          }
        });

      yScale = d3.scaleLinear().domain([0, num_rows]).range([0, SMALL_HEIGHT]);
      barHeight = SMALL_HEIGHT/num_rows - 5;
      xScale = d3.scaleLinear().domain([0, max_val]).range([0, SMALL_WIDTH - (barHeight + 5)]);

      let extraFocusOffset = 0;
      rect.transition('updateChartSize')
        .duration(WHY_NOT_TRANSITION_MS)
        .attr('y', function(d, i) {
          if (d.state === 'highlight') {
            extraFocusOffset += 2 * barHeight;
            return yScale(i) + extraFocusOffset - 2 * barHeight;
          }
          return yScale(i) + extraFocusOffset;
        })
        .attr('height', barHeight)
        .attr('x', 3 * barHeight + 2)
        .attr('width', function(d) { return xScale(parseFloat(d.percent)) });

      extraFocusOffset = 0;
      icon
        .attr('opacity', 1)
          .transition()
          .duration(WHY_NOT_TRANSITION_MS)
          .attr('y', function(d, i) {
            if (d.state === 'highlight') {
              extraFocusOffset += 2 * barHeight;
              return yScale(i) + extraFocusOffset - 2 * barHeight;
            }
            return yScale(i) + extraFocusOffset;
          })
          .attr('height', function(d) {
            if (d.state === 'highlight') {
              return barHeight * 3;
            }
            return barHeight;
          })
          .attr('x', function(d) {
            if (d.state === 'highlight') {
              return 0;
            }
            return barHeight;
          })
          .attr('width', function(d) {
            if (d.state === 'highlight') {
              return barHeight * 3;
            }
            return barHeight;
          });

      extraFocusOffset = 0;
      reasonLabel
        .attr('x', 3 * barHeight + 2)
        .attr('alignment-baseline', 'top')
        .transition()
          .attr('y', function(d, i) {
            if (d.state === 'highlight') {
              extraFocusOffset += 2 * barHeight
            }
            return yScale(i) + extraFocusOffset;
          })
          .attr('opacity', function(d) {
            if (d.state === 'highlight') {
              return 1
            }
            return 0;
          });

    }
  }

  function makeFixedStart() {
    console.log('makeFixedStart');
    $("#whyNotChartFillerStart").css('height', '600px');
    chart.style('position', 'fixed');
    chart.style('top', '100px');
    chart.style('left', $('#whyNotChart').position() + 'px');
  }

  function makeStaticStart() {
    console.log('makeStaticStart');
    chart.style('position', 'static');
    $("#whyNotChartFillerStart").css('height', '0px');
  }

  function makeFixedEnd() {
    console.log('makeFixedEnd');

    chart
      .attr('height', LARGE_HEIGHT)
      .attr('width', LARGE_WIDTH + LABEL_WIDTH);
    chart.style('position', 'fixed');
    chart.style('top', '100px');
    chart.style('left', $('#whyNotChart').position() + 'px');

    $("#whyNotChart").insertAfter($("#whyNotChartFillerStart"));
    $("#whyNotChartFillerEnd").css('height', (SMALL_HEIGHT + 60) + 'px');
  }

  function makeStaticEnd() {
    console.log('makeStaticEnd');

    chart
      .attr('height', (SMALL_HEIGHT + 60) + 'px')
      .attr('width', SMALL_WIDTH);
    chart.style('position', 'static');
    $("#whyNotChart").insertAfter($("#whyNotChartFillerEnd"));
    $("#whyNotChartFillerEnd").css('height', '0px');
  }

  function setWaypoint(triggerElmt, offset, downFunc, upFunc) {
    return new Waypoint({
      element: document.getElementById(triggerElmt),
      handler: function(direction) {
        console.log('Triggering for ', triggerElmt, direction);
        direction == 'down' ? downFunc() : upFunc();
      },
      offset: offset
    });
  };

  let navigationTransitions = [
    {'triggerElmt': 'gamesWhyNot', 'relevantReasons': ['Other recreation']},
    {'triggerElmt': 'family', 'relevantReasons': ['Family responsibilities']},
    {'triggerElmt': 'expensive', 'relevantReasons': ['Equipment too expensive', 'Location too expensive']},
    {'triggerElmt': 'alone', 'relevantReasons': ['No friends', 'Not enough info']},
    {'triggerElmt': 'disability', 'relevantReasons': ['Physical disability', 'Family with physical disability']},
    {'triggerElmt': 'far', 'relevantReasons': ['Too far away', 'Cannot reach venues']},
  ]

  setWaypoint('whyNot', '100%', () => {}, destroyBar);
  setWaypoint('whyNot', '60%', createLargeBar, () => {});
  setWaypoint('whyNotChartFillerStart', '100px', () => {}, updateReasonState([], [], data.map(o => o.reason)));
  setWaypoint('whyNotChartFillerStart', '100px', smallBar, largeBar);
  setWaypoint('whyNotChartFillerStart', '100px', makeFixedStart, makeStaticStart);
  // TODO: Tableau plug-in messes up waypoint here :'( May need to wait until Tableau
  // is loaded to do these, or give it a fixed height to start.

  let waypointMap = {}
  let waypoint

  // Set up appropriate highlighting
  let currReasons = []
  let prevReasons = []
  for (var i = 0; i < navigationTransitions.length; i++) {
    currReasons = navigationTransitions[i].relevantReasons;
    waypoint = setWaypoint(
      navigationTransitions[i].triggerElmt,
      '200px',
      // Highlight the new category and fade out the previous one.
      updateReasonState(currReasons, prevReasons),
      // Highlight the previous category and return the new category to "to-be-processed"
      updateReasonState(prevReasons, [], currReasons)
    );
    for (var j = 0; j < currReasons.length; j++) {
      waypointMap[currReasons[j]] = waypoint;
    }
    prevReasons = currReasons;
  }
  setWaypoint('whyNotChartFillerEnd', '100px', updateReasonState([], prevReasons), updateReasonState(prevReasons))
  setWaypoint('whyNotChartFillerEnd', '100px', makeStaticEnd, makeFixedEnd);
});
