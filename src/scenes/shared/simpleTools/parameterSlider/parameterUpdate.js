function validateAndSetNewProperty(param, newParam, property, validator) {
    // check if both parameters have this property
    if(param.hasOwnProperty(property) && newParam.hasOwnProperty(property)) {
        const newValue = Number(newParam[property]);
        // check if parameter has a validator for this property
        if(param.hasOwnProperty(validator)) {
            // use validator
            if(param[validator](newValue)) {
                // valid
                param[property] = newValue;
            } // not valid
        } else {
            // no validator
            param[property] = newValue;
        }
    }
    return param;
}

export default function parameterUpdate(oldParam, newParam) {
    let param = validateAndSetNewProperty(oldParam, newParam, 'min', 'validMin');
    param = validateAndSetNewProperty(param, newParam, 'max', 'validMax');

    // make sure min <= max
    if (param.hasOwnProperty('min') && newParam.hasOwnProperty('max') && param.max < param.min) {
        param.max = param.min;
    }

    // make sure min <= value <= max
    if (param.hasOwnProperty('value') && newParam.hasOwnProperty('value')) {
        const newValue = Number(newParam.value);
        param.value = newValue;
        // let valid = true;

        if (param.hasOwnProperty('min') && newValue < param.min) {
            param.min = newValue;
        }

        if (param.hasOwnProperty('max') && newValue > param.max) {
            param.max = newValue;
        }
    }

    return param;
}
