const DEBUG = "debug";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var gulpif = require("gulp-if");
var newer = require('gulp-newer');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var tslint = require("gulp-tslint");
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssSvg = require('gulp-css-svg');
var htmlreplace = require('gulp-html-replace');
var preprocess = require('gulp-preprocess');
var minifyCss = require('gulp-clean-css');
var minifyHtml = require('gulp-htmlmin');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var stream = require('merge-stream')();
var browsersync = require('browser-sync');
var header = require('gulp-header');
var log = require("fancy-log");
var colors = require('ansi-colors');
var del = require('del');

var argv = require("minimist")(process.argv.slice(2), {
    string: ["env", "version"],
    alias: {
        "version": ["ver", "v"]
    },
    default: {
        env: 'release',
        name: process.env.npm_package_name || "<undefined>",
        displayName: process.env.npm_package_displayName || "<undefined>",
        description: process.env.npm_package_description || "",
        homepage: process.env.npm_package_homepage || "",
        license: process.env.npm_package_license || "private",
        version: process.env.npm_package_version || "<undefined>",
        author: (process.env.npm_package_author || "Trond Aarskog").replace("<alphahere>", "")
    }
});

console.info(`---\n${argv.name} v${argv.version} ${argv.env}\n---`)

// Define dependencies and url to their licenses
var libraries = [
    { name: "adal-angular", licenseUrl: "{{github}}/LICENSE.txt" },
    { name: "powerbi-client", licenseUrl: "{{github}}/LICENSE.txt" },
    { name: "handlebars", licenseUrl: "{{github}}/LICENSE" },
    { name: "clipboard", licenseUrl: "https://zenorocha.mit-license.org/" }
]

var config = {
    isDebug: argv.env === DEBUG,
    isRelease: argv.env !== DEBUG,

    name: argv.name,
    displayName: argv.displayName,
    description: argv.description,
    version: argv.version,
    author: argv.author,
    homepage: argv.homepage,
    libraries: (() => { 
        let result = []
        libraries.forEach(lib => {
            // As preprocess cannot handle an object in a foreach loop we need to build the html string describing
            // libraries used and links to their homepages and licenses.
            pkg = require(`./node_modules/${lib.name}/package.json`);
            result.push(
                [
                    `<a href="${pkg.homepage}">${pkg.name} v${pkg.version}</a> `,
                    `(<a href='${lib.licenseUrl.replace("{{github}}", pkg.repository.url.replace("git+", "").replace(".git", "") + "/blob/" + pkg.gitHead)}'>${pkg.license}</a>)`,
                ].join('\n')

                // The following to be used if/when preprocess starts to support objects or json
                // {
                // license: pkg.license,
                // name: pkg.name,
                // description: pkg.description,
                // homepage: pkg.homepage,
                // licenseUrl: pkg.repository.url,
                // version: pkg.version,
                // licenseUrl: lib.licenseUrl.replace("{{github}}", pkg.repository.url.replace("git+", "").replace(".git", "") + "/blob/" + pkg.gitHead)
                // }
            );
        });
        return result;
    })().toString(),
    banner: [
        '/*!',
        ` * ${argv.name} - ${argv.description}`,
        ` * @version v${argv.version}`,
        ` * @author v${argv.author}`,
        ` * @link ${argv.homepage}`,
        ` * @license ${argv.license}`,
        ' */',
        ''].join('\n')
}

var paths = {
    clean: {
        all: ['./dist/', './test/results/', './npm-debug.log.*']
    },

    browserSync: {
        baseDir: './dist/powerbi/',
        watch: ['./dist/powerbi/**/*.*'],
    },

    js: {
        src: ['./src/**/*.js'],
        dest: './dist/powerbi/scripts/'
    },

    ts: {
        baseDir: '.',
        entries: {
            // key   = name of typescript entry file
            // value = name of the bundled file
            './src/viewer.ts': 'viewer.js',
            './src/admin.ts': 'admin.js',
            //'./src/sample.ts': 'sample.js',
        },
        destDir: './dist/powerbi/scripts/',
        watch: ['./src/**/*.ts'],
    },

    pages: {
        src: ['./src/**/*.html'],
        dest: './dist/powerbi/'
    },

    styles: {
        // Specifying files to get this specific order (no asterix)
        src: ['./src/viewer.scss', './src/admin.scss'],
        dest: './dist/powerbi/'
    }
};

