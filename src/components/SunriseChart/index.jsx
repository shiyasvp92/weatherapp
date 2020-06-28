import React, { Component } from 'react';
import * as d3 from 'd3';

import './styles.scss';

export default class SunriseChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ skill: "CSS", value: 80 }, { skill: "HTML", value: 70 }, { skill: "JS", value: 85 }, { skill: "ANGULAR", value: 90 }, { skill: "REACT", value: 75 }, { skill: "D3", value: 70 }, { skill: "NODE JS", value: 65 }, { skill: "JAVA", value: 65 }, { skill: "UI DESIGN", value: 70 }, { skill: "XD", value: 65 }],
            yAxisAttribute: "skill",
            xAxisAttribute: "value",
            width: 0,
            height: 0,
        }
        this.chartRef = React.createRef();
        this.drawChart = this.drawChart.bind(this);
    }

    componentDidMount() {
        let width = this.getWidth()
        let height = this.getHeight();
        this.setState({ width: width, height: height }, () => {
            this.drawChart();
        });

        let resizedFn;
        window.addEventListener("resize", () => {
            clearTimeout(resizedFn);
            resizedFn = setTimeout(() => {
                this.redrawChart();
            }, 200)
        });
    }

    redrawChart() {
        let width = this.getWidth()
        this.setState({ width: width });
        d3.select(".rowChart svg").remove();
        this.drawChart = this.drawChart.bind(this);
        this.drawChart();
    }

    getWidth() {
        return this.chartRef.current.parentElement.offsetWidth;
    }
    getHeight() {
        return this.chartRef.current.parentElement.offsetHeight;
    }

    drawChart() {
        var margin = { top: 20, right: 1, bottom: 50, left: 1 };
        var width = this.state.width - margin.left - margin.right;
        var height = this.state.height - margin.top - margin.bottom;

        //add svg with margin !important
        //this is svg is actually group
        var svg = d3.select(".rowChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")  //add group to leave margin for axis
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var dataset = [[6, -15], [9.5, 0], [13, 15], [16.5, 0], [20, -15]];
        //for each d, d[0] is the first num, d[1] is the second num
        //set y scale
        var yScale = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset, function (d) { return Math.abs(d[1]); }), - d3.max(dataset, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale = d3.scaleLinear().rangeRound([0, width]).domain([6, d3.max(dataset, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x1(function (d) { return xScale(d[0]); })
            .y1(function (d) { return yScale(d[1]); })//draw the top line. Similar idea with line chart
            .x0(function (d) { return xScale(d[0]); })
            .y0(yScale(0));//draw the base line. Note: the x0 cannot be 0. it should be a line (x0,y0) --> (xScale(d[0]),0)  --> x axis

        //add area to svg. use path-->to know svg path
        //must add css class area, you can try to remove it and see the result
        svg.append("g").append("path").attr("class", "area").attr("d", area(dataset));

        var line = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return xScale(d[0]); })
            .y(function (d) { return yScale(d[1]); })

        svg.append("g")
            .data(dataset)
            .append("path")
            .attr("class", "line")
            .attr("d", line(dataset))


        var xAxis = d3.axisBottom(xScale)
            .tickValues([6, 13, 20])
            .tickFormat(d => d % 12 + (d % 12 > 0 ? 'pm' : 'am'))
            .tickSize(50);
        svg.append("g").call(xAxis).attr("id", "bottom-axis").attr("transform", "translate(0," + height / 2 + ")");

        var xAxisTop = d3.axisTop(xScale)
            .tickValues([16])
            .tickFormat("")
            .tickSize(25);
        svg.append("g").call(xAxisTop).attr("id", "sunset-axis").attr("transform", "translate(0," + height / 2 + ")");

        svg
            .append("circle")
            .attr("fill", "#FFE634")
            .attr("cx", xScale(16))
            .attr("cy", yScale(6))
            .attr("r", 8);

        //fill area with gradient color
        svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", yScale(d3.min(dataset, function (d) { return d[0]; })))
            .attr("x2", -10)
            .attr("y2", yScale(d3.max(dataset, function (d) { return d[1]; })))
            .selectAll("stop")
            .data([
                /* {offset: "0%", color: "#edf3f8"},		
                 {offset: "30%", color: "#dbe7f0"},	
                 {offset: "45%", color: "#c9dae9"},		
                 {offset: "55%", color: "#a4c2da"},		
                 {offset: "60%", color: "#b7cee1"},	
                 {offset: "100%", color: "#a2c0d9"}	*/
                { offset: "0%", color: "#dbe7f0" },
                { offset: "50%", color: "#a4c2da" },
                { offset: "100%", color: "#a2c0d9" }

            ])
            .enter().append("stop")
            .attr("offset", function (d) { return d.offset; })
            .attr("stop-color", function (d) { return d.color; });
    }

    render() {
        return (
            <div className="w-100" style={{ minHeight: "15rem" }}>
                <div ref={this.chartRef} className="rowChart"></div>
            </div>
        )
    }
}
