"use strict";

d3.json("lyric_count.json", function(error, data) {
  var screenWidth, currYear = 1946,
      body = d3.select("body"),
      yearSlider = body.select("#yearSlider"),
      div = body.append("div").attr("id", "mainDiv"),
      year = body.select("#title").select("span"),
      min = d3.min(data, function(d) { return d["frequency"]; }),
      max = d3.max(data, function(d) { return d["frequency"]; }),
      colorScale = d3.scale.linear().domain([0, max]).range(["#052B5D", "yellow"]),
      transitionTime = 400;

  //updateWindow();
  updateYear(currYear);

  var slider = d3.slider().axis(true).min(1946).max(2013).step(1);
  yearSlider.call(slider);

  slider.on("slide", function(e, val) { 
    updateYear(val);
  });
  
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