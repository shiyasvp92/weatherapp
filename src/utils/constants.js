export const GOOGLE_MAP_KEY = 'AIzaSyCNBxbshhBNofDZYP8Ajt4ols9wYKTPFjc';
export const OPENWEATHER_API_KEY = 'ce963b27a00431c1cddad8a9f20821e3';

export const weatherIcons = {
    'sunny': require(`../assets/images/sunny.png`),
    'clouds': require(`../assets/images/clouds.png`),
    'haze' : require(`../assets/images/haze.png`),
    'mist' : require(`../assets/images/mist.png`),
    'rain' : require(`../assets/images/rain.png`),
    'snow' : require(`../assets/images/snow.png`),
    'wind' : require(`../assets/images/wind.png`),
    'other' : require(`../assets/images/other.png`)
}

export const onecall_weather_api_url = (lat, lon) => {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
} 

export const find_location_weather_api_url = (searchQuery) => {
    return `https://api.openweathermap.org/data/2.5/find?q=${searchQuery}&appid=${OPENWEATHER_API_KEY}&units=metric`
}

export const get_location_weather_api_url = (query) => {
    return `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${OPENWEATHER_API_KEY}&units=metric`;
}

export const get_location_weather_on_lat_lon_api_url = (lat, lon) => {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
}

export const place_autocomplete_api_url = (query) => {
    return `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_MAP_KEY}&types=geocode`;
}
