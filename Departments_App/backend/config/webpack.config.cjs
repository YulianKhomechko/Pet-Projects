const path = require('path');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '..', 'dist')
    },
    externals: ['pg', 'pg-hstore'],

    experiments: {
        topLevelAwait: true
    },

    resolve: {
        fallback: {
            http: require.resolve('stream-http'),
            util: require.resolve('util/'),
            crypto: require.resolve('crypto-browserify'),
            timers: require.resolve('timers-browserify'),
            process: false,
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            buffer: require.resolve('buffer/'),
            assert: require.resolve('assert/'),
            url: require.resolve('url/')
        },
        extensions: ['.ts', '.js', '.cjs'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
            '.cjs': ['.cjs', '.cts'],
            '.mjs': ['.mjs', '.mts']
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                include: [path.resolve(__dirname, '..', 'src')]
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ]
    }
};
