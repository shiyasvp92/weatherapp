// location based api services
import { place_autocomplete_api_url } from "../constants";

export function findPlaceAutocomplete(query) {
    return fetch(place_autocomplete_api_url(query))
        .then(data => data.json())
        .then(data => data)
        .catch(error => error)
}
