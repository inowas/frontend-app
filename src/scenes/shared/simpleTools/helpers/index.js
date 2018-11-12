export const getParameterValues = (arr) => {
    const parameters = {};
    arr.forEach(item => {
        parameters[item.id] = item.value
    });

    return parameters;
};

export const deepMerge = (state, fetched) => {
        const fetchedParams = fetched.data.parameters;
        const mergedParams = state.data.parameters.map(
            mergedParam => {
                const fetchedParam = fetchedParams.find(fp => fp.id === mergedParam.id);
                return {...mergedParam, ...fetchedParam}
            }
        );

        return {
            ...state,
            id: fetched.id,
            name: fetched.name,
            description: fetched.description,
            permissions: fetched.permissions,
            public: fetched.public,
            data: {
                ...fetched.data,
                parameters: mergedParams
            }
        };
    }
;

export const buildPayload = (tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    public: tool.public,
    type: tool.type,
    data: {
        ...tool.data,
        parameters: tool.data.parameters.map(p => ({
            id: p.id,
            max: p.max,
            min: p.min,
            value: p.value
        }))
    }
});
