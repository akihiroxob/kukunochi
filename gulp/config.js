var path = require('path');
var relativeSrcPath  = path.relative('.', './web/static/');
console.log(relativeSrcPath)
var jsSrcDir    = './web/static/js/';
var cssSrcDir   = './web/static/css/';
var jsDestDir   = './priv/static/js/';
var cssDestDir  = './priv/static/css/';

module.exports = {
    webpack: {
        entry: jsSrcDir + '/index.js',
        output: {
            filename: 'kukunochi.js',
            publicPath: jsDestDir
        },
        resolve: {
            extenstions: ['jsx', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015']
                    }
                }
            ]
        }
    },
    stylus: {
        src: [ cssSrcDir + '/!(_)*styl' ],
        dest: cssDestDir,
        minify: true
    },
    watch: {
        js:     relativeSrcPath + '/js/**.js',
        styl:   relativeSrcPath + '/stylus/**/*.styl'
    }
};
