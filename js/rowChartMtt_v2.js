
// Bar chart Module
/////////////////////////////////

// Declare namespace


// Declare component: (this outer function acts as the closure):
d3.cloudshapes.rowChartMtt_v2 = function module() {
    var margin = {top: 0, right: 20, bottom: 40, left: 90},
        width = 500,
        height = 500,
        gap = 0,
        color = "#001ff0"
        ease = "bounce",
        strokeovercolor = "red";

    var selectable = true;
    var data = [];
    var labels = [];
    var dataTitle = "";
    var dataUnit = "";
    var onClickFunction = function(){};
    var svg;
    var showRowText = true;
    var updateData;
    var updateWidth;
    var clearSelection;
    var barDiferentColor = false;
    var barColors = [];
    var showUnitAxis = true;

    function wrap(text, width, right) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", -right).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", -right).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }


    // Define the 'inner' function: which, through the surreal nature of JavaScript scoping, can access
    // the above variables.
    function exports(_selection) {
        _selection.each(function() {
            _data = data;
            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;


      // Define x and y scale variables.
            var x1 = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i) { return d*1.1; })])
                    .range([0,chartW]);

            var y1 = d3.scale.ordinal()
                    .domain(labels.map(function(d) { return d; }))
                    .rangeRoundBands([0, chartH], 0.1);

            var xAxis = d3.svg.axis()
                .scale(x1)
                .orient("bottom")
                .innerTickSize(0)
                .ticks(3)
                .innerTickSize(chartH)
                .outerTickSize(10)
                .tickPadding(10)
                .tickFormat(function(d){
                    let unit = showUnitAxis ? dataUnit : '';
                    return d.toLocaleString('de-DE')+" "+unit;});

            var yAxis = d3.svg.axis()
                .scale(y1)
                .orient("left")
                .outerTickSize(0)
                .tickPadding(20);
                // .tickFormat(function (d){ return ""});

      // If no SVG exists, create one - and add key groups:
            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .style('overflow', 'visible')
                    .classed("mtt-rowchart", true);
                var container = svg.append("g").classed("container-group", true);
                svg.select(".container-group")
                .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});
            }

      // Transition the width and height of the main SVG and the key 'g' group:
            svg.transition().attr({width: width, height: height});


            // container.append("g")
            //   .attr("class", "y axis")
            //   .attr("transform", "translate("+ margin.left +"," + 0 + ")")
            //   .call(yAxis);

            container.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .selectAll(".tick text")
                .call(wrap, (margin.left-5), 15);

            // container.append("g")
            //   .attr("class", "y axis1")
            //   .attr("transform", "translate("+ 0 +"," + -10 + ")")
            //   .call(yAxis1);

            // container.append("g")
            //   .attr("class", "y axis2")
            //   .attr("transform", "translate("+ 0 +"," + 0 + ")")
            //   .call(yAxis2);

           container.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate("+ 0 +"," + 0 + ")")
              .call(xAxis);

            container.append("g")
                .attr("class", "x axis mark")
                .append('line')
                .attr("class", "group-name-line")
                .attr('x2', chartW)
                .attr('x1', -10)
                .attr('y2', chartH)
                .attr('y1', chartH)
                .style('stroke', "#ebebeb")
                ;

            container.append("g")
                .attr("class", "y axis mark")
                .append('line')
                .attr("class", "group-name-line")
                .attr('x2', 0)
                .attr('x1', 0)
                .attr('y2', 0)
                .attr('y1', chartH)
                .style('stroke', "black")
                ;

            container.append("g").classed("row-chart-group", true);

            // Define gap between bars:
            var gapSize = y1.rangeBand() / 100 * gap;

            // Define width of each bar:
            var barH = y1.rangeBand() - gapSize;

            // Select all bars and bind data:
            var rows = svg.select(".row-chart-group")
                    .selectAll(".row")
                    .data(_data);


            var tip = d3.tip()
              .attr('class', 'd3-tip-bar')
              .style('z-index', '99')
            //   .offset([barH, 0])
              .html(function(d,i) {
                return "<strong>"+labels[i]+" - </strong><span>"+dataTitle+": </span><span>"+d.toLocaleString('de-DE')+" "+ dataUnit.toLocaleString('de-DE') +"</span>";
              });

            var gRows = rows.enter().append("g").classed("_selected_", true)

            gRows.append("rect")
                .classed("row", true)
                .attr(
                    {x: 1,
                    width: function(d, i) { return x1(d);},
                    y: function(d, i) { return y1(labels[i]) + gapSize / 2; },
                    height: barH
                }).style("fill", color)
                .on('mouseover', function(d,i){tip.show(d,i);  d3.select(this).style("stroke", strokeovercolor);})
                    .on('mouseout', function(d,i){tip.hide(d,i); d3.select(this).style("stroke", "none");})
                    .on("click", function(d,i){
                        if (selectable) {
                            var index = i;
                            gRows.classed('_selected_', function(d,i) {
                                return i === index;
                            });

                            svg.select('.y.axis')
                                .selectAll('text')
                                .style('opacity', function(d, i) {
                                    if (i === index) {
                                        return 1;
                                    } else {
                                        return 0.3;
                                    }
                                });

                            onClickFunction(this, d,labels[i]);
                        }
                    })
                    .style("fill", function(d,i){
                        if(barDiferentColor){
                            return barColors[i]
                        }else{
                            return color
                        }
                    });
            if (showRowText){
            var rowText = gRows.append('text')
                .attr({
                    x: 10,
                    y: function(d, i) { return y1(labels[i]) + gapSize / 2 + barH / 2 + 5; }
                })
                .text(function(d, i) {
                    return d.toLocaleString('de-DE');
                })
                .style('fill', '#f6f6f6')
                .on("click", function(d,i){
                    if (selectable) {
                        var index = i;
                        gRows.classed('_selected_', function(d,i) {
                            return i === index;
                        });

                        svg.select('.y.axis')
                            .selectAll('text')
                            .style('opacity', function(d, i) {
                                if (i === index) {
                                    return 1;
                                } else {
                                    return 0.3;
                                }
                            });

                        onClickFunction(svg.selectAll('.row')[0][i], d,labels[i]);
                    }
                })
                .style('cursor', 'pointer');
            }
            svg.select('.y.axis')
                .selectAll('.tick text')
                .on("click", function(d,i){
                    var index = i;
                    gRows.classed('_selected_', function(d,i) {
                        return i === index;
                    });

                    svg.select('.y.axis')
                        .selectAll('text')
                        .style('opacity', function(d, i) {
                            if (i === index) {
                                return 1;
                            } else {
                                return 0.3;
                            }
                        });

                    onClickFunction(svg.selectAll('.row')[0][i], d,labels[i]);
                })
                .style('cursor', 'pointer');

            svg.call(tip);

            // D3 UPDATE code for bars
            // rows.transition()
            //     .ease(ease)
            //     .attr({
            //         x: 0,
            //         width: function(d, i) { return chartW - x1(d);},
            //         y: function(d, i) { return y1(labels[i]) + gapSize / 2; },
            //         height: barH
            //     });

            // D3 EXIT code for bars
            rows.exit().transition().style({opacity: 0}).remove();


            updateData = function() {
                _data = data;

                // Define x and y scale variables.
                var x1 = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i) { return d*1.1; })])
                    .range([0,chartW]);

                y1 = d3.scale.ordinal()
                    .domain(_data.map(function(d, i) { return i; }))
                    .rangeRoundBands([0, chartH], 0.1);

                xAxis = d3.svg.axis()
                    .scale(x1)
                    .orient("bottom")
                    .innerTickSize(0)
                    .ticks(3)
                    .innerTickSize(chartH)
                    .outerTickSize(10)
                    .tickPadding(10)
                    .tickFormat(function(d){
                        let unit = showUnitAxis ? dataUnit : '';
                        return d.toLocaleString('de-DE') + ' '+ unit;});

                svg.select(".x.axis")
                    .transition()
                    .attr("transform", "translate("+ 0 +"," + 0 + ")")
                    .call(xAxis);

                // Define gap between bars:
                gapSize = y1.rangeBand() / 100 * gap;

                // Define width of each bar:
                barH = y1.rangeBand() - gapSize;

                // Select all bars and bind data:
                rows = svg.select(".row-chart-group")
                        .selectAll(".row")
                        .data(_data);

                rows.enter().append("rect")
                    .classed("row", true)
                    .attr({
                        x: 1,
                        width: function(d, i) { return chartW - x1(d);},
                        y: function(d, i) { return y1(i) + gapSize / 2; },
                        height: barH
                    })
                    .style("fill", function(d,i){
                        if(barDiferentColor){
                            return barColors[i]
                        }else{
                            return color
                        }
                    });

                // D3 UPDATE code for bars
                rows.transition()
                    .ease(ease).duration(1000)
                    .attr({
                        x: 1,
                        width: function(d, i) { return x1(d);},
                        y: function(d, i) { return y1(i) + gapSize / 2; },
                        height: barH
                    });
                if(showRowText){
                rowText.data(_data).transition()
                    .ease(ease).duration(1000)
                    .text(function(d,i) {
                        return d.toLocaleString('de-DE');
                    });
                }

                  // D3 EXIT code for bars
                rows.exit().transition().style({opacity: 0}).remove();

                // svg.call(tip);
            }

            updateWidth = function() {
                _data = data;

                chartW = width - margin.left - margin.right;

                x1 = d3.scale.sqrt()
                    .domain([0, d3.max(_data, function(d, i) { return d; })])
                    .range([0,chartW]);

                xAxis = d3.svg.axis()
                    .scale(x1)
                    .orient("bottom")
                    .innerTickSize(0)
                    .ticks(2)
                    .innerTickSize(chartH)
                    .outerTickSize(10)
                    .tickPadding(10)
                    .tickFormat(function(d){return d.toLocaleString('de-DE');});

                svg.select(".x.axis")
                    .transition()
                    .call(xAxis);

                svg.select(".x.axis.mark line")
                    .transition()
                    .attr('x2', chartW);

                // Select all bars and bind data:
                rows = svg.select(".row-chart-group")
                        .selectAll(".row")
                        .data(_data);



                // D3 UPDATE code for bars
                rows.transition()
                    .ease(ease).duration(1000)
                    .attr({
                        x: 1,
                        width: function(d, i) { return x1(d);}                    });

                rowText.data(_data).transition()
                    .ease(ease).duration(1000)
                    .text(function(d,i) {
                        return d.toLocaleString('de-DE');
                    });


                svg.transition().attr({width: width, height: height});
            }

            clearSelection = function() {
                svg.select('.y.axis')
                        .selectAll('text')
                        .style('opacity', 1);
                gRows.classed('_selected_', true);
                onClickFunction(svg);
            }
        });
    }

    exports.cleanFilter = function() {
        if (typeof clearSelection === 'function') clearSelection();
    }

    // GETTERS AND SETTERS:

    exports.data = function(_x) {
        if (!arguments.length) return data;
        data = _x;
        if (typeof updateData === 'function') updateData();
        return this;
    };

    exports.strokeOverColor = function(_x){
        if (!arguments.length) return strokeovercolor;
        strokeovercolor = _x;
        return this;
    }


    exports.onClickFunction = function(value) {
        if (!arguments.length) return onClickFunction;
        onClickFunction = value;
        return this;
    };

    exports.labels = function(_x) {
        if (!arguments.length) return labels;
        labels = _x;
        return this;
    };

    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        if (typeof updateWidth === 'function') updateWidth();
        return this;
    };

    exports.dataTitle = function(_x) {
        if (!arguments.length) return dataTitle;
        dataTitle = _x;
        return this;
    };

    exports.showUnitAxis = function(_x) {
        if (!arguments.length) return showUnitAxis;
        showUnitAxis = _x;
        return this;
    }

    exports.dataUnit = function(_x) {
        if (!arguments.length) return dataUnit;
        dataUnit = _x;
        return this;
    };
    exports.showRowText = function(_x) {
        if (!arguments.length) return showRowText;
        showRowText = _x;
        return this;
    };

    exports.barDiferentColor = function(_x) {
        if (!arguments.length) return barDiferentColor;
        barDiferentColor = _x;
        return this;
    }
    exports.barColors = function(_x){
        if (!arguments.length) return barColors;
        barColors = _x;
        return this;
    }
    exports.setColor = function(_x) {
        if (!arguments.length) return color;
        color = _x;
        return this;
    };

    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        return this;
    };
    exports.gap = function(_x) {
        if (!arguments.length) return gap;
        gap = _x;
        return this;
    };
    exports.ease = function(_x) {
        if (!arguments.length) return ease;
        ease = _x;
        return this;
    };

    exports.margin = function(_x) {
        if (!arguments.length) return margin;
        margin = _x;
        return this;
    };

    exports.selectable = function(_x) {
        if (!arguments.length) return selectable;
        selectable = _x;
        return this;
    };

    return exports;
};
