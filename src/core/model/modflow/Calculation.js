class Calculation {

    _id = '';
    _state = 0;
    _message = '';
    _files = [];

    static fromQuery(query) {
        const calculation = new Calculation();
        calculation.id = query['calculation_id'];
        calculation.state = query['state'];
        calculation.message = query['message'];
        calculation.files = query['files'];
        return calculation;
    }

    static fromObject(obj) {
        const calculation = new Calculation();
        calculation.id = obj.id;
        calculation.state = obj.state;
        calculation.message = obj.message;
        calculation.files = obj.files;
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

    toObject = () => ({
        id: this.id,
        state: this.state,
        message: this.message,
        files: this.files
    });

}


export default Calculation;
