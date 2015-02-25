
// Create random data

var data = [];

var startingDate = new Date (2014, 2, 20);

for (var i = 0; i < 10; i++){

  var temp = {};

  // Date property
  temp.date = new Date(
    startingDate.getFullYear(),
    startingDate.getMonth(),
    startingDate.getDate()+i
    );

  // DAU is Daily Active Users Property
  temp.DAU = Math.round(Math.random() * 300);

  data.push(temp);
}

// Helper Functions for Objects

function getMaxObjectValue(this_array, element) {
    var values = [];

    for (var i = 0; i < this_array.length; i++) {
        values.push(Math.ceil(parseFloat(this_array[i][""+element])));
    }

    values.sort(function(a,b){return a-b});

    return values[values.length-1];
}

function getMinObjectValue(this_array, element) {
    var values = [];

    for (var i = 0; i < this_array.length; i++) {
        values.push(Math.floor(parseFloat(this_array[i][""+element])));
    }

    values.sort(function(a,b){return a-b});

    return values[0];
}

// Building the Chart Object

// Creating the visible area of the graph


// Creating the graph object
$(function(){

  var width = 500, height = 500;

  var margin = {top: 30, right: 10, bottom: 40, left: 60},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  var minDate = (data[0].date),
      maxDate = data[data.length-1].date;
      minObjectValue = getMinObjectValue(data, 'DAU');
      maxObjectValue = getMaxObjectValue(data, 'DAU');

  var vis = d3.select('#metrics').append('svg')
    .data(data)
    .attr('class', 'metrics-container')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var y = d3.scale.linear()
      .domain([ minObjectValue - (.1 * minObjectValue) , maxObjectValue + (.1 * maxObjectValue)])
      .range([height, 0]),
  x = d3.time.scale()
      .domain([minDate, maxDate])
      .range([0, width]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(5);

  vis.append("g")
      .attr("class", "axis")
      .call(yAxis);

  vis.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  //add the axes labels
  vis.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("x", 20)
      .attr("y", height + 34)
      .text('Date');

  vis.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", "-3.4em")
      .attr("transform", "rotate(-90)")
      .text('Daily Active Users');

  var line = d3.svg.line()
      .x(function(d) { return x(d["date"]); })
      .y(function(d) { return y(d["DAU"]); })

  vis.append("svg:path")
      .attr("d", line(data))
      .style("stroke", function() {
          return "#000000";
      })
      .style("fill", "none")
      .style("stroke-width", "2.5");

  var dataCirclesGroup = vis.append('svg:g');

  var circles = dataCirclesGroup
      .selectAll('.data-point')
      .data(data);

  circles
      .enter()
      .append('svg:circle')
      .attr('class', 'dot')
      .attr('fill', function() { return "red"; })
      .attr('cx', function(d) { return x(d["date"]); })
      .attr('cy', function(d) { return y(d["DAU"]); })
      .attr('r', function() { return 3; })
      .on("mouseover", function(d) {
          d3.select(this)
              .attr("r", 8)
              .attr("class", "dot-selected")
              .transition()
              .duration(750);
      })
      .on("mouseout", function(d) {
          d3.select(this)
          .attr("r", 3)
          .attr("class", "dot")
          .transition()
          .duration(750);
      });
});
