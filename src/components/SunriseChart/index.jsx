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
        const { sunset, sunrise } = this.props;
        const parsedSunrise = getCurrentHours(sunrise);
        const parsedSunset = getCurrentHours(sunset);
        const now = new Date();
        // const currentTime = parseFloat(now.getHours() + '.' + now.getMinutes());
        const currentTime = 15;
        let currentTimeTick = (currentTime * 3.5) > 45 ? 45 : (currentTime * 3.5);
        currentTimeTick = (currentTime < parsedSunrise || currentTime > parsedSunset) ? (-currentTimeTick / 3.5 * 2) : currentTimeTick;
        const currentLight = (currentTime < parsedSunrise || currentTime > parsedSunset) ? "dark" : "light";

        var svg = d3.select(".rowChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")  //add group to leave margin for axis
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var dataset = [[6, -15], [parsedSunrise, 0], [13, 15], [parsedSunset, 0], [20, -15]];
        //set y scale
        var yScale = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset, function (d) { return Math.abs(d[1]); }), - d3.max(dataset, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale = d3.scaleLinear().rangeRound([0, width]).domain([6, d3.max(dataset, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

        console.log(xScale, yScale)
        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x1(function (d) { return xScale(d[0]); })
            .y1(function (d) { return yScale(d[1]); })
            .x0(function (d) { return xScale(d[0]); })
            .y0(yScale(0));

        svg.append("g").append("path").attr("class", "area").attr("d", area(dataset));

        var line = d3.line()
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
            .tickFormat(d => d % 12 + (d / 12 > 1 ? 'pm' : 'am'))
            .tickSize(50);
        svg.append("g").call(xAxis).attr("id", "bottom-axis").attr("transform", "translate(0," + height / 2 + ")");

        var dataset1 = [[6, -15], [parsedSunrise, 0]];

        //set y scale
        var yScale1 = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset1, function (d) { return Math.abs(d[1]); }), - d3.max(dataset1, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale1 = d3.scaleLinear().rangeRound([0, width]).domain([6, d3.max(dataset, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

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

        var dataset2 = [[parsedSunset, 0], [20, -15]];

        //set y scale
        var yScale2 = d3.scaleLinear().rangeRound([0, height]).domain([d3.max(dataset2, function (d) { return Math.abs(d[1]); }), - d3.max(dataset2, function (d) { return Math.abs(d[1]); })]);//show negative
        //add x axis
        var xScale2 = d3.scaleLinear().rangeRound([0, width]).domain([6, d3.max(dataset, function (d) { return d[0]; })]);//scaleBand is used for  bar chart

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

        var xAxisTop = d3.axisTop(xScale)
            .tickValues([currentTime])
            .tickFormat("")
            .tickSize(currentTimeTick);
        svg.append("g").call(xAxisTop).attr("id", "sunset-axis").attr("class", currentLight).attr("transform", "translate(0," + height / 2 + ")");

        // svg
            // .append("circle")
            // .attr("fill", currentLight === "light" ? "#FFE634" : "#CCCCCC")
            // .attr("stroke", currentLight === "light" ? "#F3AF36" : "#CCCCC4")
            // .attr("cx", xScale(currentTime))
            // .attr("cy", yScale(currentTimeTick / 3))
            // .attr("r", 8);

        svg.append("g")
            .attr("id", "sun")
            .attr("style", `transform: scale(0.5) translate(${(xScale(currentTime) - 16) * 2}px, ${yScale(currentTimeTick / 3 + 2) - 16}px)`);

        const sunPath = d3.select("g#sun");

        sunPath.append("circle")
            .attr("fill", currentLight === "light" ? "#FFE634" : "#CCCCCC")
            .attr("stroke", currentLight === "light" ? "#F3AF36" : "#CCCCC4")
            .attr("r", 8);

        // sunPath.append("path")
        //     .attr("d", "M17,31.9727993c0,8.295599,6.7157001,15.0206013,15,15.0206013s15-6.7250023,15-15.0206013 c0-8.2957001-6.7157021-15.0206985-15-15.0206985S17,23.6770992,17,31.9727993z M45,31.9727993 c0,7.1779995-5.8317986,13.0178013-13,13.0178013c-7.1681843,0-13-5.8398018-13-13.0178013 c0-7.1780987,5.8318157-13.0178986,13-13.0178986C39.1682014,18.9549007,45,24.7947006,45,31.9727993z")
        //     .attr("fill", currentLight === "light" ? "#FFE634" : "#CCCCCC")

        sunPath.append("path")
            .attr("d", "M32.7421989,11.7700996c0.5527,0,1-0.4478998,1-1.0014V1.0014c0-0.5535-0.4473-1.0014-1-1.0014 c-0.5527992,0-0.9999981,0.4479-0.9999981,1.0014v9.7672997C31.7422009,11.3221998,32.1893997,11.7700996,32.7421989,11.7700996z")
        sunPath.append("path")
            .attr("d", "M48.6445007,4.6588001C48.1640015,4.3790998,47.5527,4.5443001,47.2783012,5.0235l-4.8838005,8.4578991 c-0.2773018,0.4792004-0.1133003,1.0914001,0.364315,1.3681002c0.1581841,0.0918999,0.3300858,0.1350002,0.5,0.1350002 c0.3456841,0,0.6815834-0.1789999,0.8661842-0.4996996l4.8838158-8.4580002 C49.2860985,5.5476999,49.1221008,4.9355001,48.6445007,4.6588001z")
        sunPath.append("path")
            .attr("d", "M50.7616997,23.0286999c0.1689987,0,0.3408012-0.0429993,0.4990005-0.1340008l8.4580002-4.8835983 c0.4776001-0.2758007,0.6425972-0.8889008,0.3661995-1.3681011c-0.2763023-0.4771996-0.8837013-0.6434994-1.3661995-0.3666992 l-8.4580002,4.8836002c-0.4775009,0.2757988-0.6425018,0.8889999-0.3661995,1.3680992 C50.0790977,22.8488007,50.4160004,23.0286999,50.7616997,23.0286999z")
        sunPath.append("path")
            .attr("d", "M11.7676001,32.7421989c0-0.5533981-0.4473-1.0012989-0.999999-1.0012989H1.0000008c-0.5527,0-1,0.4479008-1,1.0012989 c0,0.5535011,0.4473,1.0014,1,1.0014h9.7676001C11.3203001,33.7435989,11.7676001,33.2957001,11.7676001,32.7421989z")
        sunPath.append("path")
            .attr("d", "M4.2822008,18.0111008L12.7402,22.8946991c0.1582003,0.0910015,0.3291006,0.1340008,0.4990005,0.1340008 c0.3457003,0,0.6827002-0.1798992,0.8671999-0.5007c0.2764149-0.4790993,0.1114149-1.0923004-0.3662004-1.3680992 l-8.4579992-4.8836002c-0.4813852-0.2768002-1.0918002-0.1125011-1.3662002,0.3666992 C3.6396008,17.1222,3.8047006,17.7353001,4.2822008,18.0111008z")
        sunPath.append("path")
            .attr("d", "M20.7411995,14.9844999c0.1699009,0,0.3418007-0.0431004,0.4990005-0.1339998 c0.4785004-0.2777004,0.6426163-0.8899002,0.3661995-1.3681002l-4.8827991-8.4579 c-0.2772999-0.4801998-0.8895998-0.6444001-1.3661995-0.3666997c-0.4785004,0.2776999-0.6425858,0.8898997-0.3662004,1.3680997 l4.8828001,8.4579C20.0596008,14.8055,20.3955002,14.9844999,20.7411995,14.9844999z")
        sunPath.append("path")
            .attr("d", "M32.7421989,52.2318993c-0.5527992,0-0.9999981,0.4478989-0.9999981,1.0014V62.9986 c0,0.5535011,0.4471989,1.0014,0.9999981,1.0014c0.5527,0,1-0.4478989,1-1.0014v-9.7653008 C33.7421989,52.6797981,33.294899,52.2318993,32.7421989,52.2318993z")
        sunPath.append("path")
            .attr("d", "M22.5272999,49.8936996c-0.4813995-0.2795982-1.0907993-0.114399-1.3661995,0.3647995l-4.8838005,8.457901 C16,59.1955986,16.1639996,59.8077011,16.6415997,60.0844994c0.1582165,0.0918999,0.330101,0.1348991,0.5,0.1348991 c0.3457012,0,0.6816006-0.1788979,0.8662167-0.4996986l4.8837833-8.457901 C23.1688995,50.7826004,23.0049,50.1705017,22.5272999,49.8936996z")
        sunPath.append("path")
            .attr("d", "M13.4824009,42.3922005l-8.4580002,4.8837013c-0.4775,0.2756996-0.6425853,0.8888969-0.3662,1.3680992 c0.1846147,0.3206978,0.5215001,0.5006981,0.8671999,0.5006981c0.1689,0,0.3407998-0.0430984,0.4990001-0.1339989 l8.4580002-4.8837013c0.4775-0.2756996,0.6425991-0.8889008,0.3661995-1.3680992 C14.5732002,42.2807007,13.9639006,42.1144981,13.4824009,42.3922005z")
        sunPath.append("path")
            .attr("d", "M63,31.7409h-9.7656021c-0.5527992,0-1,0.4479008-1,1.0012989c0,0.5535011,0.4472008,1.0014,1,1.0014H63 c0.5527,0,1-0.4478989,1-1.0014C64,32.1888008,63.5527,31.7409,63,31.7409z")
        sunPath.append("path")
            .attr("d", "M58.9756012,47.2759018l-8.4580002-4.8837013c-0.4805031-0.2766991-1.0917854-0.1114998-1.3662033,0.3666992 c-0.2763977,0.4791985-0.1113968,1.0923996,0.3662033,1.3680992l8.4580002,4.8837013 c0.1582146,0.0909004,0.3290977,0.1339989,0.4989967,0.1339989c0.3457031,0,0.6826019-0.1800003,0.867218-0.5006981 C59.6181984,48.1647987,59.4530983,47.5516014,58.9756012,47.2759018z")
        sunPath.append("path")
            .attr("d", "M42.8378983,50.2584991c-0.2753983-0.4791985-0.8866997-0.6443977-1.3661995-0.3647995 c-0.4776001,0.2768021-0.6415977,0.8889008-0.3642998,1.3680992l4.8838005,8.457901 c0.1846161,0.3208008,0.5205002,0.4996986,0.8661995,0.4996986c0.169899,0,0.3418007-0.0429993,0.5-0.1348991 c0.4775009-0.2767982,0.6416016-0.8889008,0.3642998-1.3680992L42.8378983,50.2584991z")

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
