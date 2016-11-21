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

//Esegue FTP o rimozione files su server remoto
function deploy2Server(tipoOperazione, cartellaDestinazione,nomeFile,origineFile) {
    console.log("tipo operazione "+tipoOperazione+" su file "+nomeFile);
    if (tipoOperazione === 'deleted'){
        shellCommandServer('rm',config.dest+cartellaDestinazione+nomeFile);
    }else{
        console.log("ftp su "+config.dest+cartellaDestinazione+" del file "+nomeFile);
         
            var ftp = gulp.src(origineFile)
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
}
//esegue comandi remoti
function shellCommandServer(comando,percorso){
    console.log ("eseguo "+comando+" su "+percorso);
    gulpSSH.exec([comando+' '+percorso]);
}
/* 
 * Watch su PNFE
 * rileva cambiamenti sui files e cartelle
 * 
 * NB:
 *  non vengono rilevate le cartelle rimosse;
 *  aggiungere le cartelle annidate una per volta
 *  NON copia e incolla di cartelle annidate
 * 
*/ 
gulp.task('watchPnFe', function () {
    var pnFeFolder = 'testGulp/'+PN_FE+'/**/*';
    var watcherPnFeFolder = gulp.watch(pnFeFolder);
    console.log("..in ascolto su "+pnFeFolder);
    watcherPnFeFolder.on('change', function (event) {
        if ((event.path).slice(-1) !== '/'){//se ho modificato files..
            var startCartella = event.path.indexOf(PN_FE)+PN_FE.length;
            var endCartella = event.path.lastIndexOf('/');
            var cartella = event.path.substring(startCartella,endCartella);
            if (cartella !== '/'){// se cartella diversa da root di PNFE..
                cartella = cartella +'/';
            }
            var startNomeFile = endCartella+1;
            var endNomeFile = event.path.length;
            var nomeFile =event.path.substring(startNomeFile,endNomeFile);
            var origineFile = event.path;
            deploy2Server(event.type, PN_FE+cartella,nomeFile,origineFile);   
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
 *  aggiungere le cartelle annidate una per volta
 *  NON copia e incolla di cartelle annidate
 * 
*/ 
gulp.task('watchPnBe', function () {
    var pnBeFolder = 'testGulp/'+PN_BE+'/**/*';
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
            deploy2Server(event.type, PN_BE+cartella,nomeFile,origineFile);   
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
