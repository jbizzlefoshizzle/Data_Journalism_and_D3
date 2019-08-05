// Var definitions for the svg
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create svg wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append svg group
// Translate to proper area
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial parameter stuff
// var initialAxis = "poverty"; //directly from csv keys
// // Function to update x-scale variable upon click
// function xScale(healthData, initialAxis) {
//     // create scale
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(healthData, d => d[initialAxis]),
//             d3.max(healthData, d => d[initialAxis])
//         ])
//         .range([0, width]);

//     return xLinearScale;
// }
// Function to update x-axis variable upon click
// COMING SOON!
// Function to update circles/markers with transition to new ones
// COMING SOON!
// Function with tooltip
// Tim "The Tool Tip" Taylor
// COMING SOON!

// Retrieve csv data and EXECUTE!
d3.csv("assets/data/data.csv").then(function(healthData) {
    healthData.forEach(function(data) {
        id = +data.id;
        state = data.state;
        abbr = data.abbr;
        poverty = parseFloat(data.poverty);
        povertyMoe = parseFloat(data.povertyMoe);
        age = +data.age;
        ageMoe = +data.ageMoe;
        income = +data.income;
        incomeMoe = +data.incomeMoe;
        healthcare = data.healthcare;
        healthcareLow = data.healthcareLow;
        healthcareHigh = data.healthcareHigh;
        obesity = data.obesity;
        obesityLow = data.obesityLow;
        obesityHigh = data.obesityHigh;
        smokes = data.smokes;
        smokesLow = data.smokesLow;
        smokesHigh = data.smokesHigh;

        console.log(obesity, poverty)
        
    })
    });
    // x-scale is linear
    // var xLinearScale = xScale(healthData, initialAxis);
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty),
            d3.max(healthData, d => d.poverty)])
        .range([0, width]);
    // y-scale is also linear
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare),
            d3.max(healthData, d => d.healthcare)])
        .range([height, 0]); //must be backwards
    // Initial axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    // Append x-axis
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // var xAxis = chartGroup.append("g")
    //     .classed("x-axis", true)
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(bottomAxis);

    // Append y-axis
        chartGroup.append("g")
        .call(leftAxis);
    // Append initial markers
        var markers = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        // .attr("cx", d => xLinearScale(d[initialAxis]))
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10) // radius
        .attr("fill", "red")
        .attr("opacity", ".5");
    // Initialize tool tip
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     .offset([80, -60])
    //     .html(function(d) {
    //         return (`${d.}`)
    //     })
;
