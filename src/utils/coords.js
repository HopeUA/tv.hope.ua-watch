import Fetch from 'node-fetch';

async function getCityCoords(address) {
    const geocodeEndpoint = 'http://maps.google.com/maps/api/geocode/json?sensor=false&address=' + encodeURIComponent(address);
    const response = await Fetch(geocodeEndpoint);
    const results = await response.json();

    if (!results.status === 'OK') {
        throw new Error(result);
    }

    return results.results[0].geometry.location;
}

export default getCityCoords;
