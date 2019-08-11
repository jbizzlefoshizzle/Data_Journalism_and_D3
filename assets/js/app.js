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
  .attr("height", svgHeight)
  .append("g");
// Append svg group
// Translate to proper area
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial parameter stuff
var chosenXAxis = "poverty"; //directly from csv keys
var chosenYAxis = "healthcare"; //directly from csv keys

// Function to update x-scale variable upon click
function xScale(healthData, chosenXAxis) {
    // create scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.95, //breathing room
            d3.max(healthData, d => d[chosenXAxis]*1.02) //breathing room
        ])
        .range([0, width]);

    return xLinearScale;
};
// Function to update y-scale variable upon click
function yScale(healthData, chosenYAxis) {
    // create scale
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis])-1, //breathing room
            d3.max(healthData, d => d[chosenYAxis]+2) //breathing room
        ])
        .range([height, 0]);

    return yLinearScale;
};
// Function to update x-axis variable upon click
function renderAxes(newScale, selectedAxis) {
    var bottomAxis = d3.axisBottom(newScale);
    var leftAxis = d3.axisLeft(newScale);
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    if (selectedAxis === "xAxis") {
        xAxis.transition()
            .duration(500)
            .call(bottomAxis);
    return xAxis
    }
    else {
        yAxis.transition()
            .duration(500)
            .call(leftAxis);
    return yAxis
    };
};
// Function to update circles/markers with transition to new ones
function renderCircles(circlesGroup, newScale, 
    chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(500)
        .attr("cx", d => newScale(d[chosenXAxis]))
        .attr("cy", d => newScale(d[chosenYAxis]));

    return circlesGroup;
};
// Function to update text with transition to new ones
function renderText(textGroup, newScale, 
    chosenXAxis, chosenYAxis) {
    textGroup.transition()
        .duration(500)
        .attr("x", d => newScale(d[chosenXAxis]))
        .attr("y", d => newScale(d[chosenYAxis]));

    return textGroup;
};
// Function with tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    if (chosenXAxis === "poverty") {
        var label = "poverty";
    } else if (chosenXAxis === "age") {
        var label = "age";
    } else {
        var label = "$income";
    };
    if (chosenYAxis === "healthcare") {
        var label = "healthcare";
    } else if (chosenYAxis === "smokes") {
        var label = "smokes";
    } else {
        var label = "obese";
    };
// Initialize tool tip
    // UPDATE TO MAKE MORE DYNAMIC
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<hr>${d[chosenXAxis]}<br>${d[chosenYAxis]}`)
        });
    // Call tool tip
    chartGroup.call(toolTip);
    // But nobody's listening!
    // When clicking, show things
    circlesGroup.on("click", function(data) {
        toolTip.show(data);
    })
    // When mousing away, hide things
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
};
// Retrieve csv data and EXECUTE!
d3.csv("assets/data/data.csv")
    .then(function(healthData) {
    // parse through data
    // if (error) throw error;
    healthData.forEach(function(data) {
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;        
    });

    // x-scale is linear
    var xLinearScale = xScale(healthData, chosenXAxis);
    // y-scale is also linear
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // Append x-axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y-axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Append initial markers
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "12")
    .attr("fill", "#89bdd3")
    .attr("stroke", "#e3e3e3")
    .attr("opacity", ".5")

    var textGroup = chartGroup.append("g") //NEED THIS FOR ALL TEXT TO SHOW!
    .selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("alignment-baseline", "middle")
    .style("font-size", "10px")
    .attr("fill", "#fff")
    .text(d => d.abbr);
    
    // Group of y-axes
    var yLabelsAll = chartGroup.append("g")
        .attr("transform", `translate(-40, ${height/2})rotate(270)`)
        .attr("y", 0 + margin.left + 40)
        .attr("x", 0 + height)
        .attr("dy", "1em")
        .attr("class", "axisText")
    var healthLabel = yLabelsAll.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    var smokesLabel = yLabelsAll.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
    var obeseLabel = yLabelsAll.append("text")
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");

    // Group of x-axes
    var xLabelsAll = chartGroup.append("g")
        .attr("transform", 
        `translate(${width / 2}, ${height + margin.top + 30})`);

    var povertyLabel = xLabelsAll.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsAll.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsAll.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    xLabelsAll.selectAll("text")
    .on("click", function() {
        // What values do we want?
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
            // replace chosenXAxis with value
            chosenXAxis = value;
            // update x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);
            // update x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);
            // update circles with new x-values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis);
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, chosenYAxis);
            // update tooltip
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
            // change class types to clicked type
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    }); //end xLabelsAll function

    yLabelsAll.selectAll("text")
    .on("click", function() {
        // What values do we want?
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            // replace chosenYAxis with value
            chosenYAxis = value;
            // update y scale for new data
            yLinearScale = yScale(healthData, chosenYAxis);
            // update y axis with transition
            yAxis = renderAxes(yLinearScale, yAxis);
            // update circles with new y-values
            circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenXAxis, chosenyAxis);
            textGroup = renderText(textGroup, yLinearScale, chosenXAxis, chosenYAxis)
            // update tooltip
            circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
            // change class types to clicked type
            if (chosenYAxis === "healthcare") {
                healthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenXAxis === "smokes") {
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else {
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    }); //end yLabelsAll function
});
