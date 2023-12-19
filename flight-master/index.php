<?php
session_start();

require 'flight/Flight.php';

//----------------connexion à la BDD et preparation de requêtes---------------------

$dbconn = pg_connect("host=localhost dbname=projet_web user=postgres password=uU4MR#7E7z")
    or die('Connexion impossible : ' . pg_last_error());

$result = pg_prepare($dbconn, "ask_objects", 'SELECT id,nom,image_url,imagetaille,
texte,ST_AsText(localisation),nom_bloque,code,min_zoom,texte_leonard FROM objects WHERE nom = $1');

$resultats = pg_prepare($dbconn, "push_hall_of_fame", 'INSERT INTO halloffame (pseudo, mentor, temps) VALUES ($1, $2, $3)');


Flight::set('db', $dbconn); 

//--------------------------------routes--------------------------------------------
Flight::route('/', function() {
    $connect = Flight::get('db');
    $res_query = pg_query($connect, 'SELECT * FROM halloffame ORDER BY temps ASC LIMIT 10');
    $res = pg_fetch_all($res_query);
    Flight::render('accueil', ['hallOfFame' => $res]);
});

Flight::route('/jeu', function() {
    Flight::render('jeu');
});

Flight::route('POST /jeu', function() {
    Flight::render('jeu');
});

Flight::route('/requete', function() {
    $connect = Flight::get('db');
    $res_query = pg_execute($connect,"ask_objects",array($_GET['recherche']));
    $res = pg_fetch_all($res_query);
    Flight::json(['res_q' => $res]);
});

Flight::route('/requeteFin', function() {
    $connect = Flight::get('db');

    $pseudo = $_GET['pseudo'];
    $mentor = $_GET['mentor'];
    $temps = $_GET['temps'];

    $res_query = pg_execute($connect, "push_hall_of_fame", array($pseudo, $mentor, $temps));

    if ($res_query) {
        Flight::json(['success' => true, 'message' => 'Insertion réussie']);
    } else {
        Flight::json(['success' => false, 'message' => 'Erreur lors de l\'insertion']);
    }
});


Flight::route('POST /testcadena', function() {
    $connect = Flight::get('db');
    $res_query = pg_execute($connect, "ask_objects", array("Code"));
    $res = pg_fetch_all($res_query);
    $codeVrai = $res[0]['texte'];

    if(isset($_POST['MotDePasse'])){
        $codeEntre = $_POST['MotDePasse'];
        $isValid = hash_equals($codeVrai, $codeEntre);

        // Utilisez header pour indiquer que la réponse est en JSON
        header('Content-Type: application/json');

        // Générez une réponse JSON
        echo json_encode(['isValid' => $isValid]);
    } else {
        // Générez une réponse JSON en cas d'erreur
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Aucun code n\'a été saisi']);
    }
});



//------------------------------------Commentaires---------------------------------------

/*
2 remarques:
- Les strings des requêtes SQL, c'est des ' et pas des " !!! 
- Quand j'ai contruit ma route post, il faut avoir aussi la route sans marqué post qui sois construite.

Pour comprendre ce qui se passe au niveau de la requete, travailler avec localhost/request. 
*/ 

Flight::start();
?>
