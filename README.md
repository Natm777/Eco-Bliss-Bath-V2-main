# Tests automatisés – Projet Eco Bliss Bath

Ce dépôt contient la campagne de tests fonctionnels réalisée avec **Cypress** pour l’application e-commerce *Eco Bliss Bath*.  
L’objectif principal est d’automatiser les tests critiques du **panier** et de la **connexion**, ainsi que des **appels API** et des **smoke tests**.

##  Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs
- Angular CLI global 

## Pour installer Angular 
- npm install -g @angular/cli

## Installation et démarrage
Clonez le projet pour le récupérer :
```
git clone https://github.com/Natm777/Eco-Bliss-Bath-V2-main
```

Pour démarrer l'API avec sa base de données :
```
docker compose up -d
```

## Pour démarrer le frontend de l'applicatif  
Rendez-vous dans le dossier frontend :
```
cd ./frontend
```

Installez les dépendances du projet :
```
npm i
ou
npm install
```

Lancez ensuite l'application :
npm run start
```
---


## Installation de Cypress 

Installez Cypress en global :
```
npm i -g cypress
```

Ou ouvrez-le directement à la racine du projet :
```
npx cypress open
```

---

## Lancer les tests Cypress

### En mode graphique (Cypress Studio)

```
npx cypress open
```

Cela ouvre l’interface de test Cypress. Vous pouvez lancer un fichier de test manuellement (ex. `connexion.cy.js`, `panier.cy.js`, etc.).

### En mode terminal

```
npx cypress run
```

Cela exécute tous les tests automatiquement dans le terminal, sans interface graphique.

---

## Génération du rapport de tests

### Étapes pour générer un rapport HTML avec Mochawesome :

#### 1. Installer le reporter

```
npm install --save-dev mochawesome
```

#### 2. Lancer les tests avec le reporter

```
npx cypress run --reporter mochawesome
```

#### 3. Visualiser le rapport

Le rapport est généré à l’emplacement suivant :
```
cypress/reports/mochawesome-report/mochawesome.html
```

Ouvrez ce fichier dans un navigateur pour consulter les résultats détaillés.


---

## Suivi

Les résultats des tests, rapports d’incidents et captures d’écran sont disponibles dans le dossier Bilan de campagne de test.  
Ce README sera mis à jour à mesure que la couverture de test évolue.



npm run test