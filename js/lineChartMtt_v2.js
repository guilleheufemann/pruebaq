
// Bar chart Module
/////////////////////////////////

// Declare namespace


// Declare component: (this outer function acts as the closure):
d3.cloudshapes.lineChartMtt_v2 = function module() {
    var margin = {top: 10, right: 40, bottom: 40, left: 70},
        width = 500,
        height = 500,
        gap = 0,
        colors = "grey"
        ease = "bounce";


    var data = [];
    var labels = [];
    var svg;
    var container;
    var dataTitle = "";
    var dataUnit = "";
    var updateData;
    var showDropShadow = false;
    var gridLine = true;
    var showYaxis = true;
    var labelRotation = 0;
    var labelSize = 11;
    var multiLine = false;
    var labelTitle = [];
    var legendX= 10;
    var legendY= 20;
    var domainY = [];
    var iconURLs = [];
    var colorsCircles = ['transparent'];
    var doubleYaxis = false;
    var labelTitleTip = false;
    var decimalTip = 2;
    var showTitle = false;
    var textTitle = '';
    var classTitle = '';
    var showUnitAxis = true;

    var tip = d3.tip()
      .attr('class', 'd3-tip-bar')
      .style('z-index', '99')
      .offset([-10, 0])
      .html(function(d,i,label) {
        if (dataTitle != ""){
            label = dataTitle;
        }

        return "<h4><strong>"+labels[i]+"</strong></h4><div class='content'><table><tr><td>"+label+": </td><td>"+ d3.round(d,decimalTip).toLocaleString('de-DE') +" "+ dataUnit.toLocaleString('de-DE') +"</td></tr></table></div>";

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


    // Define the 'inner' function: which, through the surreal nature of JavaScript scoping, can access
    // the above variables.
    function exports(_selection) {
        _selection.each(function() {
            _data = data;
            _labels = labels;
            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            var range_value = .2;

      // Define x and y scale variables.
            var x1 = d3.scale.ordinal().domain(labels)
                    .rangePoints([0, chartW]);

            // var x1 = d3.scale.ordinal()
            //         .domain(_data.map(function(d, i) { return i; }))
            //         .range(["0","1","2","3","4","5","6"]);

            var negativeValue = d3.min(_.flatten(_data), ((d,i)=>{ return d  })) < 0 ;

            if (negativeValue){
                if (domainY.length > 1){
                    var y1 = d3.scale.linear()
                        .domain(domainY)
                        .range([chartH, 0])
                }else{
                    var y0 = Math.max(-d3.min(_.flatten(_data), ((d,i)=>{ return d + 0.1*d  })), d3.max(_.flatten(_data), ((d,i)=>{ return d + 0.1 * d })));
                    var y1 = d3.scale.linear()
                    .domain([-y0, y0])
                    .range([chartH, 0]);
                }

            }else{
                if(domainY.length > 1){
                var y1 = d3.scale.linear()
                    .domain(domainY)
                    .range([chartH, 0]);
                }else{
                 var y1 = d3.scale.linear()
                    .domain([0, d3.max(_.flatten(_data), function(d, i) { return d + d * 0.1; })])
                    .range([chartH, 0]);
                }
            }




            var xAxis = d3.svg.axis()
               .scale(x1)
                .orient("bottom")
                .innerTickSize(5)
                .outerTickSize(5)
                .tickPadding(20)
                .tickFormat(function(d) { return d.toLocaleString('de-DE'); })



            // var xAxis1 = d3.svg.axis()
            //     .scale(x1)
            //     .orient("bottom")
            //     .tickPadding(6)
            //     .tickSize(8)
            //     .tickFormat(function(d){return ""});

            // var xAxis2 = d3.svg.axis()
            //     .scale(x1)
            //     .orient("bottom")
            //     .tickPadding(6)
            //     .tickSize(8)
            //     .tickFormat(function(d){return ""});

            var yAxis = d3.svg.axis()
                .scale(y1)
                .orient("left")
                .innerTickSize(-chartW)
                .ticks(5)
                .outerTickSize(margin.left)
                .tickPadding(10)
                .tickFormat(function(d) { return ""; });

            var yAxis1 = d3.svg.axis()
                .scale(y1)
                .orient('left')
                .ticks(5)
                .outerTickSize(0)
                .tickPadding(20)
                .tickSize(0)
                .tickFormat(function(d, i) {
                        let unit = showUnitAxis ? dataUnit : '';
                        return d.toLocaleString('de-DE') + " " + unit;
                    });


            var yAxis2 = d3.svg.axis()
                .scale(y1)
                .orient("left")
                .innerTickSize(0)
                .ticks(2)
                .tickSize(0)
                .tickPadding(0)
                .tickFormat(function(d) { return ""; });


            // If no SVG exists, create one - and add key groups:
            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("mtt-linechart", true);
                container = svg.append("g").classed("container-group", true);
                var legendContainer  = svg.append("g")
                    .classed("legend-column", true);
            }
            if (iconURLs.length > 0){



            var defs = svg.append('defs');
            var pattern = defs.append('pattern')
                .attr('id', 'image')
                .attr('x', '0')
                .attr('y', '0')
                .attr('height', '20')
                .attr('width', '20');

            pattern.append('image')
                .attr('x','0')
                .attr('y','0')
                .attr('height','20')
                .attr('width','20')
                .attr('xlink:href', iconURLs[0]);

            }
            if (showDropShadow){
                // filters go in defs element
                var defs = svg.append("defs");
                var stdDeviation = 3;

                // create filter with id #drop-shadow
                // height=130% so that the shadow is not clipped
                // filterUnits=userSpaceOnUse so that straight lines are also visible
                var filter = defs.append("filter")
                    .attr("id", "drop-shadow")
                    .attr("height", "130%")
                    .attr("filterUnits", "userSpaceOnUse")

                // SourceAlpha refers to opacity of graphic that this filter will be applied to
                // convolve that with a Gaussian with stdDeviation (3px) and store result
                // in blur
                filter.append("feGaussianBlur")
                    .attr("in", "SourceAlpha")
                    .attr("stdDeviation", stdDeviation)
                    .attr("result", "blur");

                // translate output of Gaussian blur to the right and downwards with stdDeviation
                // store result in offsetBlur
                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", 1)
                    .attr("dy", 1)
                    .attr("result", "offsetBlur");

                    filter.append("feFlood")
                .attr("in", "offsetBlur")
                .attr("flood-color",'#18181c')
                .attr("flood-opacity", "0.2")
                .attr("result", "offsetColor");

                filter.append("feComposite")
                .attr("in", "offsetColor")
                .attr("in2", "offsetBlur")
                .attr("operator", "in")
                .attr("result", "offsetBlur");

                // overlay original SourceGraphic over translated blurred opacity by using
                // feMerge filter. Order of specifying inputs is important!
                var feMerge = filter.append("feMerge");

                feMerge.append("feMergeNode")
                    .attr("in", "offsetBlur")
                feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");
            }


            // Transition the width and height of the main SVG and the key 'g' group:
            svg.transition().attr({width: width, height: height});
            container
                .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

            var line = d3.svg.line()

                .x(function(d,i) { return x1(labels[i]); })
                .y(function(d) {

                    return y1(d); })



            if (showTitle){
                div = container.append('g')
                 .attr('transform', 'translate(' + chartW/2  + ',0)')
                 .style("text-anchor", "middle")

                title = div.append('text')
                title.text(textTitle)
                     .classed(classTitle, true)

            }
            container.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + chartH + ")")
              .call(xAxis);

            container.select(".x").selectAll("text")
                .style("text-anchor", function() {
                    if (labelRotation == 0) {
                        return "middle"
                    } else {
                        return "end"
                    }
                })
                .style("font-size", labelSize)
                .attr("dx", "-.8em")
                .attr("dy", "-0.1em")
                .attr("transform", function(d) {
                    return "rotate(-" + labelRotation + ")"
                });


            if (!negativeValue){
                container.append("g")
                    .attr("class", "x axis mark")
                    .append('line')
                    .attr("class", "group-name-line")
                    .attr('x2', chartW)
                    .attr('x1', 0)
                    .attr('y2', chartH)
                    .attr('y1', chartH)
                    .style('stroke', "#60656b")
            }else{
                container.append("g")
                    .attr("class", "x axis mark")
                    .append('line')
                    .attr("class", "group-name-line")
                    .attr('x2', chartW)
                    .attr('x1', 0)
                    .attr('y2', y1(0))
                    .attr('y1', y1(0))
                    // .attr("transform", "translate(0,"- + y1(0)+ ")")
                    .style('stroke', "#60656b")
            }

            // container.append('g')
            //   .classed('axis', true)
            //   .classed('hours', true)
            //   .classed('labeled', true)
            //   .attr("transform", "translate(0,"+ chartH +")")
            //   .call(xAxis1)

            // container.append('g')
            //   .classed('axis', true)
            //   .classed('hours', true)
            //   .classed('labeled', true)
            //   .attr("transform", "translate(0,"+ -8 +")")
            //   .call(xAxis1)
             if (showYaxis) {
                container.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate("+ 0 +"," + 0 + ")")
                .call(yAxis);

                container.append("g")
                .attr("class", "y axis1")
                .attr("transform", "translate("+ 0 +"," + 0 + ")")
                .call(yAxis1);

                container.append("g")
                .attr("class", "y axis2")
                .attr("transform", "translate("+ (chartW+20) +"," + 0 + ")")
                .call(yAxis2);

             }

            var c = container.append("g").classed("line-chart-group", true)
            .attr("transform", "translate("+(x1.range()[0]*(1-range_value))+",0)");

            // Select all bars and bind data:

            if (multiLine){

                var groups = c.selectAll('.line-group')
                    .data(_data)
                    .enter().append('g')
                    .attr('class','lines')
                    .attr("name-label",function(d,i){

                        return labelTitle[i]})



                var lines = groups
                    .append("path")
                    .attr('class','line')
                    .attr('d', ((d) => {

                        return line(d)}))
                    .style('fill', 'none')
                    .style("stroke", function(d,i){ return colors[i]})
                    .style('stroke-width','2px')
                    .style("filter", function() { return showDropShadow ? "url(#drop-shadow)" : "" });


            var circlesGroup = svg.selectAll(".lines")
                    .data(_data);



            var circles = circlesGroup
                        .selectAll(".circle")
                        .data( ((d) => {

                            return d}))
                        .attr("name-label",function(d,i){

                        return labelTitle[i]})

            circles.enter().append('circle').classed("circle",true)
                .style("stroke", "transparent")
                .style("fill", function(d,i){
                    return colorsCircles[0]
                })
                .attr('cx', function (d,i) {
                    return x1(labels[i]);
                })
                .attr('cy', function (d) { return y1(d); })
                .attr('r', 3)
                .style("filter", function() { return showDropShadow ? "url(#drop-shadow)" : "" })
                .on('mouseover', function(d,i){

                    tip.show(d,i,this.parentElement.getAttribute('name-label'));  d3.select(this).style("stroke", "181544");})
                .on('mouseout', function(d,i){tip.hide(d,i, this.parentElement.getAttribute('name-label')); d3.select(this).style("stroke", "transparent");})
                ;


            } else{
            var path = svg.select(".line-chart-group")
                .append("path")
                       // Add the valueline path.
                .attr("class", "line")
                .attr("d", line(_data))
                .style("stroke", function(d,i){ return colors[i]})
                .style('fill', 'none')
                .style('stroke-width','2px')
                .style("filter", function() { return showDropShadow ? "url(#drop-shadow)" : "" });

            var circles = svg.select(".line-chart-group")
                    .selectAll(".circle")
                    .data(_data);

            circles.enter().append('circle').classed("circle",true)
                .style("stroke", "grey")
                .style("fill", "white")
                .attr('cx', function (d,i) {
                    return x1(labels[i]);
                })
                .attr('cy', function (d) { return y1(d); })
                .attr('r', 3)
                .on('mouseover', function(d,i){tip.show(d,i,this.parentElement.getAttribute('name-label'));  d3.select(this).style("stroke", "red");})
                .on('mouseout', function(d,i){tip.hide(d,i,this.parentElement.getAttribute('name-label')); d3.select(this).style("stroke", "grey");})
                ;
            }

                if (labelTitle.length >0 ){
                    createLegend();
                }


                svg.call(tip);
                function createLegend(){
                    items = legendContainer.selectAll(".legend-item")
                    .data(labelTitle);

                    items.enter().append("g")
                    .classed("legend-item", true)
                    .classed("_selected_", true)
                    .attr({transform: "translate(" + (chartW-legendX) + "," + (legendY) + ")"})


                    items.append("text").append('tspan').text(function(d, i) {
                    return d.toLocaleString('de-DE');
                    })
                    .attr("x", function(d, i) {
                        return 140 * (i % 3);
                    })
                    .attr("y", function(d, i) {
                        if (i < 3) return 0;
                        else return 20
                    })
                    .attr('dx', '15')
                    .style("font-size", "12px");
                    // .append('tspan').classed("data-values", true).text(function(d, i) {
                    //     return "(" +d.toLocaleString('de-DE') + ")";
                    // });

                    items.append("rect")
                    .attr("x", function(d, i) {
                        return (140 * (i % 3));
                    })
                    .attr("y", function(d, i) {
                        if (i < 3) return -10;
                        else return 10
                    })
                    .attr('width', '10')
                    .attr('height', '10')
                    .attr("fill", function(d, i) {
                    return colors[i];
                });
            }



            updateData = function() {

                _data = data;
                 negativeValue = d3.min(_.flatten(_data), ((d,i)=>{ return d  })) < 0 ;

                if (negativeValue){
                    if (domainY.length > 1){
                    y1 = d3.scale.linear()
                            .domain(domainY)
                            .range([chartH, 0])
                    }else{
                        y0 = Math.max(-d3.min(_.flatten(_data), ((d,i)=>{ return d + 0.1*d  })), d3.max(_.flatten(_data), ((d,i)=>{ return d + 0.1 * d })));
                        y1 = d3.scale.linear()
                        .domain([-y0, y0])
                        .range([chartH, 0]);
                    }

                }else{
                    if(domainY.length > 1){
                     y1 = d3.scale.linear()
                        .domain(domainY)
                        .range([chartH, 0]);
                    }else{
                     y1 = d3.scale.linear()
                        .domain([0, d3.max(_.flatten(_data), function(d, i) { return d + d * 0.1; })])
                        .range([chartH, 0]);
                    }
                }

                yAxis = d3.svg.axis()
                .scale(y1)
                .orient("left")
                .innerTickSize(-chartW)
                .ticks(5)
                .outerTickSize(margin.left)
                .tickPadding(10)
                .tickFormat(function(d) { return ""; });

                yAxis1 = d3.svg.axis()
                .scale(y1)
                .orient('left')
                .ticks(5)
                .outerTickSize(0)
                .tickPadding(10)
                .tickSize(0)
                .tickFormat(function(d, i) {
                    let unit = showUnitAxis ? dataUnit : '';
                    return d.toLocaleString('de-DE') + " " + unit;
                 });


                yAxis2 = d3.svg.axis()
                .scale(y1)
                .orient("left")
                .innerTickSize(0)
                .ticks(2)
                .tickSize(0)
                .tickPadding(0)
                .tickFormat(function(d) { return ""; });


                container.selectAll("g .y.axis").transition().call(yAxis);
                container.selectAll("g .y.axis1").transition().call(yAxis1);
                container.selectAll("g .y.axis2").transition().call(yAxis2);
                // svg.selectAll("g .x.axis").call(xAxis);


            if (multiLine){



                groups
                .data(_data)
                .select('.line')
                    .transition().ease(ease).duration(1000)
                    .attr('d', ((d,i) => {

                        return line(_data[i])}))


                circlesGroup = svg.selectAll(".lines")
                        .data(_data);


                circles = circlesGroup
                            .selectAll(".circle")
                            .data( ((d,i) => {

                                return _data[i]}))

                circles.transition().ease(ease).duration(1000).attr('cy', function (d) {

                    return y1(d); });


            } else{
                path.transition().ease(ease).duration(1000).attr("d", line(_data));

                circles = svg.selectAll("circle").data(_data);
                circles.transition().ease(ease).duration(1000).attr('cy', function (d) { return y1(d); });
            }

            }


        });
    }

    exports.data = function(_x) {
        if (!arguments.length) return data;
        data = _x;
        if (typeof updateData === 'function') updateData();
        return this;
    };

    exports.labels = function(_x) {
        if (!arguments.length) return labels;
        labels = _x;
        return this;
    };

    exports.doubleYaxis = function(_x){
        if(!arguments.length) return doubleYaxis;
        doubleYaxis = _x;
        return this;
    }

    exports.decimalTip = function(_x){
        if(!arguments.length) return decimalTip;
        decimalTip = _x;
        return this;
    }

    // GETTERS AND SETTERS:
    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        return this;
    };

    exports.legendY = function(_x) {
        if (!arguments.length) return legendY;
        legendY = _x;
        return this;
    }
    exports.legendX = function(_x) {
        if (!arguments.length) return legendX;
        legendX = _x;
        return this;
    }
    exports.showTitle = function(_x) {
        if (!arguments.length) return showTitle;
        showTitle = _x;
        return this;
    }

    exports.classTitle = function(_x) {
        if (!arguments.length) return classTitle;
        classTitle = _x;
        return this;
    }

    exports.textTitle = function(_x) {
        if (!arguments.length) return textTitle;
        textTitle = _x;
        return this;
    }

    exports.setColor = function(_x) {
        if (!arguments.length) return color;
        colors = _x;
        return this;
    };

    exports.showYaxis = function(_x){
        if (!arguments.length) return showYaxis;
        showYaxis = _x;
        return this;
    }

    exports.showDropShadow = function(_x){
          if (!arguments.length) return showDropShadow;
        showDropShadow = _x;
        return this;
    }
    exports.labelRotation = function(_x){
          if (!arguments.length) return labelRotation;
        labelRotation = _x;
        return this;
    }
    exports.labelSize = function(_x){
          if (!arguments.length) return labelSize;
        labelSize = _x;
        return this;
    }

    exports.iconURLs = function(_x){
        if (!arguments.length) return iconURLs;
        iconURLs = _x;
        return this;
    }

    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        return this;
    };

    exports.dataTitle = function(_x) {
        if (!arguments.length) return dataTitle;
        dataTitle = _x;
        return this;
    };
    exports.multiLine = function(_x) {
        if (!arguments.length) return multiLine;
        multiLine = _x;
        return this;
    };
    exports.domainY = function(_x) {
        if (!arguments.length) return domainY;
        domainY = _x;
          if (typeof updateData === 'function') updateData();
        return this;
    };

    exports.labelTitle = function(_x) {
        if (!arguments.length) return labelTitle;
        labelTitle = _x;
        return this;
    };

    exports.dataUnit = function(_x) {
        if (!arguments.length) return dataUnit;
        dataUnit = _x;
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
    exports.colorsCircles = function(_x){
        if (!arguments.length) return colorsCircles;
        colorsCircles = _x;
        return this;
    }
    exports.margin = function(_x) {
        if (!arguments.length) return margin;
        margin = _x;
        return this;
    };
    exports.showUnitAxis = function(_x) {
        if (!arguments.length) return showUnitAxis;
        showUnitAxis = _x;
        return this;
    };
    return exports;
};
