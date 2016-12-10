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

var PN_FE = 'PnFe';
var PN_BE = 'PnBe';
var NODEJS_SERVER_FOLDER='nodejs-server';
var PUBLIC_HTML_SERVER_FOLDER='public_html';

//Esegue FTP o rimozione files su server remoto
function deploy2Server(tipoOperazione, cartellaDestinazione,nomeFile,origineFile,server) {
    //console.log("tipo operazione "+tipoOperazione+" su file "+nomeFile);
    var destinazioneServer=config.dest+cartellaDestinazione;
    if (tipoOperazione === 'deleted'){
        shellCommandServer('rm',destinazioneServer+nomeFile);
    }else{
        //console.log("ftp su "+destinazioneServer+" del file "+nomeFile);
            var ftp = gulp.src(origineFile)
                        .pipe(scp({
                            host: config.host,
                            username: config.username,
                            password: config.password,
                            dest: destinazioneServer
                        }));
                ftp.on('error', function (err) {
                    console.log("errore durante FTP:" + err);
                });
    }
}
//esegue comandi remoti
function shellCommandServer(comando,percorso){
    //console.log ("eseguo "+comando+" su "+percorso);
    gulpSSH.exec([comando+' '+percorso]);
}
/* 
 * Watch su PNFE
 * rileva cambiamenti sui files e cartelle
 * 
 * NB:
 *  non vengono rilevate le cartelle rimosse;
 *  aggiungere eventuali cartelle annidate una per volta
 *  NON copia e incolla di cartelle annidate
 *  che non verrebbero rilevate correttamente da GULP
 * 
*/ 
gulp.task('watchPnFe', function () {
    var pnFeFolder = PN_FE+'/**/*';
    var watcherPnFeFolder = gulp.watch(pnFeFolder);
    console.log("..in ascolto su "+pnFeFolder);
    watcherPnFeFolder.on('change', function (event) {
        if ((event.path).slice(-1) !== '/'){//se ho modificato files..
            var startCartella = event.path.indexOf(PUBLIC_HTML_SERVER_FOLDER)+PUBLIC_HTML_SERVER_FOLDER.length;
            var endCartella = event.path.lastIndexOf('/');
            var cartella = event.path.substring(startCartella,endCartella);
            if (cartella !== '/'){// se cartella diversa da root (PUBLIC_HTML_SERVER_FOLDER)..
                cartella = cartella +'/';
            }
            var startNomeFile = endCartella+1;
            var endNomeFile = event.path.length;
            var nomeFile =event.path.substring(startNomeFile,endNomeFile);
            var origineFile = event.path;
            deploy2Server(event.type, PUBLIC_HTML_SERVER_FOLDER+'/'+PN_FE+cartella,nomeFile,'FE');   
        }
    });
    watcherPnFeFolder.on('error', function (e) {
        console.log('errore durante il WATCH su '+PN_FE+':' + e);
    });    
});

/* 
 * Watch su PNBE
 * rileva cambiamenti sui files e cartelle
 * 
 * NB:
 *  non vengono rilevate le cartelle rimosse;
 *  aggiungere eventuali cartelle annidate una per volta
 *  NON copia e incolla di cartelle annidate
 *  che non verrebbero rilevate correttamente da GULP
 * 
*/ 
gulp.task('watchPnBe', function () {
    var pnBeFolder = PN_BE+'/**/*';
    var watcherPnBeFolder = gulp.watch(pnBeFolder);
    console.log("..in ascolto su "+pnBeFolder);
    watcherPnBeFolder.on('change', function (event) {
        if ((event.path).slice(-1) !== '/'){//se ho modificato files..
            var startCartella = event.path.indexOf(PN_BE)+PN_BE.length;
            var endCartella = event.path.lastIndexOf('/');
            var cartella = event.path.substring(startCartella,endCartella);
            if (cartella !== '/'){// se cartella diversa da root di PNBE..
                cartella = cartella +'/';
            }
            var startNomeFile = endCartella+1;
            var endNomeFile = event.path.length;
            var nomeFile =event.path.substring(startNomeFile,endNomeFile);
            var origineFile = event.path;
            deploy2Server(event.type, NODEJS_SERVER_FOLDER+'/'+PN_BE+cartella,nomeFile,origineFile,'BE');   
        }
    });
    watcherPnBeFolder.on('error', function (e) {
        console.log('errore durante il WATCH su '+PN_BE+':' + e);
    });    
});

/**
 * Quando avvio gulp senza parametri
 * partono i 2 task sopra di default
 */
gulp.task('default', ['watchPnFe', 'watchPnBe']);
