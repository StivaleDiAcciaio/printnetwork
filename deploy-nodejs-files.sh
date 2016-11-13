sudo cp -a PnBe/. /var/www/nodejs-server/PnBe/
echo copiata cartella PnBe/ in /var/www/nodejs-server/PnBe/
sudo chmod 777 /var/www/nodejs-server/PnBe/appLog
echo permessi impostati per la cartella /var/www/nodejs-server/PnBe/appLog
sudo rm /var/www/nodejs-server/PnBe/appLog/*.log
echo eliminati file di log in appLog
sudo cp /home/stivale/cert.pem /var/www/nodejs-server/PnBe/cert.pem
echo copiato certificato nella cartella /var/www/nodejs-server/PnBe
sudo cp /home/stivale/key.pem /var/www/nodejs-server/PnBe/key.pem
echo copiata key nella cartella /var/www/nodejs-server/PnBe

