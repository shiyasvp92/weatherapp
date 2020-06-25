import React, { Component } from 'react';
import './styles.scss';

import { ipLookUp, getLocationData } from "../../utils/util";
import SearchBox from '../../components/SearchBox';
import DailyForecasts from '../../components/DailyForecasts';
import CurrentWeatherCard from '../../components/CurrentWeatherCard';
import { getWeatherForecast } from '../../utils/services/weather';
import LoadingSpinner from '../../components/LoadingSpinner';

const forecasts = [
    {
        day: 'Friday',
        maxTemp: 28,
        minTemp: 21,
        weatherCondition: 'Sunny',
        id: 0
    },
    {
        day: 'Saturday',
        maxTemp: 32,
        minTemp: 30,
        weatherCondition: 'Sunny',
        id: 1
    },
    {
        day: 'Sunday',
        maxTemp: 21,
        minTemp: 29,
        weatherCondition: 'Clouds',
        id: 2
    },
    {
        day: 'Monday',
        maxTemp: 18,
        minTemp: 31,
        weatherCondition: 'Clouds',
        id: 3
    },
    {
        day: 'Tuesday',
        maxTemp: 28,
        minTemp: 21,
        weatherCondition: 'Rain',
        id: 4
    },
    {
        day: 'Wednesday',
        maxTemp: 28,
        minTemp: 21,
        weatherCondition: 'Mist',
        id: 5
    },
    {
        day: 'Thursday',
        maxTemp: 28,
        minTemp: 21,
        weatherCondition: 'Rain',
        id: 6
    }
]

export default class HomeScreenContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentLocation: null,
            loadingLocation: false,
            loadingWeather: true,
            currentWeather: {},
            dailyForecast: [],
            hourlyForecast: [],
        }
    }

    componentDidMount() {
        this.setState({
            loadingLocation: true
        });

        ipLookUp()
            .then(data => {
                const location = data.geoAddress.results.find(address => address.types.includes("political"));
                console.log(data.ipLocation);

                this.setState({
                    currentLocation: location.formatted_address,
                    loadingLocation: false,
                    loadingWeather: true
                }, () => {
                    this.onFetchForecast(data.ipLocation.lat, data.ipLocation.lon);
                })
            });
    }

    onLocationSelect(location) {
        this.setState({
            currentLocation: location.name + ', ' + location.sys.country
        })
        this.onFetchForecast(location.coord.lat, location.coord.lon);
    }

    onFetchForecast(lat, lon) {
        this.setState({
            loadingLocation: false,
            loadingWeather: true
        })

        getWeatherForecast(lat, lon)
            .then((data) => {
                this.setState({
                    currentWeather: data.current,
                    dailyForecast: data.daily,
                    hourlyForecast: data.hourly,
                    loadingWeather: false
                })
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    loadingLocation: false,
                    loadingWeather: false
                });
            });
    }

    render() {
        const { dailyForecast, hourlyForecast, currentWeather, loadingWeather, loadingLocation } = this.state;
        const { currentLocation } = this.state;

        return (
            <div className="home-screen__container container">
                {/* Location search box */}
                <SearchBox
                    value={currentLocation}
                    onLocationSelect={(location) => this.onLocationSelect(location)}
                />

                {/* Daily forecast list */}
                <section className="dailyforecasts--container d-flex flex-row my-3 px-2 py-2">
                    {
                        !!loadingWeather ?
                            <LoadingSpinner />
                            :
                            dailyForecast.map(forecast => (
                                <DailyForecasts
                                    key={forecast.dt}
                                    forecast={forecast}
                                    loading={loadingWeather}
                                />
                            ))
                    }
                </section>

                {/* Current weather details card */}
                <CurrentWeatherCard
                    loading={loadingWeather}
                    currentWeather={currentWeather}
                    hourlyForecast={hourlyForecast}
                />
            </div>
        )
    }
}
