import React, { Component } from 'react';
import * as d3 from 'd3';

import { getCurrentHours } from "../../utils/util";

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

        var svg = d3.select(".rowChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")  //add group to leave margin for axis
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var dataset = [[6, -15], [9.5, 0], [13, 15], [16.5, 0], [20, -15]];
        //set y scale
        var yScale = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset, function (d) { return Math.abs(d[1]); }), - d3.max(dataset, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale = d3.scaleLinear().rangeRound([0, width]).domain([6, d3.max(dataset, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x1(function (d) { return xScale(d[0]); })
            .y1(function (d) { return yScale(d[1]); })
            .x0(function (d) { return xScale(d[0]); })
            .y0(yScale(0));

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

        console.log(getCurrentHours(this.props.sunset));

        var xAxisTop = d3.axisTop(xScale)
            .tickValues([getCurrentHours(this.props.sunset) - 4])
            .tickFormat("")
            .tickSize(getCurrentHours(this.props.sunset));
        svg.append("g").call(xAxisTop).attr("id", "sunset-axis").attr("transform", "translate(0," + height / 2 + ")");

        svg
            .append("circle")
            .attr("fill", "#FFE634")
            .attr("stroke", "#F3AF36")
            .attr("cx", xScale(getCurrentHours(this.props.sunset) - 4))
            .attr("cy", yScale(getCurrentHours(this.props.sunset) / 2))
            .attr("r", 8);

        var dataset1 = [[6, -15], [9.5, 0]];

        //set y scale
        var yScale1 = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset1, function (d) { return Math.abs(d[1]); }), - d3.max(dataset1, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale1 = d3.scaleLinear().rangeRound([0, width / 4]).domain([6, d3.max(dataset1, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

        var area1 = d3.area()
            .curve(d3.curveMonotoneX)
            .x1(function (d) { return xScale1(d[0]); })
            .y1(function (d) { return yScale1(d[1]); })
            .x0(function (d) { return xScale1(d[0]); })
            .y0(yScale1(0));

        svg.append("g").append("path").attr("class", "area2").attr("d", area1(dataset1));

        var line = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return xScale1(d[0]); })
            .y(function (d) { return yScale1(d[1]); })

        svg.append("g")
            .data(dataset1)
            .append("path")
            .attr("class", "line2")
            .attr("d", line(dataset1))

        var dataset2 = [[16.5, 0], [20, -15]];

        //set y scale
        var yScale2 = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset2, function (d) { return Math.abs(d[1]); }), - d3.max(dataset2, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale2 = d3.scaleLinear().rangeRound([0, width]).domain([6, d3.max(dataset2, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

        var area1 = d3.area()
            .curve(d3.curveMonotoneX)
            .x1(function (d) { return xScale2(d[0]); })
            .y1(function (d) { return yScale2(d[1]); })
            .x0(function (d) { return xScale2(d[0]); })
            .y0(yScale2(0));

        svg.append("g").append("path").attr("class", "area2").attr("d", area1(dataset2));

        var line = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return xScale2(d[0]); })
            .y(function (d) { return yScale2(d[1]); })

        svg.append("g")
            .data(dataset2)
            .append("path")
            .attr("class", "line2")
            .attr("d", line(dataset2));

        //fill area with gradient color
        svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", yScale(d3.min(dataset, function (d) { return d[0]; })))
            .attr("x2", 5)
            .attr("y2", yScale(d3.max(dataset, function (d) { return d[1]; })))
            .selectAll("stop")
            .data([
                { offset: "0%", color: "#ffffff" },
                { offset: "70%", color: "#FEF1D0" },
                { offset: "100%", color: "#FEE7BA" }
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
