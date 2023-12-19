CREATE TABLE IF NOT EXISTS public.objects
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nom character varying COLLATE pg_catalog."default",
    image_url character varying COLLATE pg_catalog."default",
    imagetaille double precision[],
    imageposition double precision[],
    texte character varying COLLATE pg_catalog."default",
    localisation geometry,
    nom_bloque character varying COLLATE pg_catalog."default",
    code integer,
    afficher boolean,
    min_zoom integer,
    texte_leonard character varying COLLATE pg_catalog."default",
    CONSTRAINT "Objects_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.objects
    OWNER to postgres;

------------------------

CREATE TABLE IF NOT EXISTS public.halloffame
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    pseudo character varying COLLATE pg_catalog."default",
    mentor character varying COLLATE pg_catalog."default",
    temps character varying COLLATE pg_catalog."default",
    /*temps_triche double precision,*/
    /*score double precision,*/
    /*date character varying COLLATE pg_catalog."default",*/
    CONSTRAINT "Halloffame_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.halloffame
    OWNER to postgres;

------------------------

INSERT INTO objects (nom, image_url, imagetaille, texte, localisation, min_zoom)
VALUES 
('Colosse', 'assets/images/diamond.svg', '{128,128}', 'Le colosse de Rhodes est une statue gigantesque d''Hélios, le dieu du Soleil, en bronze, dont la hauteur dépasse trente mètres. Construit en 292 av. J.-C, le colosse est renversé en 227 ou 226 av. J.-C. par un tremblement de terre. Bravo, tu as trouvé la première merveille !','POINT(36.45111 28.22778)', 16),
('Lettre', 'assets/images/Parchemin.svg', '{128,128}', 'Cher %nom_du_joueur%, si tu lis cette lettre c''est que j''ai déjà pris ma retraite. Il est inutile d''essayer de me retrouver. J''ai cependant laissé derrière moi un bien inestimable, mon plus grand trésor. Il ne sera pas facile pour toi d''y accéder, il faudra pour cela prouver ta valeure. Commence d''abord par te rendre chez un célèbre inventeur du XVII° siècle qui m''a, il y a bien longtent, servi de mentor. Bonne Chance. Signé %nom_du_mentor%', 'POINT(48.8413606852832 2.587211456789122)', 10),
('Trésor','assets/images/%tresor%.png', '{42,60}', '%message_fin%', 'POINT(-81.88966601639069 69.25357126788393)', 10);

INSERT INTO objects (nom, image_url, imagetaille, texte, localisation, min_zoom,texte_leonard)
VALUES
('Artemis', 'assets/images/diamond.svg', '{128,128}', 'Tu te trouves devant l''important temple d''Artemis à Ephese. Bravo, tu as trouvé la cinquième merveille !','POINT(37.94972 27.36389)', 16, 'As tu déjà senti la présence de la déesse de la guerre?'),
('Phare', 'assets/images/diamond.svg', '{128,128}', 'Le phare d''Alexandrie était un phare situé à Alexandrie, sur l''île de Pharos, en Égypte. Il a servi de guide aux marins pendant près de dix-sept siècles (du iiie siècle av. J.-C. au xive siècle). Il a été détruit suite à différents tremblements de terre et raz-se-marées. Bravo, tu as trouvé la seconde merveille !','POINT(31.21472 29.88611)', 16,'As tu déjà vu le plus beau phare de l''histoire de l''humanité?'),
('Jardin', 'assets/images/diamond.svg', '{128,128}', 'Voici les magnifiques jardins suspendus de Babylone. Bravo, tu as trouvé la quatrième merveille !','POINT(32.53556 44.4275)', 16, 'As tu déjà contemplé les beaux jardins volants?'),
('Zeus', 'assets/images/diamond.svg', '{128,128}', 'La statue chryséléphantine (En or et en ivoir) de Zeus à Olympie est une œuvre du sculpteur athénien Phidias, réalisée vers 436 av. J.-C. à Olympie. Bravo, tu as trouvé la troisième merveille !','POINT(38.63778 21.63)', 16, 'Le dieu des dieu t''attend, cher aventurier!'),
('Mausolée', 'assets/images/diamond.svg', '{128,128}', ' Haut d''environ 45 mètres, le Mausolée d''Halicarnasse est un tombeau orné de sculptures sur ses quatre côtés, chacune réalisée sous l''autorité d''un grand sculpteur grec. Bravo, tu as trouvé la sixième merveille !','POINT(37.03806 27.42417)', 16, 'As-tu déjà admiré le travail des artistes Grecs ayant réalisé un tombeau extraordinaire?'),
('pyramide', 'assets/images/diamondbis.svg', '{128,128}', ' Tombeau présumé du pharaon Khéops, la pyramide de Khéops ou grande pyramide de Gizeh fut édifiée il y a plus de 4 500 ans. Elle mesurait 146,58 m de hauteur lors de sa construction! Bravo, tu as trouvé la septième merveille !','POINT(29.97606 31.13042)', 16, 'Tu as bien voyagé jeune homme. Mais ces merveilles ne sont rien comparé au pyramides! J''y ai d''ailleurs déposé un trésor que j''aimerai récupéré...'),
('Code', 'assets/images/code.svg', '{128,121}', '123456789101112131415' ,'POINT(48.86111 2.335833)', 16, 'Oh tu as retrouvé mon trésor! Je viens de déposer le code de la cave auprès de mon tableau le plus célèbre.');

---------------

INSERT INTO objects (nom, image_url, imagetaille, texte, localisation, min_zoom, nom_bloque)
VALUES 
('Leonard', 'assets/images/leonardo_da_vinci.svg', '{128,128}', 'Bonjour jeune voyageur. Je suis le maitre de ton maitre. Il m''a laissé quelque chose pour toi. Mais tu n''aura la chance de consulter ce message seulement si tu me prouves que tu as visité les merveilles du monde de mon temps. Va tout d''abord rendre visite au dieu du soleil! Et n''hésite pas à repasser me dire bonjour! J''aime bien avoir de la compagnie et je peut t''apprendre des choses intéressantes! Bon voyage!','POINT(43.79917 10.93806)', 16, 'pyramide'),
('Cadena', 'assets/images/code_porte.jpg', '{40,51}', '!!! MASTER''S TREASURE IS HERE !!!','POINT(48.8425 2.5876)', 16, null); 