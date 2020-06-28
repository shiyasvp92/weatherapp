import React from "react";
import { GOOGLE_MAP_KEY, OPENWEATHER_API_KEY, weatherIcons } from "./constants";

export function ipLookUp() {
    return fetch('http://ip-api.com/json')
        .then((data) => data.json())
        .then(async response => {
            const geoAdd = await getAddress(response.lat, response.lon).then((locn) => locn)
            return {
                ipLocation: response,
                geoAddress: geoAdd
            }
        })
        .catch(error => {
            console.error(error);
        })
}

function getAddress(latitude, longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_KEY}`;

    return fetch(url)
        .then((data) => data.json())
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
        })
}

export function getLocationData() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function success(position) {
                const locn = getAddress(position.coords.latitude, position.coords.longitude);
                locn.then((data) => console.log(data));
            },
            function error(error_message) {
                console.error('An error has occured while retrieving location', error_message);
                ipLookUp();
            })
    } else {
        console.log('geolocation is not enabled on this browser')
        ipLookUp()
    }
}

export function getAllWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;

    return fetch(url)
        .then(data => data.json())
        .then(data => data)
        .catch(error => {
            console.error(error)
        })
}

export function formatTS(timestamp) {
    let newDate = new Date();
    const weekday = timestamp * 1000
    newDate.setTime(weekday);

    return newDate;
}

export function getCurrentWeekday(timestamp) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return days[formatTS(timestamp).getDay()];
}

export function getCurrentHoursFormatted(timestamp) {
    let hours = formatTS(timestamp).getHours();
    let minutes = formatTS(timestamp).getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + '' + ampm;
}

export function getCurrentHoursOnlyFormatted(timestamp) {
    let hours = formatTS(timestamp).getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ampm;
}

export function getCurrentHours(timestamp) {
    let hours = formatTS(timestamp).getHours();
    let minutes = formatTS(timestamp).getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return parseFloat(hours + '.' + minutes);
}

export function getCurrentWeatherIcon(weather) {
    return <img src={(weatherIcons[weather.toLowerCase()] || weatherIcons['other'])} />
}