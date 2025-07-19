Ce dépôt contient la campagne de tests fonctionnels réalisée avec **Cypress** pour l’application e-commerce *Eco Bliss Bath*.  
L’objectif principal est d’automatiser les tests critiques du **panier** et de la **connexion**, ainsi que des **appels API** et des **smoke tests**.

## Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:

-Docker
-NodeJs
-Angular CLI global 

## Pour installer Angular 

npm install -g @angular/cli


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

### 3. Démarrer le frontend

```
Aller sur:
cd frontend
Et ensuite entrer:
npm install
et
npm run start
```

Le frontend sera accessible sur : [http://localhost:4200]

---

## Installation de Cypress

Depuis la racine du projet :

```
npm install --save-dev cypress
```

> Si vous avez besoin d’une installation globale :
> ```
> npm install -g cypress
> ```

---

## Exécution des tests Cypress

### Mode graphique (GUI)

```
npx cypress open
```
Lancez manuellement les fichiers de test depuis l’interface (ex. `connexion.cy.js`, `panier.cy.js`, etc.).

### Mode terminal 
Assurez-vous de bien que le front soit bien lancé avant d'executer la commande
```
npx cypress run
```
Cela exécute tous les tests automatiquement en ligne de commande.

---

## Génération du rapport de tests (Mochawesome)

### 1. Installer le reporter (si ce n’est pas déjà fait)

```
npm install --save-dev mochawesome
```

### 2. Lancer les tests avec génération automatique du rapport

```
npm run test
```
> Le script `npm run test` est déjà configuré dans le `package.json` pour utiliser Mochawesome comme reporter.

### 3. Visualiser le rapport

Le rapport HTML est généré ici :

```
cypress/reports/mochawesome-report/mochawesome.html
```
Les Captures d’écran automatiques sont disponibles en (`cypress/screenshots`)

## Suivi

Les résultats des tests, rapports d’incidents et captures d’écran sont disponibles dans le dossier Bilan de campagne de test.  
Ce README sera mis à jour à mesure que la couverture de test évolue.

