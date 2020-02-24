module.exports = function override(config, env) {
    config.output.globalObject = 'this';
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: [
            {loader: 'worker-loader', options: {inline: true}},
            {loader: 'babel-loader'}
        ]
    });
    return config;
};
