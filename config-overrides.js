module.exports = function override(config, env) {
    config.output.globalObject = 'this';
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: [
            {loader: 'worker-loader'},
            {loader: 'babel-loader'}
        ]
    });
    return config;
};
