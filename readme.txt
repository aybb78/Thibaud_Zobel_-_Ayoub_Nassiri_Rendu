Il faut installer Mamp (dernière version), mettre le serveur Appache dans le dossier flight-master du rendu, puis se connecter à Postgresql :

Pour ce faire se référer à cet extrait du Cours :
"Pour se connecter à une base postgres en PHP, il faut d’abord le configurer :
dans le fichier php.ini, décommentez les lignes (enlever le point-virgule) chargeant les extensions, notamment extension=php_pgsql.dll
dans le fichier httpd.conf (Apache), chargez la librairie dynamique avec LoadFile "C:/MAMP/bin/php/php[version]/libpq.dll" (exemple avec MAMP, vérifiez bien le dossier de votre version de PHP)
redémarrez le serveur Apache"

L'idéal là encore est d'avoirs la dernière version de Postgresql, POSTGIS et de PGAdmin. (tout le travail a été effectué avec Mamp v8.0.1 , Postgresql 16 , POSTGIS 3 et PGAdmin 4)

Il Faut ensuite exécuter le code du fichier BDD.sql (copier-coller le contenu de BDD.sql dans pg admin ou importer BDD.sql directement dans PG admin).

Pour le géoserveur : JavaSE11 et télécharger le géoserveur depuis le guide officiel : https://docs.geoserver.geo-solutions.it/edu/fr/install_run/gs_install.html

Une fois la bdd créée, il faut se rendre sur un navigateur puis entrer l'adresse http://localhost qui amène directement sur la page d'acceuil !
