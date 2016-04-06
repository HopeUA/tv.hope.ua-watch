import Logger from 'utils/logger';
import Sync from 'sync';

Logger.info('Создание json данных из гугл таблицы');
Sync().then(() => {
    Logger.info('Готово');
}).catch((error) => {
    Logger.error(error.stack);
});
