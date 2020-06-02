function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  // Set svg margins 
  var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
  };

  // Create the width and height based svg margins and parameters to fit chart group within the canvas
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create the canvas to append the SVG group that contains the states data
  // Give the canvas width and height calling the variables predifined.
  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Create the chartGroup that will contain the data
  // Use transform attribute to fit it within the canvas
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read Data from CSV

  // Function is called and passes csv data
  d3.csv("data.csv").then(function (statesData) {

    // Loop through the data and pass argument data
    statesData.map(function (data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    //  Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(statesData, d => d.poverty))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain(d3.extent(statesData, d => d.obesity))
      .range([height, 0]);

    // Create axis functions by calling the scale functions

    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes to the chart group 
    // Bottom axis moves using height 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    // Create Circles for scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
      .data(statesData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".75")


    // Append text to circles 

    var circlesGroup = chartGroup.selectAll()
      .data(statesData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.obesity))
      .style("font-size", "13px")
      .style("text-anchor", "middle")
      .style('fill', 'white')
      .text(d => (d.abbr));

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obese (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function (error) {
    console.log(error);
  });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

