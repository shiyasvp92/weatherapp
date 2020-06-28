import { onecall_weather_api_url, find_location_weather_api_url, get_location_weather_api_url, get_location_weather_on_lat_lon_api_url } from "../constants";

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

export function getLocationWeather(location) {
    return fetch(get_location_weather_api_url(location))
        .then(data => data.json())
        .then(data => data)
        .catch(error => error)
}

export function getLocationWeatherLatLon(latitude, longitude) {
    return fetch(get_location_weather_on_lat_lon_api_url(latitude, longitude))
        .then(data => data.json())
        .then(data => data)
        .catch(error => error)
}