var options = {
    browserify: {
        basedir: paths.ts.baseDir,
        debug: config.isDebug,
        cache: {},
        packageCache: {}
    },

    babelify: {
        presets: ['@babel/preset-env'],
        extensions: ['.ts']
    },

    // For options see https://github.com/kangax/html-minifier
    minifyHtml: {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
    },

    browserSync: {
        server: {
            baseDir: paths.browserSync.baseDir,
            routes: {
                "/dev": "./test/dev"
            },
            index: "viewer.html",
            https: false
        },

        middleware: [
            {
                route: "/scripts/config.js",
                handle: function (req, res, next) {
                    const filename = 'userappconfig.js';
                    let fs = require('fs');
                    if (fs.existsSync(filename)) {
                        res.setHeader('Content-Type', 'text/javascript');
                        res.end(fs.readFileSync(filename).toString());
                    } else {
                        console.warn("You should create a custom config with at least a valid client id as '" + filename + "' in the project root folder.");
                        next();
                    }
                }
            }
        ],

        //port: 80,
        host: 'localtest.me',

        files: paths.browserSync.watch,
        browser: [], // ["chrome", "iexplore"],
        plugins: [
            {
                module: "bs-html-injector",
                options: {
                    files: [paths.browserSync.baseDir + "*.html"]
                }
            }
        ]
    }
}

////////////////////////////////

gulp.task("clean", function (cb) {
    return del(paths.clean.all);
});

gulp.task("analytics:lint", function () {
    return gulp.src(['./src/**/*.ts'])
        .pipe(tslint({formatter: "stylish"}))
        .pipe(tslint.report({
            emitError: config.isRelease ? true : false,
            allowWarnings: true,
            summarizeFailureOutput: true
        }));
});

gulp.task("build:typescript", gulp.series("analytics:lint", function (cb) {
    var tasks = Object.keys(paths.ts.entries).map(function(entry) {
        // Create a clone of the options (may not be required but haven't checked consequence of re-using object in multi-calls)
        let opts = JSON.parse(JSON.stringify(options.browserify));
        opts.entries = entry;
        return browserify(opts)
            .plugin(tsify)
            .transform('babelify', options.babelify)
            .bundle()
            .pipe(plumber(errorHandler()))
            // TODO: Check out watchify OR browserify-incremental
            .pipe(source(paths.ts.entries[entry]))
            .pipe(buffer())
            .pipe(preprocess({ context: config }))
            .pipe(gulpif(config.isDebug, sourcemaps.init({ loadMaps: true })))
            .pipe(gulpif(config.isRelease, uglify()))
            .pipe(header(config.banner))
            .pipe(gulpif(config.isDebug, sourcemaps.write('./')))
            .pipe(gulp.dest(paths.ts.destDir));
        });

    stream.add(tasks);
    return stream;
}));

gulp.task("build:javascript", function () {
    // Javascript is in there for manual config in production - thus no compile / minifaction is relevant
    return gulp.src(paths.js.src)
        .pipe(newer(paths.js.dest))
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task("build:pages", function () {
    return gulp.src(paths.pages.src)
        .pipe(plumber(errorHandler()))
        //.pipe(newer(paths.pages.dest))
        .pipe(preprocess({ context: config }))
        .pipe(htmlreplace({
            cssInline: {
                src: gulp.src(paths.styles.src)
                    .pipe(plumber(errorHandler()))
                    .pipe(sass({ errLogToConsole: true, outputStyle: 'nested' }))
                    .pipe(cssSvg(/*{
                        baseDir: "./images"
                    }*/))
                    .pipe(gulpif(config.isRelease, minifyCss(options.minifyCss))),
                tpl: '<style>%s</style>'
            }
        }))
        .pipe(gulpif(config.isRelease, minifyHtml(options.minifyHtml)))
        .pipe(gulp.dest(paths.pages.dest));
});

gulp.task("build", gulp.series("clean", gulp.parallel("build:javascript", "build:typescript", "build:pages"/*, "build:styles"*/)));
gulp.task("default", gulp.parallel("build"));

gulp.task('watch', gulp.series("build", function () {
    gulp.watch([paths.pages.src, paths.styles.src, ['./src/images/**/*.svg']], ['build:pages'])
    gulp.watch(paths.ts.watch, ['build:typescript']);
    gulp.watch(paths.js.src, ['build:javascript']);
    //gulp.watch(paths.styles.src, ['build:styles']);

    return browsersync(options.browserSync);
}));

function errorHandler(title) {
    return function (error) {
        log([
            colors.bold.red("Error in " + (title || error.plugin)),
            error.message,
            ''
        ].join('\n'));

        this.emit("end")
    }
}
