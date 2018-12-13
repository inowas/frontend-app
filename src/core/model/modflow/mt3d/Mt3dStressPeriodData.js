import Mt3dStressPeriodDataSet from './Mt3dStressPeriodDataSet';

class Mt3dStressPeriodData {
    // SET stress_period_data
    // ssm_data[0] = [
    // [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]

    _data = {};

    static fromObject = (obj) => {
        const spData = new Mt3dStressPeriodData();
        const keys = Object.keys(obj);
        keys.forEach((sp) => {
            const spItems = obj[sp];
            spItems.forEach(
                item => spData.addData(sp, Mt3dStressPeriodDataSet.fromArray(item))
            );
        });

        return spData;
    };

    get data() {
        return this._data;
    }

    addData = (stressPeriod, data) => {
        if (!(data instanceof Mt3dStressPeriodDataSet)) {
            throw new Error('Data has to be instance of Mt3dStressPeriodDataSet');
        }

        const sp = parseInt(Number(stressPeriod), 10);

        if (!Array.isArray(this.data[sp])) {
            this._data[sp] = [];
        }

        this._data[sp].push(data);
    };

    get toObject() {
        const response = {};
        Object.keys(this.data).forEach((key) => {
            response[key] = this.data[key].map(
                spItem => spItem.toArray
            );
        });
        return response;
    }

    get toPackageData() {
        return this.toObject;
    }
}

export default Mt3dStressPeriodData;
