import moment from 'moment';

const intlNumberFormatter = new Intl.NumberFormat([], {minimumFractionDigits: 2, maximumFractionDigits: 5});

export function toDate(date) {
    if (!date) {
        return 'n/a';
    }
    return moment.utc(date).format('YYYY-MM-DD');
}

export function toNumber(number) {
    return intlNumberFormatter.format(number);
}

export const dateToAtomFormat = (date) => moment.utc(date).format('YYYY-MM-DD[T]00:00:00+00:00');
export const dateToYmd = (date) => moment.utc(date).format('YYYY-MM-DD');
export const dateToTime = (date) => moment.utc(date).format('HH:mm');
export const dateToDate = (date) => moment.utc(date).format('MM/DD/YYYY');
export const dateToDateIgnoreTimeZones = (date) => moment.utc(moment(date).format('YYYY-MM-DD')).format('YYYY-MM-DD');
export const dateToDatetime = (date) => moment.utc(date).format('MM/DD/YYYY HH:mm');
export const removeThousandsSeparatorFromString = (string) => string.replace(/,/g, '');

export const dateImportFromCSV = (dateString) => moment.utc(moment(dateString).format('YYYY-MM-DD')).toISOString();
