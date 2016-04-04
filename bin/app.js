import Logger from 'utils/logger';
import Sync from 'sync';

Sync().then(() => {
    Logger.info('Done');
}).catch((error) => {
    Logger.error(error.stack);
});
