


d3.cloudshapes.donutChartMtt_v2 = function module() {
    var margin = {top: 20, right: 20, bottom: 40, left: 20},
        width = 500,
        height = 500,
        gap = 0,
        color = "#001ff0"
        ease = "bounce";
    var padding = {top: 0, right: 0, bottom: 0, left: 0};
    var outRadius = 0;
    var innRadius = 0;
    var alpha = 0.5;
    var spacing = 12;
    var selectable = true;
    var data = [];
    var labels = [];
    var dataTitle = "";
    var dataUnit = "";
    var showLegend = true;
    var showLabel = false;
    var legendX = 10;
    var legendY = 10;
    var onClickFunction = function(){};
    var svg;
    labelSize = 15;
    var colorsArray = ["#35aacb", "#ffcc03","#fa0606", "#b4d4da","#35cb56", "#5635cb", "#aacb35", "#ff5f1c", "#ffe581", "#7a0199"];
    var mouseStrokeOverColor = 'red';
    var stroke = 'none';
    var decimalTip = 2;
    var showNumber = true
    var filterInitial =[];
    var extraInfoTip = [];

    var tip = d3.tip()
      .attr('class', 'd3-tip-bar')
      .style('z-index', '99')
      .offset([-10, 0])
      .html(function(d,i) {
        var total = 0;
        data.forEach(function(d){total += Number(d)});

        let parentesis = ''
        if (showNumber){ parentesis = '<span>(' + (d.value).toLocaleString('de-DE')+" "+ dataUnit.toLocaleString('de-DE') +")</span>"}
        if (extraInfoTip.length > i) return "<h4><strong>"+labels[i]+"</strong></h4><div class='content'><table><tr><td>"+dataTitle+": </td><td> <span> &nbsp;"+ d3.round((100*d.value/total),decimalTip).toLocaleString('de-DE')+ ' % </span> ' + parentesis +"</td></tr><tr> <td></td> <td><span>"+ extraInfoTip[i]+"</span></td></tr></table></div>";
        return "<h4><strong>"+labels[i]+"</strong></h4><div class='content'><table><tr><td>"+dataTitle+": </td><td> <span> &nbsp;"+ d3.round((100*d.value/total),decimalTip).toLocaleString('de-DE')+ ' % </span> ' + parentesis +"</td></tr></table></div>";

      })

    function wrap() {
        textWidth = width-legendX-20;
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while (textLength > (textWidth - 2 * 0) && text.length > 0) {
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }
    }

    var expandRadius = true;
    var updateData;
    var updateWidth;
    var clearSelection;

    // Define the 'inner' function: which, through the surreal nature of JavaScript scoping, can access
    // the above variables.
    function exports(_selection) {
        _selection.each(function() {
            var _data = data;
            var colors = d3.scale.linear()
                .domain(d3.range(10))
                .range(colorsArray);


            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            // Define x and y scale variables.
            var x1 = d3.scale.ordinal()
                    .domain(labels.map(function(d, i) { return i; }))
                    .rangeRoundBands([0, chartW], 0.1);

            var y1 = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i) { return d; })])
                    .range([chartH, 0]);

      // If no SVG exists, create one - and add key groups:
            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("mtt-donutchart", true)
                    .style('overflow','visible');
                var container = svg.append("g")
                    .classed("container-group", true);
                var pie_container= container.append("g")
                    .classed("donut-chart-group", true);
                var labelsContainer= container.append("g")
                    .classed("labels-group", true);
                var legendContainer  = svg.append("g")
                    .classed("legend-group", true);

            }

      // Transition the width and height of the main SVG and the key 'g' group:
            svg.attr({width: width, height: height});
            svg.select(".container-group")
                .attr({transform: "translate(" + (margin.left+(chartW/2)) + "," + (margin.top+(chartH/2)) + ")"});

            var pie = d3.layout.pie()
                .value(function(d) { return d; })
                .sort(null);

            var arc = d3.svg.arc()
                .innerRadius(outRadius)
                .outerRadius(innRadius);


            if(expandRadius){
                var arcOver = d3.svg.arc()
                    .innerRadius(outRadius*1.1)
                    .outerRadius(innRadius*1.1);
            }
            var arcs = pie_container.selectAll(".donut-arc")
                .data(pie(_data));

            if(filterInitial.length){
                var filterOpacity = [];
                labels.map((label,i) => {
                    filterOpacity.push(0.3);
                    filterInitial.map((filter) => {
                        if (label === filter){
                            filterOpacity[i] = 1;
                        }
                    })
                })
            }else{
                filterOpacity = new Array(1);
            }

            arcs.enter().append("g")
                .classed("donut-arc", true)
                .classed("_selected_", true)
                .style('opacity', function(d,i){ return filterOpacity[i]});


            var paths = arcs.append("path")
                .attr("fill", function(d, i) {
                    return colors(i); })
                .attr("d", arc)
                .attr('label', ((d,i) => {
                    return labels[i];
                }))
                .style('stroke',strokeColor)
                .style('cursor','pointer')
                .each(function(d) {this._current = d;} )
                .on('mouseover', function(d,i){
                    tip.show(d,i);
                    d3.select(this).style("stroke", mouseStrokeOverColor);
                    if (expandRadius){
                        d3.select(this).transition().duration(250).attr("d", arcOver);
                    }
                })
                .on('mouseout', function(d,i){
                    tip.hide(d,i);
                    d3.select(this).style("stroke", strokeColor);
                    if(expandRadius){
                        d3.select(this).transition().duration(250).attr("d", arc);
                    }
                })
                .on("click", function(d,i){

                    if (selectable) {
                        var index = i;
                        svg.selectAll(".donut-arc").classed("_selected_", function(d, i) { return i === index; });
                        svg.selectAll(".labels").classed("_selected_", function(d, i) { return i === index; });
                        svg.selectAll(".legend-item").classed("_selected_", function(d, i) { return i === index; });
                        svg.selectAll('.donut-arc')
                            .style('opacity', ((d,i) => {

                                if (i === index){
                                    return 1;
                                } else {
                                    return 0.3;
                                }
                            }));
                        svg.selectAll('.labels')
                            .style('opacity', function(d, i) {
                                if (i === index) {
                                    return 1;
                                } else {
                                    return 0.3;
                                }
                            });
                        onClickFunction(this, d, labels[i]);
                    }
                })


            var gLabels = [];
            var items = [];

            if (showLegend== true){
              createLegend();
            }
            if (showLabel == true){
              createLabels();

            }





            svg.call(tip);


            function createLegend(){
              items = legendContainer.selectAll(".legend-item")
                .data(pie(_data));

              items.enter().append("g")
                .classed("legend-item", true)
                .classed("_selected_", true)
                .attr({transform: "translate(" + (legendX) + "," + (legendY) + ")"})
                .on("click", function(d,i){
                    if (selectable) {
                        var index = i;
                        svg.selectAll(".donut-arc").classed("_selected_", function(d, i) { return i === index; });
                        svg.selectAll(".labels").classed("_selected_", function(d, i) { return i === index; });
                        svg.selectAll(".legend-item").classed("_selected_", function(d, i) { return i === index; });
                        svg.selectAll('.donut-arc')
                            .style('opacity', ((d,i) => {

                                if (i === index){
                                    return 1;
                                } else {
                                    return 0.3;
                                }
                            }));
                        svg.selectAll('.labels')
                            .style('opacity', function(d, i) {
                                if (i === index) {
                                    return 1;
                                } else {
                                    return 0.3;
                                }
                            });
                        onClickFunction(svg.selectAll('path')[0][i], d, labels[i]);
                    }
                });


              items.append("text").append('tspan').text(function(d, i) {
                        return labels[i].toLocaleString();
                    })
                    .style('font-size', labelSize)
                    .attr("x", function(d) {
                      return 10;
                    })
                    .attr("y", function(d,i) {
                      return 20*i;
                    })
                    .attr('dx', '20').each(wrap)
                    .append('tspan').classed("data-values", true).text(function(d, i) {
                        return " (" +d3.round(d.value, decimalTip).toLocaleString() + ")";
                    });

              items.append("rect")
                    .attr("x", function(d) {
                      return 10;
                    })
                    .style('cursor','pointer')
                    .attr("y", function(d,i) {
                      return 20*i-10;
                    })
                    .attr('width', '10')
                    .attr('height', '10')
                    .attr("fill", function(d, i) {
                      return colors(i);
                    });


            }




        function createLabels(){


            var labels2 = labelsContainer.selectAll(".label-arcs")
                .data(pie(_data));

            gLabels = labels2.enter()
                .append("g")
                .classed("labels", true)
                .classed("_selected_", true)
                .style("text-anchor", function(d) {
                    var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle + 10;
                    if ( (rads > 7 * Math.PI / 4 && rads < Math.PI / 4) || (rads > 3 * Math.PI / 4 && rads < 5 * Math.PI / 4) ) {
                      return "middle";
                    } else if (rads >= Math.PI / 4 && rads <= 3 * Math.PI / 4) {
                        return "start";
                    } else if (rads >= 5 * Math.PI / 4 && rads <= 7 * Math.PI / 4) {
                        return "end";
                    } else {
                        return "middle";
                    }
                })
                .style('opacity',((d,i) => { return filterOpacity[i]}))
                .style('cursor', 'pointer');



            gLabels.append('text')
                    .classed('labelValue', true)
                    .attr("x", function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                        d.cx = Math.cos(a) * (outRadius + 75);
                        return d.x = Math.cos(a) * (outRadius + 15);
                    })
                    .attr("y", function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                        d.cy = Math.sin(a) * (outRadius + 75);
                        return d.y = Math.sin(a) * (outRadius + 15);
                    })
                    .attr('dy', '0.2em')
                    .style("font-size", labelSize)
                    .text(function(d, i) {
                        if ((d.endAngle-d.startAngle )> 0.5){

                            return labels[i];
                        }else{
                            return "";
                        }
                    })


              relax();
            }

            function arcTween(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) {
                return arc(i(t));
              };
            }

            function relax() {
                var again = false;
                gLabels.each(function(d, i) {
                    var a = this;
                    var da = d3.select(a);
                    var y1 = da.attr("y");
                    gLabels.each(function(d, i) {
                        var b = this;
                        if (a == b) return;
                        var db = d3.select(b);
                        if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                        var y2 = db.attr("y");
                        deltaY = y1 - y2;
                        if (Math.abs(deltaY) > spacing) return;
                        again = true;
                        var sign = deltaY > 0 ? 1 : -1;
                        var adjust = sign * alpha;
                        da.attr("y", +y1 + adjust);
                        db.attr("y", +y2 - adjust);
                    });
                });
                if (again) { setTimeout(relax, 20); }
            }

            updateData = function() {

                _data = data;
                pie.value(function(d) { return d; }).sort(null);

                path = svg.select(".donut-chart-group").selectAll("path").data(pie(_data));

                path.transition().duration(1000)
                    .attrTween("d", arcTween);



                svg.selectAll('.labels')
                    .data(pie(_data))
                    .style("text-anchor", function(d) {
                        var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle + 10;
                        if ( (rads > 7 * Math.PI / 4 && rads < Math.PI / 4) || (rads > 3 * Math.PI / 4 && rads < 5 * Math.PI / 4) ) {
                          return "middle";
                        } else if (rads >= Math.PI / 4 && rads <= 3 * Math.PI / 4) {
                            return "start";
                        } else if (rads >= 5 * Math.PI / 4 && rads <= 7 * Math.PI / 4) {
                            return "end";
                        } else {
                            return "middle";
                        }
                    })
                    ;


                svg.selectAll('.labelValue')
                    .data(pie(_data))
                    .transition()
                    .duration(1500)
                    .attr("x", function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                        d.cx = Math.cos(a) * (outRadius + 75);
                        return d.x = Math.cos(a) * (outRadius + 15);
                    })
                    .attr("y", function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                        d.cy = Math.sin(a) * (outRadius + 75);
                        return d.y = Math.sin(a) * (outRadius + 15);
                    })
                    .text(function(d, i) {
                        if ((d.endAngle-d.startAngle )> 0.5){
                            return labels[i];
                        }else{
                            return "";
                        }

                    });
                // relax();

              items = legendContainer.selectAll(".legend-item")
                .data(pie(_data));
                child = items.selectAll("tspan.data-values")
                    .data(function(d) { return [d]; });
                child
                    .transition()
                    .duration(1500)
                    .text(function(d, i) {
                        return " (" +d3.round(d.value, decimalTip).toLocaleString() + ")";
                    })


                svg.transition().attr({width: width, height: height});
            }

            updateWidth = function () {
                chartW = width - margin.left - margin.right;
                x1 = d3.scale.ordinal()
                    .domain(labels.map(function(d, i) { return i; }))
                    .rangeRoundBands([0, chartW], 0.1);

                svg.transition().attr({width: width, height: height});

                svg.select(".container-group")
                    .transition()
                    .attr({transform: "translate(" + (margin.left+(chartW)/2) + "," + (margin.top+(chartH)/2) + ")"});

              items.selectAll("text").remove();
              items.append("text").append('tspan').text(function(d, i) {
                        return labels[i].toLocaleString();
                    })
                    .attr("x", function(d) {
                      return 10;
                    })
                    .attr("y", function(d,i) {
                      return 20*i;
                    })
                    .attr('dx', '20').each(wrap)
                    .append('tspan').classed("data-values", true).text(function(d, i) {
                        return "(" +d.value.toLocaleString() + ")";
                    });

            }

            clearSelection = function() {
                svg.selectAll(".donut-arc").classed("_selected_", true);
                svg.selectAll(".labels").classed("_selected_", true);
                svg.selectAll(".legend-item").classed("_selected_", true);
                onClickFunction(svg);
            }

        });
    }


    exports.mouseStrokeOverColor = function(_x){

        if (!arguments.length) return mouseStrokeOverColor;
        mouseStrokeOverColor = _x;
        return this;
    }
    exports.cleanFilter = function() {
        if (typeof clearSelection === 'function') clearSelection();
    }

    exports.data = function(_x) {
        if (!arguments.length) return data;
        data = _x;
        if (typeof updateData === 'function') updateData();
        return this;
    };

    exports.strokeColor = function(_x){
        if (!arguments.length) return strokeColor;
        strokeColor = _x;
        return this;
    }

    exports.expandRadius = function(_x){
        if (!arguments.length) return expandRadius;
        expandRadius = _x;
        return this;
    }

    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        if (typeof updateWidth === 'function') updateWidth();
        return this;
    };

    exports.onClickFunction = function(value) {
        if (!arguments.length) return onClickFunction;
        onClickFunction = value;
        return this;
    };

    exports.colors = function(value){
        if (!arguments.length) return colorsArray;
        colorsArray = value;
        return this;
    }

    exports.labels = function(_x) {
        if (!arguments.length) return labels;
        labels = _x;
        return this;
    };

    exports.dataTitle = function(_x) {
        if (!arguments.length) return dataTitle;
        dataTitle = _x;
        return this;
    };

    exports.dataUnit = function(_x) {
        if (!arguments.length) return dataUnit;
        dataUnit = _x;
        return this;
    };

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

    exports.innRadius = function(_x) {
        if (!arguments.length) return innRadius;
        innRadius = parseInt(_x);
        return this;
    };

    exports.outRadius = function(_x) {
        if (!arguments.length) return outRadius;
        outRadius = parseInt(_x);
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

    exports.showLegend = function(_x) {
        if (!arguments.length) return showLegend;
        showLegend = _x;
        return this;
    };

    exports.legendX = function(_x) {
        if (!arguments.length) return legendX;
        legendX = _x;
        return this;
    };

    exports.legendY = function(_x) {
        if (!arguments.length) return legendY;
        legendY = _x;
        return this;
    };


    exports.showLabel = function(_x) {
        if (!arguments.length) return showLabel;
        showLabel = _x;
        return this;
    };

    exports.showNumber = function(_x){
        if (!arguments.length) return showNumber;
        showNumber = _x;
        return this
    }

    exports.margin = function(_x) {
        if (!arguments.length) return margin;
        margin = _x;
        return this;
    };

    exports.decimalTip = function(_x){
        if (!arguments.length) return decimalTip;
        decimalTip = _x;
        return this;
    }
    exports.labelSize = function(_x){
        if (!arguments.length) return labelSize;
        labelSize = _x;
        return this;
    }

    exports.selectable = function(_x) {
        if (!arguments.length) return selectable;
        selectable = _x;
        return this;
    };

    exports.filterInitial = function(_x) {
        if (!arguments.length) return filterInitial;
        filterInitial = _x;
        return this;
    };

    exports.extraInfoTip = function(_x) {
        if (!arguments.length) return extraInfoTip;
        extraInfoTip = _x;
        return this;
    };

    return exports;
};
