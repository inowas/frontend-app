const loadWorker = (file: string) => {
    /* eslint import/no-webpack-loader-syntax:0 */
    // tslint:disable-next-line:no-var-requires variable-name
    // @ts-ignore
    // tslint:disable-next-line:variable-name
    let Wrkr;
    try {
        // tslint:disable-next-line:no-var-requires
        Wrkr = require(`worker-loader!${file}`);
    } catch (e) {
        if (process.env.NODE_ENV !== 'test') {
            throw e;
        }
    }

    return new Wrkr() as Worker;
};

export {
    loadWorker
};
