module.exports = {
    'secret': 'secretToken',/* chiave segreta per generazione token autenticazione */
    'database':'mongodb://pnetworkDbAdmin:XX@localhost:27017/printNetworkDb?3t.connection.name=pnetworkDB',
    'captchaSecretKey':'secretKey',/* inserire qui la key secret di google */
    'googleVerifyCaptcha':'https://www.google.com/recaptcha/api/siteverify',
    'passphraseCert':'secretCertificato', /* chiave segreta per generazione certificato */
    'keyPermLocal':'key.pem',
    'certPermLocal':'cert.pem',
    'keyPermPublic':'printnetwork.key.pem',
    'certPermPublic':'printnetwork.cert.pem'
};
