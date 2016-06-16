/* su Pc-Desktop ho installato una
 * versione diversa di MongoDB che ha
 * una url di connessione diversa da quella in Vbox
 * */
module.exports = {
    'secret': 'lostivalediacciaio',
    'database':'mongodb://pnetworkDbAdmin:4a74s2@localhost:27017/pnetworkDB?3t.uriVersion=2&3t.connectionMode=direct&readPreference=primary&3t.connection.name=pnetworkDB',
    'databaseVB':'mongodb://pnetworkDbAdmin:4a74s2@localhost:27017/printNetworkDb?3t.connection.name=pnetworkDB'
};
