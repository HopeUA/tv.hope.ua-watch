import Logger from 'utils/logger';
import Spreadsheets from 'utils/spreadsheets';
import Fs from 'fs';
import Config from 'config';
import City from 'utils/city';
import Paths from 'data/paths.json';
import validate from 'utils/validate';

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
        const validateErrors = validate(current);
        if (validateErrors.length > 0) {
            validateErrors.forEach((error) => {
                Logger.error(`[строка ${i + 2}, ${error.title}] ${error.message}`);
            });
        }

        // 3. Сгенерировать массив областей
        if (current.regionid !== '') {
            currentRegion = {
                id: parseInt(current.regionid),
                title: {
                    text: current.regiontitle,
                    pos: {
                        x: parseInt(current.regiontitlex),
                        y: parseInt(current.regiontitley)
                    }
                },
                path: Paths[current.regionid],
                cities: []
            };
            regions.push(currentRegion);
        }

        if (current.city !== '') {
            currentCity = {
                id: await City.getId(current.city),
                title: current.city,
                pos: await City.getCoords(current.city + ',' + currentRegion.title.text + ' область,Україна'),
                providers: []
            };
            currentRegion.cities.push(currentCity);
        }

        if (current.providertitle !== '') {
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
