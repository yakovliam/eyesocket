// crago.config.js
// see: https://github.com/sharegate/craco

const path = require("path");
const fs = require("fs");

const rewireTsLoader = require("craco-ts-loader");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    webpack: {
        configure: webpackConfig => {

            // ts-loader is required to reference external typescript projects/files (non-transpiled)
            webpackConfig.module.rules.push({
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                    configFile: 'tsconfig.json',
                },
            })

            return webpackConfig;
        }
    },
    plugins: [
        //This is a craco plugin: https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview
        { plugin: rewireTsLoader,
            options: {
                includes: [resolveApp("node_modules/isemail")], //put things you want to include in array here
                excludes: [/(node_modules|bower_components)/] //things you want to exclude here
                //you can omit include or exclude if you only want to use one option
            }
        },
    ]
}