import { onecall_weather_api_url, find_location_weather_api_url } from "../constants";

export function getWeatherForecast(latitude, longitude) {
    return fetch(onecall_weather_api_url(latitude, longitude))
        .then(data => data.json())
        .then(data => data)
        .catch(error => error)
}

export function findLocationWeather(location) {
    return fetch(find_location_weather_api_url(location))
        .then(data => data.json())
        .then(data => data)
        .catch(error => error)
}