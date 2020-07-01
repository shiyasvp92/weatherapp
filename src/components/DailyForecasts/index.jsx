import React, { Component } from 'react';

import { weatherIcons } from "../../utils/constants";

import './styles.scss';
import { getCurrentWeekday, getCurrentWeatherIcon } from '../../utils/util';

export default class DailyForecasts extends Component {
    render() {
        const { forecast: { dt, temp, weather }, selectedDt } = this.props;

        return (
            <div
                className={("dailyforecasts--card__container ") + (selectedDt === dt ? " active" : "" )}
                onClick={() => this.props.onDailyClick(this.props.forecast)}
            >
                <div className="day font-weight-bold">
                    {getCurrentWeekday(dt).substring(0, 3)}
                </div>
                <div className="weather w-100 d-flex flex-row justify-content-between">
                    <span className="font-weight-bold mr-2 maxTemp">
                        {parseInt(temp.max)}°
                    </span>
                    <span className="minTemp">
                        {parseInt(temp.min)}°
                    </span>
                </div>
                <div className="weather-icon my-1">
                    {
                        weather[0] ?
                            getCurrentWeatherIcon(weather[0].main)
                            :
                            <img src={(weatherIcons['other'])} />
                    }
                </div>
                <div className="description">
                    {weather[0].main}
                </div>
            </div>
        )
    }
}
