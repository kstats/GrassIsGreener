$(function() {
var width = 960,
    height = 300,
    scaleFactor = 3.5;

    var wrapper = d3.select("#mind-wrapper").attr("width", width).attr("height", height); // set size of background rectangle

    var svg = d3.select("#rectangleMind")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
            .attr("transform", "scale("+scaleFactor+")");

    ///////////////////////////////////////////////////////////////////////////
			//////////////////// Set up and initiate svg containers ///////////////////
			///////////////////////////////////////////////////////////////////////////	

			var margin = {
				top: 10,
				right: 0,
				bottom: 10,
				left: 0
			};
			width = 200,
			height = 200;
						
			//SVG container
			var svg = d3.select('#mental-health')
                .append("svg")
                .attr("transform", "translate(" +0+ "," + -450 + ")")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				//.attr("transform", "translate(" +0+ "," + -400 + ")");

			///////////////////////////////////////////////////////////////////////////
			/////////////////////// Calculate hexagon variables ///////////////////////
			///////////////////////////////////////////////////////////////////////////	

			var SQRT3 = Math.sqrt(3),
				hexRadius = Math.min(width, height)/2,
				hexWidth = SQRT3 * hexRadius,
				hexHeight = 2 * hexRadius;
			var hexagonPoly = [[0,-1],[SQRT3/2,0.5],[0,1],[-SQRT3/2,0.5],[-SQRT3/2,-0.5],[0,-1],[SQRT3/2,-0.5]];
			var hexagonPath = "m" + hexagonPoly.map(function(p){ return [p[0]*hexRadius, p[1]*hexRadius].join(','); }).join('l') + "z";
			
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////// Create filter ///////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			//SVG filter for the gooey effect
			//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
			var defs = svg.append("defs");
			var filter = defs.append("filter").attr("id","gooeyCodeFilter");
			filter.append("feGaussianBlur")
				.attr("in","SourceGraphic")
				.attr("stdDeviation","10")
				//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
				.attr("color-interpolation-filters","sRGB") 
				.attr("result","blur");
			filter.append("feColorMatrix")
				.attr("in","blur")
				.attr("mode","matrix")
				.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9")
				.attr("result","gooey");

			//Create a gradient for the fill
			var colors = ["#490A3D","#BD1550","#E97F02","#F8CA00","#8A9B0F"];
			forestColors = ['#8BB004', '#1D2900', '#3E4F02', '#18471D', '#151F00'],
			defs.append("linearGradient")
				.attr("id", "gradientRainbow")
				.attr("gradientUnits", "userSpaceOnUse") 
				.attr("x1", -hexWidth/2*0.85).attr("y1", 0)
				.attr("x2", hexWidth/2*0.85).attr("y2", 0)
				.selectAll("stop") 
				.data(d3.range(forestColors.length))                  
				.enter().append("stop") 
				.attr("offset", function(d,i) { return (i/(forestColors.length-1)*100) + "%"; })   
				.attr("stop-color", function(d) { return forestColors[d]; });

			//Create a clip path that is the same as the top hexagon
			defs.append("clipPath")
		        .attr("id", "clip")
		        .append("path")
		        .attr("d", "M" + (width/2) + "," + (height/2) + hexagonPath);
		
			///////////////////////////////////////////////////////////////////////////
			////////////////////// Place circles inside hexagon ///////////////////////
			///////////////////////////////////////////////////////////////////////////	

		    //First append a group for the clip path, then a new group that can be transformed
			var circleWrapper = svg.append("g")
				.attr("clip-path", "url(#clip")
				.style("clip-path", "url(#clip)") //make it work in safari
				.append("g")
				.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
				.style("filter", "url(#gooeyCodeFilter)");

			//Create dataset with random initial positions
			randStart = [];
			for(var i = 0; i < 30; i++) {
				randStart.push({
					rHex: Math.random() * hexWidth,
					theta: Math.random() * 2 * Math.PI,
					r: 15 + Math.random() * 25
				});
			}//for i

		    var circle = circleWrapper.selectAll(".dots")
		    	.data(randStart)
		    	.enter().append("circle")
		    	.attr("class", "dots")
		    	.attr("cx", function(d) { return d.rHex * Math.cos(d.theta); })
		    	.attr("cy", function(d) { return d.rHex * Math.sin(d.theta); })
		      	.attr("r", 0)
		      	.style("fill", "url(#gradientRainbow)")
				.style("opacity", 1)
				.each(move);

			circle.transition("grow")
				.duration(function(d,i) { return Math.random()*2000+500; })
				.delay(function(d,i) { return Math.random()*3000*2;})
				.attr("r", function(d,i) { return d.r % 27 ; });

			///////////////////////////////////////////////////////////////////////////
			///////////////////////// Place Hexagon in center /////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			//Place a hexagon on the scene
			svg.append("path")
				.attr("class", "hexagon")
				.attr("d", "M" + (width/2) + "," + (height/2) + hexagonPath)
				.style("stroke", "#F2F2F2")
				.style("stroke-width", "4px")
                .style("fill", "none");
                
            wrapper.append("path")
                .attr("class", "hexagon")
                .attr("d", "M" + (width/5) + "," + (height/5) + hexagonPath)
				.style("stroke", "#F2F2F2")
				.style("stroke-width", "8px")
                .style("fill", "none")
                .attr("transform", "scale(0.3), translate(300, 200)")
            
            wrapper.append("path")
                .attr("class", "hexagon")
                .attr("d", "M" + (width/5) + "," + (height/5) + hexagonPath)
				.style("stroke", "#F2F2F2")
				.style("stroke-width", "30px")
                .style("fill", "none")
                .attr("transform", "scale(0.1), translate(1250, 800)")

			///////////////////////////////////////////////////////////////////////////
			////////////////////// Circle movement inside hexagon /////////////////////
			///////////////////////////////////////////////////////////////////////////	

			//General idea from Maarten Lambrecht's block: http://bl.ocks.org/maartenzam/f35baff17a0316ad4ff6
			function move(d) {
				var currentx = parseFloat(d3.select(this).attr("cx")),
					radius = d.r;

				//Randomly define which quadrant to move next
				var sideX = currentx > 0 ? -1 : 1,
					sideY = Math.random() > 0.5 ? 1 : -1,
					randSide = Math.random();

				var newx,
					newy;

				//Move new locations along the vertical sides in 33% of the cases
				if (randSide > 0.66) {
					newx = sideX * 0.5 * SQRT3 * hexRadius - sideX*radius;
					newy = sideY * Math.random() * 0.5 * hexRadius - sideY*radius;
				} else {
					//Choose a new x location randomly, 
					//the y position will be calculated later to lie on the hexagon border
					newx = sideX * Math.random() * 0.5 * SQRT3 * hexRadius;
					//Otherwise calculate the new Y position along the hexagon border 
					//based on which quadrant the random x and y gave
					if (sideX > 0 && sideY > 0) {
						newy = hexRadius - (1/SQRT3)*newx;
					} else if (sideX > 0 && sideY <= 0) {
						newy = -hexRadius + (1/SQRT3)*newx;
					} else if (sideX <= 0 && sideY > 0) {
						newy = hexRadius + (1/SQRT3)*newx;
					} else if (sideX <= 0 && sideY <= 0) {
						newy = -hexRadius - (1/SQRT3)*newx;
					}//else

					//Take off a bit so it seems that the circles truly only touch the edge
					var offSetX = radius * Math.cos( 60 * Math.PI/180),
						offSetY = radius * Math.sin( 60 * Math.PI/180);
					newx = newx - sideX*offSetX;
					newy = newy - sideY*offSetY;
				}//else

				//Transition the circle to its new location
				d3.select(this)
					.transition("moveing")
					.duration(3000+3000 + 4000*Math.random())
					.ease(d3.easeLinear)
					.attr("cy", newy)
					.attr("cx", newx)
					.on("end", move);

			}//function move

});
