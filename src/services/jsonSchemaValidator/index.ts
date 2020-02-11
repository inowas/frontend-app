import Ajv from 'ajv';
import jsrp from 'json-schema-ref-parser';

export const validate = (data: any, schema?: any) => {
    return new Promise((resolve) => {
        if (!schema) {
            const message = 'No schema given for validation';
            // tslint:disable-next-line:no-console
            console.warn(message);
            resolve([false, message]);
            return;
        }

        const ajv = new Ajv({schemaId: 'auto'});

        jsrp.dereference({$ref: schema})
            .then((s) => {
                const val = ajv.compile(s);
                const isValid = val(data);
                const errors = val.errors;

                if (!isValid) {
                    // tslint:disable-next-line:no-console
                    console.warn('Invalid ' + data, s, JSON.stringify(errors));
                }

                resolve([isValid, errors]);
            })
            .catch((e) => {
                // tslint:disable-next-line:no-console
                console.log(e);
                resolve([false, e]);
            });
    });
};
