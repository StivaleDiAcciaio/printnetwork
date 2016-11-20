/* gulpfile.js 
 * gestisce il watch sulle cartelle di progetto
 * esegue ftp su server remoto dei files modificati/nuovi
 * 
 */

var gulp = require('gulp');
var scp = require('gulp-scp2');
var GulpSSH = require('gulp-ssh');
var config = require('./configGulp'); // mio file di configurazione
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

var PN_FE = 'PnFe/';

//Esegue FTP su server remoto
function ftp2Server(tipoOperazione, cartellaDestinazione,nomeFile) {
    console.log("ftp di "+nomeFile + " su "+config.dest+cartellaDestinazione);
var ftp = gulp.src(nomeFile)
            .pipe(scp({
                host: config.host,
                username: config.username,
                password: config.password,
                dest: config.dest+cartellaDestinazione
            }));
    ftp.on('error', function (err) {
        console.log("errore durante FTP:" + err);
    });
}
//esegue comandi remoti
function shellCommandServer(percorso,comando){
    gulpSSH.exec([comando+percorso]);
}
/* 
 * Task in ascolto sulle cartelle di progetto
 * rileva cambiamenti sui files e cartelle
 * 
 * NB:
 *  non vengono rilevate le cartelle rimosse;
 *  aggiungere le cartelle annidate una per volta
 *  NON copia e incolla di cartelle annidate
 * 
*/ 
gulp.task('watch', function () {
    var pnFeFolder = 'testGulp/'+PN_FE+'**/*';
    var watcherPnFeFolder = gulp.watch(pnFeFolder);
    console.log("..in ascolto su "+pnFeFolder);
    //=====================//
    //  PnFe
    watcherPnFeFolder.on('change', function (event) {
        if ((event.path).slice(-1) !== '/'){//se ho modificato files..
            var start = event.path.indexOf(PN_FE)+PN_FE.length;
            var end = event.path.length;
            var cartellaPiuFile = event.path.substring(start,end);
            var origineFile = event.path;
            ftp2Server(event.type, PN_FE+cartellaPiuFile,origineFile);   
        }
    });
    watcherPnFeFolder.on('error', function (e) {
        console.log('errore durante il WATCH su '+PN_FE+':' + e);
    });    
    //=====================//
});
