$(function() {

var wrapper = d3.select("#vision")
var svg = wrapper.append('svg')
var g = wrapper.append('g')

var imgSize = 200;
var cityImg = g.append("svg:image")
    .attr("xlink:href", "img/vision/noun_169904.svg") //city image
    .style("fill", "1D2900")
    .attr("width", imgSize)
    .attr("height", imgSize)
});