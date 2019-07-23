interface IPropertyValueObject {
    [name: string]: any;
}

export default class FlopyModflowSerializable {

    public static fromObject(obj: IPropertyValueObject) {
        const self: IPropertyValueObject = new this();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                self[key] = obj[key];
            }
        }
        return self;
    }

    public toObject() {
        const obj: IPropertyValueObject = {};
        for (const prop in this) {
            if (this.hasOwnProperty(prop) && prop.startsWith('_')) {
                const rProp = prop.substr(1);
                obj[rProp] = this[prop];
            }
        }

        return obj;
    }
}
