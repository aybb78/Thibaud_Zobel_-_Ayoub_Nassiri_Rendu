<html>
    <head>

        <title>MASTER'S TREASURE</title>

        <link rel="shortcut icon" type="image/svg" href="assets/images/diamond.svg"/>

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>
        <link rel="stylesheet" href="../assets/style.css">

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossorigin=""></script>
        <script src="https://cdn.jsdelivr.net/npm/vue"></script>

    </head>

    <body id="app" data-pseudo="<?php echo $_POST['pseudo']; ?>" data-mentor="<?php echo $_POST['Mentor']; ?>">
        <div id="chrono" class=texte>
            <div> Chrono : 00:00:00 </div> <!-- permet l'affichage du chrono au chargement de la page -->
        </div>
        <div id="map"></div>

        <div id="inventaire" class=texte>
            <form>
            <input id="geoserver" type="checkbox" v-model='cochee' @click='clickgeoserver'>
            <label for="geoserver" v-if="cochee">triche activée</label>
            <label for="geoserver" v-else="cochee">triche désactivée</label>
            </form>
            Inventaire
            <ul>
                <li v-for='item in inventaire' @click='clickinventaire(item)'>
                    <img :src="item[1]" :alt="item[0]" :class="{ selected: item[3] }" class="image-inventaire">
                    {{item[0]}}
                </li>
            </ul>
        </div>
        <script src="../assets/jeu.js">></script>
    </body>
</html>
