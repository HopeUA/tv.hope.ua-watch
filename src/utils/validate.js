const numberPattern = /^\d+$/; // только цифры
const phonePattern = /^380\d{9}$/; // 12 цифр, начинается с 380
const titlePattern = /^[а-яА-Я\-\sїієЇІЄ]+$/; // буквы (укр) дефис и пробел
const providerPattern = /^[a-zA-Zа-яА-Я«»\.\sїієЇІЄ]+$/; // буквы укр и англ, елочки, точка пробел дефис
const websitePattern = /^http[s]?:\/\/[a-z\d\.]+\/$/; // начинается с http:// или https://, заканчивается /, валидный домен


export default function validate(row) {
    const errors = [];

    Object.keys(row).forEach((key) => {
        const value = row[key];

        switch (key) {
            case 'regionid':
                if (row.regiontitle !== '' && !numberPattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'ID области некорректный'
                    });
                }
                break;
            case 'regiontitle':
                if (value !== '' && !titlePattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'В названии области есть недопустимые символы'
                    });
                }
                break;
            case 'regiontitlex':
                if (row.regiontitle !== '' && !numberPattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'Координата должна быть числом'
                    });
                }
                break;
            case 'regiontitley':
                if (row.regiontitle !== '' && !numberPattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'Координата должна быть числом'
                    });
                }
                break;
            case 'city':
                if (row.city !== '' && !titlePattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'В названии города есть недопустимые символы'
                    });
                }
                break;
            case 'providertitle':
                if (row.regiontitle !== '' && row.city !== '' && !providerPattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'В названии оператора есть недопустимые символы'
                    });
                }
                break;
            case 'providerphones':
                value.split('\n').forEach((phone) => {
                    if (row.providertitle !== '' && !phonePattern.test(phone)) {
                        errors.push({
                            title: key,
                            message: 'Номер не корректен'
                        });
                    }
                });
                break;
            case 'providerwebsite':
                if (value !== '' && !websitePattern.test(value)) {
                    errors.push({
                        title: key,
                        message: 'Адрес сайта не корректный'
                    });
                }
                break;

        }
    });

    return errors;
}
