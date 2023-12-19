<html lang="fr">
<head>
    <title>MASTER'S TREASURE</title>

    <link rel="shortcut icon" type="image/svg" href="assets/images/diamond.svg"/>

    <link rel="stylesheet" href="assets/style.css">
</head>
<body id="body-acceuil">
    <div id="title1" class=texte>
        Master's Treasure
    </div>
    
    <div id="son">   
        <button id="speakerButton" onclick="toggleAudio()">&#x1F507</button>
        <audio id="myAudio" loop>
            <source src="assets/audio/intro.m4a" type="audio/mp3">
            Votre navigateur ne supporte pas l'élément audio.
        </audio>
    </div>

    <div id="contenu">
        <form action="/jeu" method="post">
            <label id= "for" for="name">Votre pseudo :</label>
            <input id= "choix" type="text" name="pseudo" required>
            <br>
            <label id= "for" for="prof">Votre mentor :</label>
            <select id= "choix" name="Mentor" required>
                <option value="" disabled selected>Choisissez un mentor</option>
                <option value="Victor">Victor</option>
                <option value="Vincent">Vincent</option>
            </select>
            <br>
            <button id="start-button" type="submit">Commencer</button>
        </form>

        <div id="hallOfFame">
            <h2>Hall of Fame</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pseudo</th>
                        <th>Mentor</th>
                        <th>Temps</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($hallOfFame as $entry): ?>
                        <tr>
                            <td><?= $entry['pseudo'] ?></td>
                            <td><?= $entry['mentor'] ?></td>
                            <td><?= $entry['temps'] ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
</div>

    </div>

    <script>
        var audio = document.getElementById("myAudio");
        var bouton = document.getElementById("speakerButton");
        function toggleAudio() {
            if (audio.paused) {
                audio.play();
                bouton.innerHTML = "&#x1F50A";
            } else {
                audio.pause();
                bouton.innerHTML = "&#x1F507";
            }
        }
    
    </script>
    
</body>
</html>