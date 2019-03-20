import Ajv from 'ajv';
import ajv0 from 'ajv/lib/refs/json-schema-draft-04';
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

        // THE WAY WITH URLs
        if (schema.indexOf('https://') === 0) {
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
            return;
        }

        // THE OLD WAY
        ajv.addMetaSchema(ajv0);
        const val = ajv.compile(this.schema);
        const isValid = val(this.payload);
        const errors = val.errors;

        resolve([isValid, errors]);
    });
};