import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from "chart.js";

import { weatherIcons } from "../../utils/constants";
import { getCurrentHoursFormatted, getCurrentWeatherIcon, getCurrentHoursOnlyFormatted } from "../../utils/util";

import './styles.scss';
import LoadingSpinner from '../LoadingSpinner';

const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            gridLines: {
                drawBorder: false,
            },
            ticks: {
                callback: function (value, index, values) {
                    return `${value}°`;
                },
                minor: {
                    fontStyle: 'bold'
                }
            }
        }],
        yAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                display: false
            }
        }]
    },
}

const data = {
    datasets: [
        {
            lineTension: 0.3,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: '#3DA8E9',
            borderDashOffset: 0.0,
            pointBorderColor: '#3DA8E9',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#3DA8E9',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 20,
        }
    ]
};

export default class CurrentWeatherCard extends Component {

    constructor(props) {
        super(props);
        this.chartReference = React.createRef();
        this.state = {
            chartData: data,
            chartOptions: options
        }
    }

    componentDidMount() {
        this.initForecastChart();
        this.initSunriseChart();
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.currentWeather.dt == undefined && this.props.currentWeather.dt) || (prevProps.currentWeather.dt !== this.props.currentWeather.dt)) {
            this.initForecastChart();
            this.initSunriseChart();
        }
    }

    initForecastChart() {
        var ctx = document.getElementById('chart')

        if (ctx) {
            ctx = ctx.getContext("2d");
            var gradient = ctx.createLinearGradient(0, 0, 0, 100);
            gradient.addColorStop(0, '#E2F2FE');
            gradient.addColorStop(0.8, '#ffffff0d');
            gradient.addColorStop(1, '#ffffff00');

            this.setState({
                chartData: {
                    ...this.state.chartData,
                    datasets: [
                        {
                            ...this.state.chartData.datasets[0],
                            backgroundColor: gradient,
                        }
                    ]
                }
            }, () => {
                this.renderForecastChartData();
            })
        }
    }

    renderForecastChartData() {
        const { hourlyForecast } = this.props;

        const temperatures = hourlyForecast.map(forecast => forecast.temp);
        const time = hourlyForecast.map(forecast => getCurrentHoursFormatted(forecast.dt))

        this.setState({
            chartData: {
                ...this.state.chartData,
                labels: temperatures,
                datasets: [
                    {
                        ...this.state.chartData.datasets[0],
                        data: temperatures
                    }
                ]
            }
        })
    }

    initSunriseChart() {
        const { hourlyForecast } = this.props;

        const temperatures = hourlyForecast.map(forecast => forecast.temp);
        const time = hourlyForecast.map(forecast => getCurrentHoursOnlyFormatted(forecast.dt))

        const sunriseData = [
            temperatures[time.findIndex(i => i === '6am')],
            temperatures[time.findIndex(i => i === '10am')],
            temperatures[time.findIndex(i => i === '1pm')],
            temperatures[time.findIndex(i => i === '5pm')],
            temperatures[time.findIndex(i => i === '8pm')],
        ];

        const averageTemp = sunriseData.reduce((sum, temp) => sum+temp, 0)/5;

        var ctx = document.getElementById('sunrise-chart')
        if (ctx) {
            ctx = ctx.getContext('2d');

            var gradient = ctx.createLinearGradient(0, 0, 0, 500);
            gradient.addColorStop(0, '#FEE6B8');
            gradient.addColorStop(0.8, '#FFFFFF');
            gradient.addColorStop(1, '#ffffff00');

            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['6am', '', '1pm', '', '8pm'],
                    datasets: [{
                        pointRadius: 0,
                        borderColor: '#cccccc',
                        data: sunriseData,
                        fill: 'blue'
                    },
                    {
                        type: 'line',
                        data: [averageTemp, averageTemp, averageTemp, averageTemp, averageTemp],
                        backgroundColor: 'transparent',
                        pointRadius: 0,
                        backgroundColor: '#666667',
                        borderColor: '#cccccc',
                        borderWidth: 1,
                        order: 1
                    }
                    ]
                },
                options: Chart.helpers.merge({
                    responsive: true,
                    maintainAspectRatio: true,
                    legend: {
                        display: false
                    },
                    scales: {
                    xAxes: [{
                        gridLines: {
                            drawBorder: false,
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            display: false
                        }
                    }]
                },
                })
        });
    }
}

render() {
    const { currentWeather: { temp, weather, pressure, humidity, sunrise, sunset }, loading } = this.props;
    const { chartData, chartOptions } = this.state;

    return (
        <section className="currentweathercard--container">
            {
                !loading ?
                    <>
                        {/* Current weather value and icon */}
                        <section className="currentweather">
                            <span className="value">
                                {temp}°C
                                </span>
                            <span className="icon">
                                {
                                    weather &&
                                    getCurrentWeatherIcon(weather[0].main)
                                }
                            </span>
                        </section>
                        {/* Current weather section ends */}


                        {/* Hourly forecast values */}
                        <section className="hourly-forecast-chart">
                            <div className="chartWrapper">
                                <div className="chartAreaWrapper">
                                    <Line
                                        ref={this.chartReference}
                                        id="chart"
                                        options={chartOptions}
                                        data={chartData}
                                        redraw
                                    />
                                </div>
                            </div>
                        </section>
                        {/* Hourly forecast section ends */}

                        {/* pressure and humidity values */}
                        <section className="pressure-humidity--container">
                            {/* pressure */}
                            <div className="pressure-humidity--box">
                                <div className="pressure-humidity--box_label">
                                    Pressure
                                    </div>
                                <div className="pressure-humidity--box_value">
                                    {pressure} hpa
                                    </div>
                            </div>
                            {/* pressure ends */}

                            {/* humidity */}
                            <div className="pressure-humidity--box">
                                <div className="pressure-humidity--box_label">
                                    Humidity
                                    </div>
                                <div className="pressure-humidity--box_value">
                                    {humidity} %
                                    </div>
                            </div>
                            {/* humidity ends */}
                        </section>
                        {/* pressure and humidity section ends */}

                        {/* sunrise sunset values */}
                        <section className="sunrise-sunset--container">
                            <div className="sunrise-sunset--values">
                                {/* sunrise */}
                                <div className="sunrise value-box">
                                    <div className="value-box_label">
                                        Sunrise
                                        </div>
                                    <div className="value-box_value">
                                        {getCurrentHoursFormatted(sunrise)}
                                    </div>
                                </div>

                                {/* sunset */}
                                <div className="sunset value-box">
                                    <div className="value-box_label">
                                        Sunset
                                        </div>
                                    <div className="value-box_value">
                                        {getCurrentHoursFormatted(sunset)}
                                    </div>
                                </div>
                            </div>

                            {/* sunrise sunset illustration */}
                            <div className="sunrise-sunset--graph w-100">
                                <canvas id="sunrise-chart"></canvas>
                            </div>
                        </section>
                        {/* sunrise sunset section ends */}
                    </>
                    :
                    <LoadingSpinner />
            }
        </section>
    )
}
}
