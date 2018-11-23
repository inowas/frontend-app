import Ajv from 'ajv';
import ajv0 from 'ajv/lib/refs/json-schema-draft-04';

export const getValidator = () => {
    const ajv = new Ajv({schemaId: 'id'});
    ajv.addMetaSchema(ajv0);
    return ajv;
};
