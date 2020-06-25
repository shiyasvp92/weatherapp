import React, { Component } from 'react'
import './styles.scss';
import pinSvg from "../../assets/images/pin.svg";
import { findLocationWeather } from '../../utils/services/weather';
import { weatherIcons } from '../../utils/constants';
import { getCurrentWeatherIcon } from '../../utils/util';

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
        findLocationWeather(location)
            .then(data => {
                this.setState({
                    locationData: data.list,
                    loadingLocations: false
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loadingLocations: false
                });
            })
    }

    onSelectLocation(location) {
        this.props.onLocationSelect(location);
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
                                            key={location.id}
                                            className="dropdown-item result-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                this.onSelectLocation(location)
                                            }}
                                        >
                                            <div className="result-location">
                                                <span className="font-weight-bold">{location.name}</span>, {location.sys.country}
                                            </div>

                                            <div className="result-weather">
                                                <div className="result-weather--values">
                                                    <div className="result-weather--values_temp">
                                                        {location.main.temp}° C
                                                </div>
                                                    <div className="result-weather--values_description">
                                                        {location.weather[0] && location.weather[0].main}
                                                    </div>
                                                </div>
                                                <div className="result-weather--icon">
                                                    {getCurrentWeatherIcon(location.weather[0] && location.weather[0].main)}
                                                </div>
                                            </div>
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
