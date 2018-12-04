class Geometry {

    _geometry;

    static fromGeoJson(geoJson) {
        if (geoJson.geometry) {
            return new Geometry(geoJson.geometry);
        }

        return new Geometry(geoJson);
    }

    static fromObject(obj) {
        return new Geometry(obj);
    }

    constructor(geometry) {
        this._geometry = geometry;
    }

    get type() {
        return this._geometry.type;
    }

    fromType(type) {
        return (type.toLowerCase() === this.type.toLowerCase());
    }

    get coordinates() {
        return this._geometry.coordinates;
    }

    toObject = () => (this._geometry);

    toGeoJSON = () => (this._geometry);
}

export default Geometry;
