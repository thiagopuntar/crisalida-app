import { date } from 'quasar';

export const dateBuilder = (date) => {
    if (!date) {
        return null;
    }
    
    const dtArr = date.split('/');
    const day = dtArr[0];
    const month = parseInt(dtArr[1]) - 1;
    const year = dtArr[2];

    return new Date(year, month, day);
}
