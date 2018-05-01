$(function() {
var width = 960,
    height = 250,
    scaleFactor = 3.5;

    d3.select("#mind-wrapper").attr("width", width).attr("height", height); // set size of background rectangle

    var svg = d3.select("#rectangleMind")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
            .attr("transform", "scale("+scaleFactor+")")
            .on("mousemove", mousemove);

    // Do something fun with this, e.g. add particles on mousemove
    function mousemove() {
        var point = d3.mouse(this);
        console.log("mousemove...: point:" + point);
    }
});