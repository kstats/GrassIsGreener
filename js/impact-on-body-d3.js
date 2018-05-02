/*
 * Code is heavily based on Nadieh Bremer's http://bl.ocks.org/nbremer/cbf61944aeb3204d3e4986ea645afc2b
 * Nadieh's code is in turn heavily based on Justin Windle's http://codepen.io/soulwire/pen/foktm
 */
$(function() {
console.log("impact-on-body-d3.js");

var width = 960,
    height = 250,
    MAX_X = 55,
    MIN_X = 49,
    MAX_Y = 60,
    MIN_Y = 30,
    curX = 130,
    curY = -15,
    scaleFactor = 3.5,
    imgSize = 120;

var wrapper = d3.select("#sparkle-wrapper")
            .attr("width", width)
            .attr("height", height); // set size of background rectangle

var person = d3.select("#personFill")
            .attr("pointer-events", "all")
            .attr("transform", "scale("+scaleFactor+"), translate("+curX+"," +curY + ")") // add a transform for translation to move it.
            .attr("x", width)
            .attr("y", height/5)
            .on("mousemove", mousemove);

var pulse = wrapper.append('g').classed('pulse', true);
var g = wrapper.append('g').classed("rectangle", true);

var forestImg = g.append("svg:image")
    .attr("xlink:href", "img/impact_body/noun_182948.svg") //forest image
    .attr("width", imgSize)
    .attr("height", imgSize)
    .attr("x", 50)
    .attr("y", height/5)
    .on("click", clickForest)
    .attr("class", "pulse")

var cityImg = g.append("svg:image")
    .attr("xlink:href", "img/impact_body/noun_164718.svg") //city image
    .attr("width", imgSize)
    .attr("height", imgSize)
    .attr("x", width - imgSize-50)
    .attr("y", height/5)
    .on("click", clickCity)

var circleSize = 58;

var staticGreen = g.append("circle")
    .attr('cx', 110)
    .attr('cy', 110)
    .attr('r', circleSize)
    .style("fill", "668203")
    .style("opacity", 0.3)
    .on("click", clickForest);

var staticRed = g.append("circle")
    .attr('cx', 850)
    .attr('cy', 110)
    .attr('r', circleSize-6)
    .style("fill", "F481A4")
    .style("opacity", 0.3)
    .on("click", clickCity);

/*
 * Pulsing circles
 */
function pulseCircles(){
    var pulseGreen = pulse.append("circle")
        .attr('cx', 110)
        .attr('cy', 110)
        .style("fill", "668203")

    var pulseRed = pulse.append("circle")
        .attr('cx', 850)
        .attr('cy', 110)
    
    repeat();
    
    function repeat() {
      pulseGreen
      .transition()
      .duration(1000)
      .ease(d3.easeSinOut)
      .attr('r', circleSize)
      .style("opacity", 0.3)
      .transition()
      .duration(1000)
      .ease(d3.easeSinIn)
      .attr('r', 70)
      //.style("fill", "white")
      .style("opacity", 0.4)
      .on("end", repeat);

      pulseRed
      .transition()
      .duration(1000)
      .ease(d3.easeSinOut)
      .attr('r', circleSize)
      .style("fill", "F481A4")
      .style("opacity", 0.3)
      .transition()
      .duration(1000)
      .ease(d3.easeSinIn)
      .attr('r', 70)
      //.style("fill", "white")
      .style("opacity", 0.4)
      .on("end", repeat);
	}
  }

pulseCircles();

/*
 * Particle handling functions and variable start here
 */

var circle_group = person.append("g")
                    .style("isolation", "isolate");

var id = 0, // to keep track of each particle
    forestColors = ['#8BB004', '#1D2900', '#3E4F02', '#668203', '#82BA00'],
    forestParticles = [];
    cityColors = ['#F7EDF0', '#F4C6D4', '#F4ABC1', '#F4A8BF', '#F481A4', '#FF8CAE', '#FF2B6A'],
    cityParticles = [];

var colorArray = forestColors,
    particleArray = forestParticles;

var circle_size = { "min" : 8 * width/2000, "max" :32 * width/2000 },
    force = { "min" : 6 * width/2000, "max" : 10 * width/2000 };

// Helper function to get random number in range [start, end]
function get_random_number(start, end) {
    return ((Math.random() * (end-start)) + start);
}

// Function to add a particle at position x, y
function spawn(x, y) {
    var particle = {
        x: x,
        y: y,
        id: id,
        alive: true,
        radius: get_random_number( circle_size.min, circle_size.max ),
        wander: get_random_number( 1, 1.5 ),
        color: colorArray[ Math.round( get_random_number(0, colorArray.length-1)) ],
        drag: get_random_number( 0.2, 0.99 ),
        age: get_random_number( 0.92, 0.98 ),
        theta: get_random_number( 0,  2 * Math.PI ),
        //force: get_random_number( force.min, force.max )
        force: 0
    };

    id += 1;

    particle.vx = Math.sin( particle.theta ) * particle.force;
    particle.vy = Math.cos( particle.theta ) * particle.force;

    particleArray.push( particle );
}

// Function to add num particles at position x, y
function add_particles(x, y, num) {
    for (var j = 0; j < num; j++) {
        spawn(x, y);
    }
}

// Function to increment position of a particle
function move(d) {
    d.x += d.vx;
    d.y += d.vy;

    d.vx *= d.drag;
    d.vy *= d.drag;

    d.theta += get_random_number( -0.5, 0.5 ) * d.wander;
    d.vx += Math.sin( d.theta ) * 0.5;
    d.vy += Math.cos( d.theta ) * 0.5;

    d.radius *= d.age;
    d.alive = d.radius > 1.5;
}

// Function which displays and moves particles
function redraw() {
    // Remove non-alive particles
    particleArray = particleArray.filter(function(d) { return d.alive; }); //todo remove this?

    // Join data, keeping track of ids
    var circles = circle_group.selectAll("circle")
                    .data(particleArray, function(d) { return d.id; });

    // Update circles
    circles.each(move)
            .transition("move").duration(50).ease(d3.easeLinear)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.radius; });

    circles.enter().append("circle")
            .style("mix-blend-mode", "screen")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("fill", function(d) { return d.color; })
            .attr("r", function(d) { return d.radius; });

    // This is necessary to remove circles when they become non-alive
    //circles.exit().remove();
}

/*
 * Particle handling functions end here
 */

// Do something fun with this, e.g. add particles on mousemove
function mousemove() {
    var point = d3.mouse(this);
    add_particles(point[0], point[1], 2);
}

function clickForest() {
    console.log("click forest button");
    colorArray = forestColors;
    particleArray = forestParticles;
    click(-5);
}

function clickCity() {
    console.log("click city button");
    colorArray = cityColors;
    particleArray = cityParticles;
    click(5);
}

function click(translateDelta) {
    var x = get_random_number(MIN_X, MAX_X);
    var y = get_random_number(MIN_Y, MAX_Y);
    add_particles(x, y, 5);
    curX = curX + translateDelta
    person.attr("transform", "scale(" + scaleFactor + "), translate("+curX+", " + curY+")")
    
}

// This is necessary to update animation
d3.timer(function() {
    redraw();
})
});