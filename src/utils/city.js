import Fetch from 'node-fetch';
import Parser from 'csv-parse';
import Promise from 'bluebird';
import Fs from 'fs';

export default class City {
    static async getCoords(address) {
        const geocodeEndpoint = 'http://maps.google.com/maps/api/geocode/json?sensor=false&address=' + encodeURIComponent(address);
        const response = await Fetch(geocodeEndpoint);
        const results = await response.json();

        if (!results.status === 'OK') {
            throw new Error(result);
        }

        return results.results[0].geometry.location;
    }

    static async getId(title) {
        let data = Fs.readFileSync('src/data/koatuu122015.csv');
        const parser = Promise.promisify(Parser);
        const ids = await parser(data, {columns: true});

        data = undefined;
        var cityUp = title.toUpperCase();
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].NU == cityUp) {
                return parseInt(ids[i].TE);
            }
        }
    }
}
