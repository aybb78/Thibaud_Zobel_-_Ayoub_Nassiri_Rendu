/*
Vue est un singleton (il existe une unique instance de la classe). 
Cette app, c'est une classe avec des méthodes qui utilise les attributs de la classe.
Lorsque je fais un this je créer un attribut de la classe de manière à avoir accès à cet attribut de 
partout au sein de l'app!!
*/

Vue.createApp({
    data(){
        return {
            zoomObjet: 16,
            cochee: false,
            localisation: [48.8413606852832, 2.587211456789122],
            listbool: [true,true,true,true,true],
            select: "zlrigxz",

            
            /* Amélioration1:
            Temps de triche : quand je clique sur la triche, en plus de faire apparaitre
            le wms du geoserver, je stocke la date du début de triche. Puis lorsque je décoche,
            je fais la différence entre date actuelle et date stockée et j'ajoute ce temps 
            à la somme des temps de triche.
            Est utilisé: methods(coche triche avec des actions au sein du if else).
            methods(ajout triche qui fait current_triche + différence calculé)
            On a 2 data: current_triche + date stockée.*/
            inventaire: [],
            //modèle: [["nom","image_url","texte_si_clique","séléctionné"]],

          };
    },
    mounted() {
        //construction des objets.
        this.map = L.map('map').setView(this.localisation, 15);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 4,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(this.map);

        this.objects16 = new L.FeatureGroup(); 
        this.objects18 = new L.FeatureGroup();

        //événements sans lien avec BDD.
        this.map.on('zoomend', this.onZoomEnd) 

        //Chargement de la lettre. 
        fetch('/requete?recherche=Lettre')
        .then(r => r.json())
        .then(r => {
            console.log(r.res_q);
            console.log(r.res_q[0]);
            console.log(r.res_q[0].id);
            console.log(r.res_q[0].imagetaille);
            console.log(r.res_q[0].st_astext);

            this.current_size=postgreToJS(r.res_q[0].imagetaille);
            this.current_position=positiontoJS(r.res_q[0].st_astext);
            this.current_texte=[r.res_q[0].texte];
            this.current_name=r.res_q[0].nom;
            this.current_url=r.res_q[0].image_url;
            
            this.lettre = L.icon({
                iconUrl: this.current_url,
                iconSize: this.current_size, 
                iconAnchor: [0, 0],   
                });
            this.myIcon = L.marker(this.current_position, {icon: this.lettre});
            this.objects16.addLayer(this.myIcon);
            this.myIcon.on('click', this.firstcall);
            console.log(this.current_texte[0]);
      })


        this.geoserverLayer = L.tileLayer.wms("http://localhost/jeu/geoworkspace/wms", {
            layers: 'Projet_Web:objects',
        });
    },
    methods: {
        //actualiser les objets selon le zoom
        onZoomEnd() {
                if (this.map.getZoom() < 16){
                        this.map.removeLayer(this.objects16);
                }
                else {
                        this.map.addLayer(this.objects16);
                    }  
                if (this.map.getZoom() < 18){
                        //18 c'est la limite pour voir l'objet.
                        this.map.removeLayer(this.objects18);
                }
                else {
                        this.map.addLayer(this.objects18);
                    }  
        },

        clickinventaire(item){
            //gérer qu'on a un objet séléctionné à la fois
            for (let key in this.inventaire) {
                this.inventaire[key][3]=false;
                if (item[0]==this.inventaire[key][0]){
                    this.inventaire[key][3]=true;
                    this.select=this.inventaire[key][0];
                }
            }
            
        },

        clickgeoserver(){
            if (this.cochee){
                this.map.addLayer(this.geoserverLayer);
        }
        else {
                this.map.removeLayer(this.objects16);
            }
        },

        //events sur les objets.
        firstcall(){
            // récupération du pseudo et du mentor définis dans corps de jeu.php
            const pseudo = document.body.getAttribute('data-pseudo');
            const mentor = document.body.getAttribute('data-mentor');
            // modification du texte pour ajouter pseudo et mentor
            this.myIcon.unbindPopup();
            const texte_original = this.current_texte[0];
            const texteModifie = texte_original.replace('%nom_du_joueur%', pseudo).replace('%nom_du_mentor%', mentor);
            this.myIcon.bindPopup(texteModifie);
            this.myIcon.openPopup();

            if (this.listbool[0]){
                this.inventaire.push([this.current_name,this.current_url,this.current_texte,false])
                fetch('/requete?recherche=Leonard')
                .then(r => r.json())
                .then(r => {
                        console.log(r.res_q);
                        
                        //d'abord je vais tout faire en dure. Puis on fera une factorisation de code.
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.BloqueLeo=r.res_q[0].nom_bloque;

                        this.leonard = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconleonard = L.marker(this.current_position, {icon: this.leonard});
                        this.objects16.addLayer(this.Iconleonard);
                        this.Iconleonard.on('click', this.callLeo);
                    })

                fetch('/requete?recherche=Cadena')
                .then(r => r.json())
                .then(r => {
                        this.cadena_size=postgreToJS(r.res_q[0].imagetaille);
                        this.cadena_position=positiontoJS(r.res_q[0].st_astext);
                        this.cadena_texte=r.res_q[0].texte;
                        this.cadena_url=r.res_q[0].image_url;
                        this.Bloque_cadena=r.res_q[0].nom_bloque;

                        this.cadena = L.icon({
                            iconUrl: this.cadena_url,
                            iconSize: this.cadena_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconcadena = L.marker(this.cadena_position , {icon: this.cadena});
                        this.objects18.addLayer(this.Iconcadena);
                        this.Iconcadena.on('click', this.callcadena);
                    })
            this.listbool[0]=false;
            }
        },
        callLeo(){
            this.Iconleonard.unbindPopup();
            this.Iconleonard.bindPopup(this.current_texte[1]);
            this.Iconleonard.openPopup();
            if (this.select==this.BloqueLeo){
                fetch('/requete?recherche=Code')
                .then(r => r.json())
                .then(r => {
                        
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;

                        this.code = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconcode = L.marker(this.current_position, {icon: this.code});
                        this.objects16.addLayer(this.Iconcode);
                        this.Iconcode.on('click', this.callcode);
                    })
                
                let i=0;
                for (let key in this.inventaire) {
                    if (this.inventaire[key][0]=="pyramide"){
                        this.inventaire.splice(i,1);
                    }
                    i++;
                } 
                
                this.select="";
            }
            if (this.listbool[1]){
                fetch('/requete?recherche=Colosse')
                .then(r => r.json())
                .then(r => {
                        
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;

                        this.colosse = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconcolosse = L.marker(this.current_position, {icon: this.colosse});
                        this.objects16.addLayer(this.Iconcolosse);
                        this.Iconcolosse.on('click', this.callcolosse);
                    })
                this.listbool[1]=false;
            }
        },

        callcadena() {
            this.Iconcadena.unbindPopup();
            this.Iconcadena.bindPopup("<form id='codeForm'> <div> Pour atteindre la pièce secrète, la cave du MRS, rentre le bon code pour ouvrir le cadenas.</div><div><label>Code: <input type='text' id='MotDePasse'></label></div> <div><button type='submit'>Ouvrir</button></div></form>");
            this.Iconcadena.openPopup();
        
            document.getElementById('codeForm').addEventListener('submit', (event) => {
                event.preventDefault();
        
                var codeEntre = document.getElementById('MotDePasse').value;
        
                fetch('/testcadena', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'MotDePasse=' + encodeURIComponent(codeEntre),
                })
                .then(response => response.json())
                .then(data => {
                    // Affiche le résultat dans une fenêtre contextuelle (popup)
                    if (data.isValid) {
                        alert("Code bon");
                        this.calltresor();
                    } else {
                        alert("Code incorrect");
                        
                    }
                })
                .catch(error => {
                    alert("Erreur lors de la requête AJAX : " + error);
                });
            });
        },
        
        
        
        callcolosse(){
            /* Lorsque je clique sur le colosse, j'ai l'indice pour le phare.
               Or je fetch le phare quand je clique sur le colosse. 
               Donc je modifie léonard  ce moment.  
            */
            this.Iconcolosse.unbindPopup();
            this.Iconcolosse.bindPopup(this.current_texte[2]);
            this.Iconcolosse.openPopup();
            if (this.listbool[2]){
                fetch('/requete?recherche=Phare')
                .then(r => r.json())
                .then(r => {
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;//lorsque le phare apparait, indice leonard pour le phare.

                        this.phare = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconphare = L.marker(this.current_position, {icon: this.phare});
                        this.objects16.addLayer(this.Iconphare);
                        this.Iconphare.on('click', this.callphare);
                    })
                this.listbool[2]=false;
            }
        },
        callphare(){
            this.Iconphare.unbindPopup();
            this.Iconphare.bindPopup(this.current_texte[3]);
            this.Iconphare.openPopup();
            if (this.listbool[3]){
                fetch('/requete?recherche=Artemis')
                .then(r => r.json())
                .then(r => {
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;//lorsque le phare apparait, indice leonard pour le phare.

                        this.artemis = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconartemis = L.marker(this.current_position, {icon: this.artemis});
                        this.objects16.addLayer(this.Iconartemis);
                        this.Iconartemis.on('click', this.callartemis);
                    })
                this.listbool[3]=false;
            }
        },
        callartemis(){
            this.Iconartemis.unbindPopup();
            this.Iconartemis.bindPopup(this.current_texte[4]);
            this.Iconartemis.openPopup();
            if (this.listbool[4]){
                this.listbool.push(true); //j'avais pas initialisé assez de true dans la liste
                fetch('/requete?recherche=Zeus')
                .then(r => r.json())
                .then(r => {
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;//lorsque le phare apparait, indice leonard pour le phare.

                        this.zeus = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconzeus = L.marker(this.current_position, {icon: this.zeus});
                        this.objects16.addLayer(this.Iconzeus);
                        this.Iconzeus.on('click', this.callzeus);
                    })
                this.listbool[4]=false;
            }
        },
        callzeus(){
            this.Iconzeus.unbindPopup();
            this.Iconzeus.bindPopup(this.current_texte[5]);
            this.Iconzeus.openPopup();
            if (this.listbool[5]){
                this.listbool.push(true); //j'avais pas initialisé assez de true dans la liste
                fetch('/requete?recherche=Jardin')
                .then(r => r.json())
                .then(r => {
                        this.listbool.push(true);
                        
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;//lorsque le phare apparait, indice leonard pour le phare.

                        this.jardin = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconjardin = L.marker(this.current_position, {icon: this.jardin});
                        this.objects16.addLayer(this.Iconjardin);
                        this.Iconjardin.on('click', this.calljardin);
                    })
                this.listbool[5]=false;
            }
        },
        calljardin(){
            this.Iconjardin.unbindPopup();
            this.Iconjardin.bindPopup(this.current_texte[6]);
            this.Iconjardin.openPopup();
            if (this.listbool[6]){
                this.listbool.push(true); //j'avais pas initialisé assez de true dans la liste
                fetch('/requete?recherche=Mausolée')
                .then(r => r.json())
                .then(r => {
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;//lorsque le phare apparait, indice leonard pour le phare.

                        this.maus = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconmaus = L.marker(this.current_position, {icon: this.maus});
                        this.objects16.addLayer(this.Iconmaus);
                        this.Iconmaus.on('click', this.callmaus);
                    })
                this.listbool[6]=false;
            }
        },
        callmaus(){
            this.Iconmaus.unbindPopup();
            this.Iconmaus.bindPopup(this.current_texte[7]);
            this.Iconmaus.openPopup();
            if (this.listbool[7]){
                this.listbool.push(true);
                fetch('/requete?recherche=pyramide')
                .then(r => r.json())
                .then(r => {
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                        this.current_position=positiontoJS(r.res_q[0].st_astext);
                        this.current_texte.push(r.res_q[0].texte);
                        this.current_name=r.res_q[0].nom;
                        this.current_url=r.res_q[0].image_url;
                        this.current_texte[1]=r.res_q[0].texte_leonard;

                        this.pyramide = L.icon({
                            iconUrl: this.current_url,
                            iconSize: this.current_size,
                            iconAnchor: [0, 0],  
                            });
                        this.Iconpyramide = L.marker(this.current_position, {icon: this.pyramide});
                        this.objects16.addLayer(this.Iconpyramide);
                        this.Iconpyramide.on('click', this.callpyramide);
                    })
                this.listbool[7]=false;
            }
        },
        callpyramide(){
            this.Iconpyramide.unbindPopup();
            this.Iconpyramide.bindPopup(this.current_texte[8]);
            this.Iconpyramide.openPopup();
            if (this.listbool[8]){
                this.listbool.push(true);
                fetch('/requete?recherche=pyramide')
                .then(r => r.json())
                .then(r => {
                        this.inventaire.push([r.res_q[0].nom,r.res_q[0].image_url,r.res_q[0].texte,false]);
                        this.objects16.removeLayer(this.pyramide);
                    })
                this.listbool[8]=false;
                this.select=true;
            }
        },
        callcode(){
            this.Iconcode.unbindPopup();
            this.Iconcode.bindPopup(this.current_texte[9]);
            this.Iconcode.openPopup();
        },
        calltresor(){
            const mentor = document.body.getAttribute('data-mentor');
            console.log(mentor);
            fetch('/requete?recherche=Trésor')
            .then(r => r.json())
            .then(r => {
                    if(mentor=='Victor'){
                        this.current_size=postgreToJS(r.res_q[0].imagetaille.replace('{42,60}','{128,128}'));
                    }
                    else{
                        this.current_size=postgreToJS(r.res_q[0].imagetaille);
                    }
                    this.current_position=positiontoJS(r.res_q[0].st_astext);
                    this.current_texte.push(r.res_q[0].texte);
                    this.current_name=r.res_q[0].nom;
                    this.current_url=r.res_q[0].image_url.replace('%tresor%', mentor);

                    this.tresor = L.icon({
                        iconUrl: this.current_url,
                        iconSize: this.current_size,
                        iconAnchor: [0, 0],  
                        });
                    this.Icontresor = L.marker(this.current_position, {icon: this.tresor});
                    this.objects16.addLayer(this.Icontresor);
                    this.Icontresor.on('click', this.fin);

                    // Centrer la carte sur le marqueur Icontresor
                    this.map.setView(this.current_position, 16);
                })
            
            
        },

        fin() {
            const pseudo = document.body.getAttribute('data-pseudo');
            const mentor = document.body.getAttribute('data-mentor');
            stopChrono();
            const temps = getChrono();
            
            // Envoi des données à la bdd
            fetch(`/requeteFin?pseudo=${encodeURIComponent(pseudo)}&mentor=${encodeURIComponent(mentor)}&temps=${encodeURIComponent(temps)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('L\'insertion dans la base de données a réussi');
                        if (mentor === 'Vincent') {
                            alert('Les secrets cachés du monde sont dans ce précieux livre. À toi la gloire et la prospérité !');
                        } else {
                            alert('HELLFEST! Il faut vivre sa passion jusqu\'au bout.');
                        }
                        // Redirection vers la page d'accueil
                        window.location.href = '/'; 
            
                    } else {
                        console.log('L\'insertion dans la base de données a échoué');
                    }
                })
                .catch(error => {
                    // Une erreur s'est produite lors de la requête
                    console.log('Une erreur est survenue lors de la communication avec le serveur.');
                });
        },

        
    },
}).mount('#app')


//-------------------------fonction à utiliser au sein de la map---------------------------

//tableau pgadmin to javascript
function postgreToJS(tab){
    let tab2 = tab.replace(/\{|\}/gm, "");
    let tab3 = tab2.split(",");
    return [Number(tab3[0]), Number(tab3[1])];
    console.log(this.current_size);
}

//geom pgadmin to javascript.
function positiontoJS(pos){
    let pos2=pos.replace('POINT(', '');
    let pos3=pos2.replace(')', '');
    let pos4 =pos3.split(" ");
    return [Number(pos4[0]), Number(pos4[1])];
    console.log(this.current_position);
}




//--------------------------- PARTIE QUI GERE LE CHRONO ----------------------------------

// variables globales 
let tempsTotal = 0; //initialisation du conteur (en secondes)
let intervalID; 

// Fonction pour démarrer le chrono
function demarrerChrono() {
    intervalID = setInterval(miseAJourChrono, 1000); //intervalle de raffraichissement fixé à 1000ms 
}

// Fonction pour arrêter le chrono
function stopChrono() {
    clearInterval(intervalID); //met fin au rafraichissement automatique
}

// Fonction qui renvoie le chrono afin notamment de l'ajouter à la bdd
function getChrono(){
    return formatTemps(tempsTotal)
}
// Fonction pour transformer le temps au format HH:MM:SS
function formatTemps(secondes) {
    const heures = Math.floor(secondes / 3600); //compte le nombre d'heures
    const minutes = Math.floor((secondes % 3600) / 60); //compte le nombre de minutes
    const secondesRestantes = secondes % 60; //compte le nombre de secondes restantes
    return `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondesRestantes.toString().padStart(2, '0')}`;
}

// Fonction pour mettre à jour le chrono
function miseAJourChrono() {
    tempsTotal++; //maj compteur 
    document.getElementById('chrono').textContent = 'Chrono : ' + formatTemps(tempsTotal); //conversion du compteur
}

// Appelle la fonction pour démarrer le chrono lorsque la page est chargée
document.addEventListener('DOMContentLoaded', demarrerChrono);

