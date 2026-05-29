# PumpFinder 🚴

Application mobile PWA de recensement des pumptracks en France.  
**1229 spots** scrapés depuis ourouler.com, carte interactive, GPS, filtres, backend communautaire.

🔗 **[jerdewapp.github.io/pumpfinder](https://jerdewapp.github.io/pumpfinder)**

---

## Stack technique

- HTML / CSS / JS vanilla — fichier unique `index.html`
- Carte **Leaflet.js** + tuiles **OpenStreetMap**
- **Leaflet.MarkerCluster** (hébergé localement — CDN bloqué sur Firefox)
- Données : `spots_data.js` (1229 spots, variable `SPOTS_DATA`)
- Backend communautaire : **Supabase** (PostgreSQL)
- Géocodage : **Nominatim OSM** (gratuit, sans clé)
- Hébergement : **GitHub Pages**
- PWA : `manifest.json` + Service Worker `sw.js`
- Bilingue : **FR / EN** via dictionnaire centralisé `LANG`

---

## Fichiers du repo

| Fichier | Rôle |
|---|---|
| `index.html` | Application complète |
| `spots_data.js` | 1229 spots (`var SPOTS_DATA = [...]`) |
| `markercluster.js` | Plugin clustering Leaflet (local) |
| `MarkerCluster.css` | Styles cluster |
| `MarkerCluster.Default.css` | Styles cluster défaut |
| `manifest.json` | Config PWA |
| `sw.js` | Service Worker PWA |
| `icon-192.png` | Icône app 192×192px |
| `icon-512.png` | Icône app 512×512px |

---

## Fonctionnalités

### Carte
- Leaflet + OpenStreetMap, marqueurs SVG custom noir/rouge
- Clustering (s'ouvre au zoom 14)
- Bouton GPS réel (`navigator.geolocation`)
- Banner "spot le plus proche" slide depuis le haut
- Pill filtre actif permanente sur la carte

### Recherche
- Géocodage Nominatim — tape une ville + Entrée
- Recentre la carte + filtre les spots dans le rayon sélectionné
- Slider rayon (10 → 150 km)
- Bouton ✕ remet la carte sur la France entière

### Filtres
- **Barre principale** : Tous / Kid Zone / Aire de jeux / Skatepark
- **Tiroir ···** : Terre / Éclairé / Accès libre

### Liste
- Cards avec photo ourouler ou placeholder brandé
- Tri par distance quand GPS ou recherche actifs
- Badges Kid Zone, Aire de jeux, Éclairé
- État vide brandé avec bouton reset

### Fiche détail
- Photo ourouler avec fallback placeholder
- Caractéristiques, équipements OSM
- Lien ourouler.com
- Signalement communautaire (Tout ok / Problème / Fermé) → **persisté Supabase**
- Itinéraire OSM
- Swipe down pour fermer (mobile)
- Favori ⭐ (localStorage)

### Ajout de spot
- Stepper 3 étapes : Localisation → Difficulté/Surface/Constructeur → Équipements/Description
- GPS auto dans le formulaire
- **Persisté Supabase**, chargé au démarrage et fusionné avec les 1229 spots

### Auth
- Écran connexion/inscription
- Comptes démo : `PumpRider69` / `pump1234` et `admin` / `admin`
- Mode invité par défaut

### PWA
- Installable sur Android (Chrome), iOS (Safari), desktop (Chrome)
- Popup d'installation universel au premier lancement — détecte Chrome / Firefox / Safari iOS/iPadOS
- Service Worker avec cache versionné
- Theme color rouge

### Internationalisation
- Dictionnaire centralisé `LANG` (FR/EN)
- Fonction `t("clé")` — tout le texte visible passe par là
- Bascule FR/EN via bouton header ou menu Profil

---

## Backend Supabase

**URL :** `https://bofoaaelxsjphjwbbtbc.supabase.co`

### Tables

**`spots_community`** — spots ajoutés par la communauté  
**`reports`** — signalements (ok / warn / hs)

### Gestion des données
- Administration via **Table Editor** sur [supabase.com](https://supabase.com)
- Suppression/validation des spots depuis l'interface Supabase
- Chaque appareil a un `device_id` anonyme persisté en localStorage

---

## Workflow de déploiement

### Mise à jour standard
1. Modifier l'artifact Claude → copier-coller dans `index.html` sur GitHub
2. Vérifier que `<script src="spots_data.js"></script>` est bien **avant** `<script>`
3. Vérifier que `var SPOTS = (typeof SPOTS_DATA...)` est bien présent
4. **Incrémenter le numéro de cache dans `sw.js`** (voir ci-dessous)
5. Commiter — GitHub Pages se met à jour en 1-2 minutes

### ⚠️ Versioning du cache SW — À FAIRE À CHAQUE DÉPLOIEMENT

Dans `sw.js`, incrémenter la ligne :
```javascript
const CACHE = 'pumpfinder-v2'; // → v3, v4, v5...
```
Sans ça, les utilisateurs ayant l'app installée restent sur l'ancienne version.

### Mise à jour des données spots
1. Relancer `scraper_ourouler_selenium.py` (Python/Selenium/Firefox)
2. Convertir avec `geojson_to_js.py`
3. Remplacer `spots_data.js` sur GitHub
4. Incrémenter le cache SW

---

## Points techniques importants

### Chargement des données
`spots_data.js` doit être chargé **avant** le script principal :
```html
<script src="spots_data.js"></script>
<script>
  var SPOTS = (typeof SPOTS_DATA !== 'undefined' && SPOTS_DATA.length > 0) ? SPOTS_DATA : [];
</script>
```

### Clustering
Plugin MarkerCluster hébergé localement (CDN bloqué par Firefox) :
```javascript
clusterGroup = L.markerClusterGroup({
  maxClusterRadius: 60,
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: true,
  disableClusteringAtZoom: 14
});
```

### Détection iPadOS
iPadOS 13+ se présente comme MacOS dans le user-agent — détection par touch :
```javascript
var isIOS = /iPhone|iPad|iPod/.test(ua) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
```

---

## Design & charte graphique

| Élément | Valeur |
|---|---|
| Couleur primaire | `#E10600` |
| Noir | `#111111` |
| Police | Plus Jakarta Sans |
| Logo header | `https://i.ibb.co/QvhV7c2t/logos-header.png` |
| Logo app | `icon-192.png` / `icon-512.png` (local) |

---

## Roadmap

- [ ] Vrais comptes utilisateurs (Supabase Auth)
- [ ] Interface de modération admin dans l'app
- [ ] Branchement OSM Overpass (spots live)
- [ ] Mise à jour des données scraper ourouler.com
- [ ] Favoris persistés en base (actuellement localStorage)
- [ ] Partenariat ourouler.com

---

## Fichiers locaux (non versionnés)

```
C:\pumpfinder\
├── scraper_ourouler_selenium.py   # Scraper Python/Selenium/Firefox
├── geojson_to_js.py               # Convertisseur GeoJSON → JS
└── pumptracks_ourouler.geojson    # Données brutes 1229 spots
```
