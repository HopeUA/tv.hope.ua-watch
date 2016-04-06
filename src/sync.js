import Logger from 'utils/logger';
import Spreadsheets from 'utils/spreadsheets';
import Fs from 'fs';
import Config from 'config';
import getCityCoords from 'utils/coords';
import Paths from 'data/paths.json';

async function Sync() {
    // 1. Прочитать данные из гугл таблицы
    const rows = await Spreadsheets();
    Logger.info(`Получено ${rows.length} строк из таблицы`);
    
    let regions = [];

    let current;
    let currentRegion = null;
    let currentCity   = null;

    for (let i = 0; i < rows.length; i++) {
        current = rows[i];
        
        // 2. Проверить данные на корректность
        
        
        
        // 3. Сгенерировать массив областей
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
                path: Paths[current.regionid],
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
