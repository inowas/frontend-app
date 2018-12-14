class AbstractMt3dPackage {

    constructor(packageName) {
        this._meta = {};
        this.packageName = packageName;
    }

    set packageName(packageName) {
        this.setMetaDataItem('package_name', packageName);
    }

    get packageName() {
        return this.getMetaDataItem('package_name');
    }

    set metaData(metaData) {
        this._meta = metaData;
    }

    metaDataFromObject(obj) {
        if (obj._meta) {
            this.metaData = obj._meta;
        }
    }

    setMetaDataItem(name, value) {
        this._meta[name] = value;
    }

    getMetaDataItem(name) {
        return this._meta[name];
    }

    toObject() {
        return {
            _meta: this._meta
        };
    }
}

export default AbstractMt3dPackage;
