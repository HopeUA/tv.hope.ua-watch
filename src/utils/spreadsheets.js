import Google from 'googleapis';
import SpreadSheets from 'google-spreadsheets';
import Config from 'config';
import Promise from 'bluebird';

async function getClient() {
    const oauth2Client = new Google.auth.OAuth2(
        Config.get('google.clientId'),
        Config.get('google.clientSecret'),
        ''
    );
    Promise.promisifyAll(oauth2Client);

    oauth2Client.setCredentials(Config.get('google.tokens'));
    const token = await oauth2Client.refreshAccessTokenAsync();
    oauth2Client.setCredentials(token);

    return oauth2Client;
}

export default async function() {
    const client = await getClient();

    const ss = Promise.promisify(SpreadSheets);
    const spreadsheet = await ss({
        key: Config.get('datasheet.key'),
        auth: client
    });
    const worksheet = spreadsheet.worksheets[0];

    Promise.promisifyAll(worksheet);

    let rows = await worksheet.rowsAsync({});
    rows = rows.map((row) => {
        const newRow = {};
        Object.keys(row).forEach((key) => {
            newRow[key] = typeof row[key] === 'string' ? row[key] : '';
        });

        return newRow;
    });

    return rows;
}
