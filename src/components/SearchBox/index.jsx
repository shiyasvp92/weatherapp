import React, { Component } from 'react'
import './styles.scss';
import pinSvg from "../../assets/images/pin.svg";
import { findLocationWeather, getLocationWeatherLatLon } from '../../utils/services/weather';
import { weatherIcons } from '../../utils/constants';
import { getCurrentWeatherIcon } from '../../utils/util';
import { findPlaceAutocomplete } from '../../utils/services/places';
import LoadingSpinner from '../LoadingSpinner';

export default class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchMode: false,
            locationData: [],
            loadingLocations: false,
            searchText: ''
        }

        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.onToggleSearch = this.onToggleSearch.bind(this);
        this.onSelectLocation = this.onSelectLocation.bind(this);
        this.wrapperRef = React.createRef();
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
        if (this.wrapperRef.current.contains(e.target)) {
            return;
        }

        if (this.state.searchMode) this.onCloseSearch();
    }

    onSearchTextChange(e) {
        this.setState({
            searchText: e.target.value,
            locationData: [],
            loadingLocations: e.target.value.length > 2 ? true : false
        }, () => {
            if (this.state.searchText.length > 2) this.onSearchLocation(this.state.searchText);
        })
    }

    onCloseSearch() {
        this.setState({
            searchMode: false,
            searchText: ''
        });
    }

    onToggleSearch() {
        this.setState({
            searchMode: !this.state.searchMode
        });
    }

    onSearchLocation(location) {
        let service = new window.google.maps.places.AutocompleteService();
        service.getQueryPredictions({ input: location }, (predictions, status) => {
            if (status == 'OK') {
                const result = predictions.map(place => ({
                    name: place.description,
                    place_id: place.place_id,
                    weather: {
                        loading: true,
                        error: false
                    },
                    latLon: {
                        lat: 0,
                        lon: 0,
                        error: true
                    }
                }))

                this.setState({
                    locationData: result,
                    loadingLocations: false
                }, () => {
                    result.forEach((location, index) => {
                        this.setLocationWeather(location, index)
                    });
                });
            }
        });
    }

    setLocationWeather(location, index) {
        var geocoder = new window.google.maps.Geocoder;
        geocoder.geocode({ 'placeId': location.place_id }, (results, status) => {
            if (status === 'OK') {
                const lat = results[0].geometry.location.lat();
                const lon = results[0].geometry.location.lng();

                getLocationWeatherLatLon(lat, lon)
                    .then((data) => {
                        const weather = {
                            temp: data.main.temp,
                            description: data.weather[0].main,
                            loading: false,
                        };

                        const latLon = {
                            lat,
                            lon,
                            error: false
                        }

                        this.replaceLocationData(weather, latLon, index);
                    });
            } else {
                const weather = {
                    loading: false,
                    error: true
                }

                this.replaceLocationData(weather, { error: true }, index);
            }
        });

    }

    replaceLocationData(weather, latLon, index) {
        const newLocationData = [...this.state.locationData];
        newLocationData[index] = {
            ...newLocationData[index],
            weather,
            latLon
        }

        this.setState({
            locationData: newLocationData
        })
    }

    onSelectLocation(location) {
        if(!location.latLon.error) {
            this.props.onLocationSelect(location);
        }
        this.onCloseSearch();
    }

    render() {
        const { value } = this.props;
        const { searchMode, searchText, locationData, loadingLocations } = this.state;

        return (
            <div className="dropdown searchbox--dropdown" id="resultDropdown" ref={this.wrapperRef}>
                <section className={("w-100 searchbox--container d-flex flex-row justify-content-between align-items-center my-3 " + (searchMode ? " searchmode" : ""))}>
                    <span className="glyphicon glyphicon-map-marker mr-2 ml-2" aria-hidden="true"></span>

                    {
                        !searchMode ?
                            <div
                                onClick={this.onToggleSearch}
                                className="flex-grow-1 searchbox--input px-2"
                                value={value}
                            >
                                {value}
                            </div>
                            :
                            <input
                                autoFocus
                                // onBlur={this.onToggleSearch}
                                onChange={this.onSearchTextChange}
                                className="flex-grow-1 searchbox--input px-2"
                                value={searchText}
                            />
                    }


                    <span className="glyphicon glyphicon-search ml-2 mr-2" aria-hidden="true"></span>
                </section>
                <div className={("dropdown-menu w-100 location-dropdown-menu ") + (searchMode ? " show" : "")} aria-labelledby="dropdownMenuButton">
                    {
                        searchText.length > 0 ? (

                            loadingLocations ?
                                <div className="dropdown-item disabled">
                                    loading
                                </div>
                                :
                                locationData && locationData.length > 0 ?
                                    locationData.map(location => (
                                        <div
                                            key={location.place_id}
                                            className={("dropdown-item result-item ") + (location.latLon.error ? " disabled" : "")}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                this.onSelectLocation(location)
                                            }}
                                        >
                                            <div className="result-location">
                                                {
                                                    location.name &&
                                                        <>
                                                            <span className="font-weight-bold">{searchText}</span><span>{location.name.substring(searchText.length, location.name.length-1)}</span>
                                                        </>
                                                }
                                            </div>

                                            {
                                                !!location.weather.loading ?
                                                    <div>
                                                        <LoadingSpinner />
                                                    </div>
                                                    :
                                                        !location.weather.error ? 
                                                            <div className="result-weather">
                                                                <div className="result-weather--values">
                                                                    <div className="result-weather--values_temp">
                                                                        {location.weather.temp}° C
                                                                </div>
                                                                    <div className="result-weather--values_description">
                                                                        {location.weather.description}
                                                                    </div>
                                                                </div>
                                                                <div className="result-weather--icon">
                                                                    {getCurrentWeatherIcon(location.weather.description)}
                                                                </div>
                                                            </div>
                                                        :
                                                            <div>
                                                                Error
                                                            </div>
                                            }
                                        </div>
                                    ))
                                    :
                                    <div className="dropdown-item disabled">
                                        {
                                            loadingLocations ?
                                                'loading'
                                                :
                                                'No result'
                                        }
                                    </div>
                        )
                            :
                            <div className="dropdown-item disabled">
                                Search a city
                            </div>
                    }
                </div>
            </div >
        )
    }
}
