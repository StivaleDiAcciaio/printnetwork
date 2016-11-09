/* gulpfile.js 
 * gestisce il watch sulle cartelle di progetto
 * esegue ftp su server remoto dei files modificati/nuovi
 * 
 */

var gulp = require('gulp');
var scp = require('gulp-scp2');
var config = require('./configGulp'); // mio file di configurazione
function ftp2Server(tipoOperazione, nomeFile) {
    var ftp = gulp.src(nomeFile)
            .pipe(scp({
                host: config.host,
                username: config.user,
                password: config.pwd,
                dest: config.dest
            }));
    ftp.on('error', function (err) {
        console.log("errore durante FTP:" + err);
    });
}

gulp.task('watch', function () {
    var watcher = gulp.watch('test/*.txt');
    watcher.on('change', function (event) {
        ftp2Server(event.type, event.path);
    });
    watcher.on('error', function (e) {
        console.log("errore durante il WATCH dei files:" + e);
    });
});
