"use strict";

d3.json("lyric_count.json", function(error, data) {
  var screenWidth, mouseYear, currYear = 1946,
      body = d3.select("body"),
      div = body.append("div").attr("id", "mainDiv"),
      year = body.select("#title").select("span"),
      min = d3.min(data, function(d) { return d["frequency"]; }),
      max = d3.max(data, function(d) { return d["frequency"]; }),
      colorScale = d3.scale.linear().domain([0, max]).range(["#052B5D", "yellow"]),
      transitionTime = 400;

  updateWindow();
  updateYear(currYear);
  window.onresize = updateWindow;

  body.on("touchstart", function() {
    var x = d3.event.x;
    var year = mouseYear(x);

    if(year != currYear) {
      currYear = year;
      updateYear(currYear);
    }
  });

  body.on("mouseover", function() {
    var x = d3.mouse(this)[0];
    var year = mouseYear(x);

    if(year != currYear) {
      currYear = year;
      updateYear(currYear);
    }
  });

  function updateWindow() {
    var x = window.innerWidth || e.clientWidth || g.clientWidth;

    screenWidth = x - 100;
    mouseYear = d3.scale.quantize().domain([0, screenWidth]).range(d3.range(1946, 2014));
  }

  function dataForYear(y) {
    return data.filter(function(d) { return d["year"] == y; });
  }

  function updateYear(y) {
    year.text(y);
    update(dataForYear(y));
  }

  function fontWeight(frequency) {
    return (frequency > 0.5) ? 700 :
           (frequency > 0.4) ? 500 : 400;
  }

  function update(data) {
    // DATA JOIN
    // Join new data with old elements, if any.
    var words = div.selectAll("div.word")
        .data(data, function(d) { return d["word"]; });

    // UPDATE
    // Update old elements as needed.
    words.transition()
         .duration(transitionTime)
         .style("color", function(d) { return colorScale(d["frequency"]); })
         .style("font-weight", function(d) { return fontWeight(d["frequency"]); });

    // ENTER
    // Create new elements as needed.
    words.enter().append("div")
        .attr("class", "word")
        .transition()
        .duration(4*transitionTime)
        .style("color", function(d) { return colorScale(d["frequency"]); })
        .style("font-weight", function(d) { return fontWeight(d["frequency"]); })
        .text(function(d) { return d["word"]; });

    // EXIT
    // Remove old elements as needed.
    words.exit()
         .transition()
         .duration(transitionTime)
         .style("color", "#052B5D");
  }
});