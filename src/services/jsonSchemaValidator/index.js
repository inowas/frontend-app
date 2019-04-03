import Ajv from 'ajv';
import jsrp from 'json-schema-ref-parser'

export const validate = (data, schema) => {
    return new Promise((resolve) => {
        if (!schema) {
            const message = 'No schema given for validation';
            console.warn(message);
            resolve([false, message]);
            return;
        }

        const ajv = new Ajv({schemaId: 'auto'});

        jsrp.dereference({'$ref': schema})
            .then(schema => {
                const val = ajv.compile(schema);
                const isValid = val(data);
                const errors = val.errors;
                resolve([isValid, errors]);
            })
            .catch(e => {
                resolve([false, e]);
            });
    });
};