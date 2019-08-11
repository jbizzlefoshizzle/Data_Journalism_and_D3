// Var definitions for the svg
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
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
d3.csv("assets/data/data.csv")
    .then(function(healthData) {
    // parse through data
    healthData.forEach(function(data) {
        id = +data.id;
        state = data.state;
        abbr = data.abbr;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        age = +data.age;
        ageMoe = +data.ageMoe;
        income = +data.income;
        incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        healthcareLow = data.healthcareLow;
        healthcareHigh = data.healthcareHigh;
        obesity = data.obesity;
        obesityLow = data.obesityLow;
        obesityHigh = data.obesityHigh;
        smokes = data.smokes;
        smokesLow = data.smokesLow;
        smokesHigh = data.smokesHigh;

        console.log(data.poverty)
        
    });
    
    // x-scale is linear
    // var xLinearScale = xScale(healthData, initialAxis);
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty)-1, 
            d3.max(healthData, d => d.poverty)+2])
        // .domain([8, 24])
        .range([0, width]);
    
    // y-scale is also linear
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare)-1, 
            d3.max(healthData, d => d.healthcare)+2])
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
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    // .text(d => d.state)      DOES NOT APPEND STATE
    .attr("r", "15")
    .attr("opacity", ".5");

    var textGroup = chartGroup.append("g") //NEED THIS FOR ALL TEXT TO SHOW!
    .selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    // .attr("cx", d => xLinearScale(d[chosenXAxis]))
    // .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("alignment-baseline", "middle")
    .style("font-size", "10px")
    .attr("fill", "#fff")
    .text(d => d.abbr);
    
    // Initialize tool tip
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     .offset([80, -60])
    //     .html(function(d) {
    //         return (`${d.}`)
    //     })
    chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      .append("text")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - height/1.5)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
      .attr("transform",
        `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
});