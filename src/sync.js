import Logger from 'utils/logger';
import Spreadsheets from 'utils/spreadsheets';
import Util from 'util';
import Fs from 'fs';
import Config from 'config';
import getCityCoords from 'utils/coords';

async function Sync() {
    // 1. Прочитать данные из гугл таблицы
    const rows = await Spreadsheets();

    // 2. Проверить данные на корректность
    // 3. Сгенерировать массив областей
    let regions = [];

    let current;
    let currentRegion = null;
    let currentCity   = null;

    for (let i = 0; i < rows.length; i++) {
        current = rows[i];

        if (typeof current.regionid === 'string') {
            currentRegion = {
                id: current.regionid,
                title: {
                    text: current.regiontitle,
                    pos: {
                        x: current.regiontitlex,
                        y: current.regiontitley
                    }
                },
                cities: []
            };
            regions.push(currentRegion);
        }

        if (typeof current.cityid === 'string') {
            currentCity = {
                id: current.cityid,
                title: current.citytitle,
                pos: await getCityCoords(current.citytitle + ',' + currentRegion.title.text + ' область,Україна'),
                providers: []
            };
            currentRegion.cities.push(currentCity);
        }

        if (typeof current.providertitle === 'string') {
            currentCity.providers.push({
                id: currentCity.id + '-' + (currentCity.providers.length + 1),
                title: current.providertitle,
                phones: current.providerphones.split('\n'),
                website: typeof current.providerwebsite === 'string' ? current.providerwebsite : undefined
            });
        }
    }

    // 4. Записать в файл json
    Fs.writeFile(Config.get('json'), JSON.stringify(regions, null, 2));
}

export default Sync;
