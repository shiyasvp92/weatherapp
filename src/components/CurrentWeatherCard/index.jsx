import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import { weatherIcons } from "../../utils/constants";
import { getCurrentHoursFormatted, getCurrentWeatherIcon } from "../../utils/util";

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
            borderDash: [],
            borderDashOffset: 0.0,
            pointBorderColor: '#3DA8E9',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#3DA8E9',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 20,
            data: [21, 22, 24, 25, 29, 28, 29]
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
        this.initChart();
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.currentWeather.dt == undefined && this.props.currentWeather.dt) || (prevProps.currentWeather.dt !== this.props.currentWeather.dt)) {
            this.initChart();
        }
    }

    initChart() {
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
                this.renderChartData();
            })
        }
    }

    renderChartData() {
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

    render() {
        const { currentWeather : { temp, weather, pressure, humidity, sunrise, sunset }, loading } = this.props;
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
