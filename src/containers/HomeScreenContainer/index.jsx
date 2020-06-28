import React, { Component } from 'react';
import './styles.scss';

import { ipLookUp, getLocationData } from "../../utils/util";
import SearchBox from '../../components/SearchBox';
import DailyForecasts from '../../components/DailyForecasts';
import CurrentWeatherCard from '../../components/CurrentWeatherCard';
import { getWeatherForecast } from '../../utils/services/weather';
import LoadingSpinner from '../../components/LoadingSpinner';

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
            selectedDt: null
        }
    }

    componentDidMount() {
        this.setState({
            loadingLocation: true
        });

        getLocationData();

        ipLookUp()
            .then(data => {
                if(data) {
                    const location = data.geoAddress.results.find(address => address.types.includes("political"));
    
                    this.setState({
                        currentLocation: location.formatted_address,
                        loadingLocation: false,
                        loadingWeather: true,
                        currentLatLon: {
                            lat: data.ipLocation.lat,
                            lon: data.ipLocation.lon
                        }
                    }, () => {
                        this.onFetchForecast(data.ipLocation.lat, data.ipLocation.lon);
                    })
                }
            });
    }

    onLocationSelect(location) {
        this.setState({
            currentLocation: location.name,
            currentLatLon: {
                ...location.latLon
            }
        })
        this.onFetchForecast(location.latLon.lat, location.latLon.lon);
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
                    selectedDt: data.daily[0].dt,
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

    onDailyForecastClick(forecast) {
        this.setState({
            selectedDt: forecast.dt,
            currentWeather: {
                ...forecast,
                temp: forecast.temp.day,
                feels_like: forecast.feels_like.day
            }
        })
    }

    render() {
        const { dailyForecast, hourlyForecast, currentWeather, loadingWeather, loadingLocation } = this.state;
        const { currentLocation, selectedDt } = this.state;

        return (
            <div className="home-screen__container container">
                {/* Location search box */}
                <SearchBox
                    value={currentLocation}
                    onLocationSelect={(location) => this.onLocationSelect(location)}
                />

                {/* Daily forecast list */}
                <section className="dailyforecasts--container d-flex flex-row my-4 px-2 py-2">
                    {
                        !!loadingWeather ?
                            <LoadingSpinner />
                            :
                            dailyForecast.map(forecast => (
                                <DailyForecasts
                                    key={forecast.dt}
                                    forecast={forecast}
                                    loading={loadingWeather}
                                    selectedDt={selectedDt}
                                    onDailyClick={(forecast) => this.onDailyForecastClick(forecast)}
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
