class Calculation {

    _id = null;
    _state = 0;

    _message = '';
    _times = null;
    _files = [];
    _layer_values = null;

    static fromQuery(query) {
        const calculation = new Calculation();
        calculation.id = query['id'] || query['calculation_id'] || null;
        calculation.state = query['state'] || null;
        calculation.message = query['message'] || '';
        calculation.files = query['files'] || [];
        calculation.times = query['times'] || null;
        calculation.layer_values = query['layer_values'] || null;
        return calculation;
    }

    static fromObject(obj) {
        const calculation = new Calculation();
        calculation.id = obj.id;
        calculation.state = obj.state;
        calculation.message = obj.message;
        calculation.files = obj.files;
        calculation.times = obj.times;
        calculation.layer_values = obj.layer_values;
        return calculation;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get files() {
        return this._files;
    }

    set files(value) {
        this._files = value;
    }

    get times() {
        return this._times;
    }

    set times(value) {
        this._times = value;
    }

    get layer_values() {
        return this._layer_values;
    }

    set layer_values(value) {
        this._layer_values = value;
    }

    isValid = () => {
        return !!(this.state && this.id);
    };

    toObject = () => ({
        id: this.id,
        state: this.state,
        message: this.message,
        files: this.files,
        times: this.times,
        layer_values: this.layer_values
    });
}

export default Calculation;
