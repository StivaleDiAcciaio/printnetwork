/* gulpfile.js 
 * gestisce il watch sulle cartelle di progetto
 * esegue ftp su server remoto dei files modificati/nuovi
 * 
 */

var gulp = require('gulp');
var scp = require('gulp-scp2');
var config = require('./configGulp'); // mio file di configurazione
var PN_FE = '/PnFe/';

//Esegue FTP su server remoto
function ftp2Server(tipoOperazione, cartellaDestinazione,nomeFile) {
console.log("ftp2Server start..");
console.log("tipoOperazione "+tipoOperazione);
console.log("file modificato "+nomeFile);
console.log("cartella destinazione "+cartellaDestinazione);

/*    var ftp = gulp.src(nomeFile)
            .pipe(scp({
                host: config.host,
                username: config.user,
                password: config.pwd,
                dest: config.dest+cartellaDestinazione
            }));
    ftp.on('error', function (err) {
        console.log("errore durante FTP:" + err);
    });*/
console.log("ftp2Server end");
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
    var pnFeFolder = 'testGulp'+PN_FE+'**/*';
    var watcherPnFeFolder = gulp.watch(pnFeFolder);
    console.log("..in ascolto su "+pnFeFolder);
    //=====================//
    //  PnFe
    watcherPnFeFolder.on('change', function (event) {
        //..nuova cartella
        if ((event.path).slice(-1) === '/'){
            var start = event.path.indexOf(PN_FE)+PN_FE.length;
            var end = event.path.length-1;
            var cartella = event.path.substring(start,end);
            console.log(event.type+" cartella..:"+cartella);
            //creaCartellaServer(PN_FE,cartella);
        }else{//modifiche a files..
            ftp2Server(event.type, PN_FE,event.path);   
        }
    });
    watcherPnFeFolder.on('error', function (e) {
        console.log('errore durante il WATCH su '+PN_FE+':' + e);
    });    
    //=====================//
});
