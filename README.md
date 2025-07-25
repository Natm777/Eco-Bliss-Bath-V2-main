# Projet Eco-Bliss-Bath

Ce dépôt contient la campagne de tests fonctionnels réalisée avec **Cypress** pour l’application e-commerce *Eco Bliss Bath*.  
L’objectif principal est d’automatiser les tests critiques du **panier** et de la **connexion**, ainsi que des **appels API** et des **smoke tests**.

## Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:

- Docker
- NodeJs

## Installation et démarrage

### 1. Cloner le projet

```
git clone https://github.com/Natm777/Eco-Bliss-Bath-V2-main
cd Eco-Bliss-Bath-V2-main
```

### 2. Lancer l’API et la base de données depuis la racine du projet

```
docker compose up -d
```

### Documentation de l’API (Swagger)

Pour consulter les endpoints de l’API, accédez à l’interface Swagger via :
```
http://localhost:8081/api/doc
```

### 3. Démarrer le frontend

Aller sur:
```
cd frontend
```
Et ensuite entrer:
```
npm install
```
et
```
npm run start
```

Le frontend sera accessible sur : [http://localhost:4200]

---

## Installation de Cypress

Depuis la racine du projet :

```
npm install --save-dev cypress
```
---

## Exécution des tests Cypress

### Mode graphique (GUI)
Assurez-vous que le front soit bien lancé avant d'executer la commande
```
npx cypress open
```
Lancez manuellement les fichiers de test depuis l’interface (ex. `connexion.cy.js`, `panier.cy.js`, etc.).

### Mode terminal 
Assurez-vous que le front soit bien lancé avant d'executer la commande
```
npx cypress run
```
Cela exécute tous les tests automatiquement en ligne de commande.

---

## Génération du rapport de tests (Mochawesome)

### 1. Installer le reporter 

```
npm install --save-dev mochawesome
```

### 2. Lancer les tests avec génération automatique du rapport
Assurez-vous que le front soit bien lancé avant d'executer la commande!
```
npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/reports/mochawesome,overwrite=false,html=true,json=true"
```

### 3. Visualiser le rapport

Le rapport HTML est généré ici :

```
Eco-Bliss-Bath-V2-main\cypress\reports\mochawesome
```
Les Captures d’écran automatiques sont disponibles en (`cypress/screenshots`)

## Suivi

Les résultats des tests, rapports d’incidents et captures d’écran sont disponibles dans le dossier Bilan de campagne de test.  
Ce README sera mis à jour à mesure que la couverture des test évolue.

