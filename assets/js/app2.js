// Var definitions for the svg
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
}; //end svg defs

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create svg wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight); //end svg def
// Append svg group
// Translate to proper area
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chart"); //end chartGroup def

// Initial parameter stuff
var chosenXAxis = "poverty";

function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }; //end xScale def

// Function to update x-axis variable upon click
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(500)
      .call(bottomAxis);
  
    return xAxis;
  }; //end renderAxes

// Function to update circles/markers with transition to new ones
function renderCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition()
      .duration(500)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }; //end renderCircles
function renderText(textGroup, newXScale, chosenXaxis) {
    textGroup.transition()
      .duration(500)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textGroup;
  }; //end renderCircles
// Function with tooltip
// Tim "The Tool Tip" Taylor
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty (%): ";
    }
    else { //label for age
      var label = "Median Age: ";
    }; //end if-statement

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<hr>${label}${d[chosenXAxis]}
                    <br>${d.healthcare}% lack healthcare`)
        }); // end toolTip
    
    // Bring tooltip into chart
    chartGroup.call(toolTip);

    // Start event listeners
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        }); //end event listeners
  
    return circlesGroup;
  } //end updateToolTip def

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
    });
    
    // x-scale is linear
    var xLinearScale = xScale(healthData, chosenXAxis);
    
    // y-scale is also linear
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare)-1, 
            d3.max(healthData, d => d.healthcare)+2])
        .range([height, 0]); //must be backwards
    
    // Initial axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x-axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y-axis
    chartGroup.append("g")
        .call(leftAxis);

    // Append initial markers
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", ".5");

    var textGroup = chartGroup.append("g") //NEED THIS FOR ALL TEXT TO SHOW!
    .selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    // .attr("cy", d => yLinearScale(d[chosenYAxis]))
    // .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("y", d => yLinearScale(d[chosenYAxis]))
    // .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "stateText")
    .attr("alignment-baseline", "middle")
    .style("font-size", "10px")
    .text(d => d.abbr);
    
    // Labels on axes
    var allXLabels = chartGroup.append("g")
        .attr("transform",
        `translate(${width / 2}, ${height + 30})`)

    var povertyLabel = allXLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    
    var ageLabel = allXLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");
    
    chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      .append("text")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - height/1.5)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    // Call updateToolTip function
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    allXLabels.selectAll("text")
        .on("click", function(d) {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                console.log(chosenXAxis); // shows what parameter to base x-axis on

                xLinearScale = xScale(healthData, chosenXAxis);
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis);
                 // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })
});