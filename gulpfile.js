// compilar css
const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass') (require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


// Compilar Img
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Tarea de compilacion
function css(done) {
    src('src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
    done();
}

// Tareas img
function imagenes(done) {
    src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3}))
        .pipe(dest('build/img'));
    done();
}
function versionWebp() {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}
function versionAvif() {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}


function dev() {
    watch('src/sass/**/*.scss', css);
    watch('src/img/**/*', imagenes);
    watch('src/img/**/*.{png,jpg}', versionWebp);
    watch('src/img/**/*.{png,jpg,webp}', versionAvif);
}


// ejecuciones
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(versionAvif, versionWebp, imagenes, css, dev);