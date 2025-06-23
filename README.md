# AssurCRM - Système CRM pour Assurance Santé

## Description

AssurCRM est une application CRM moderne spécialement conçue pour les professionnels de l'assurance santé. Elle intègre des fonctionnalités avancées de gestion des prospects, contrats, et simulations avec l'API Oggo Data.

## Fonctionnalités Principales

### 🏠 Tableau de Bord
- Vue d'ensemble des KPIs
- Statistiques en temps réel
- Activités récentes
- Tâches à venir

### 👥 Gestion des Prospects
- Création et modification de prospects
- Suivi du pipeline de vente
- Scoring automatique
- Historique des interactions

### 📋 Gestion des Contrats
- Création de contrats d'assurance
- Suivi des renouvellements
- Calcul automatique des primes
- Gestion des paiements

### 💊 Comparateur Santé (Oggo Data)
- Intégration avec l'API Oggo Data
- Simulations personnalisées
- Comparaison d'offres mutuelles
- Génération de devis

### 🤖 Automatisation (Workflows)
- Workflows personnalisables
- Déclencheurs automatiques
- Suivi des exécutions
- Statistiques de performance

### 📧 Marketing Automation
- Campagnes email
- Séquences automatiques
- Templates personnalisables
- Analytics détaillés

### 📊 Rapports et Analytics
- Tableaux de bord personnalisables
- Métriques de performance
- Export de données
- Visualisations interactives

### 📥 Import de Données
- Import CSV/Excel
- Mapping de colonnes
- Validation des données
- Traitement par lots

### ⚙️ Paramètres et Profil
- Gestion du profil utilisateur
- Préférences de notification
- Paramètres de sécurité
- Configuration système

## Technologies Utilisées

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Icons**: Font Awesome 6
- **Styling**: Tailwind CSS avec design system personnalisé
- **API**: Routes API Next.js
- **Intégrations**: Oggo Data API, Google Sheets API, Ringover API

## Structure du Projet

```
src/
├── app/
│   ├── page.jsx                    # Tableau de bord principal
│   ├── prospects/page.jsx          # Gestion des prospects
│   ├── contacts/page.jsx           # Gestion des contacts
│   ├── contracts/page.jsx          # Gestion des contrats
│   ├── comparateur/page.jsx        # Comparateur Oggo Data
│   ├── workflows/page.jsx          # Automatisation
│   ├── marketing/page.jsx          # Marketing automation
│   ├── import/page.jsx             # Import de données
│   ├── reports-dashboard/page.jsx  # Rapports et analytics
│   ├── profile/page.jsx            # Profil utilisateur
│   └── layout.js                   # Layout principal
├── api/
│   ├── google-sheets/route.js      # API Google Sheets
│   ├── import-jobs/route.js        # API Import de données
│   ├── integrations/route.js       # API Intégrations
│   ├── marketing/route.js          # API Marketing
│   ├── notifications/route.js      # API Notifications
│   ├── settings/route.js           # API Paramètres
│   └── workflows/route.js          # API Workflows
└── utilities/
    └── runtime-helpers.js          # Utilitaires React
```

## Installation et Démarrage

1. **Installation des dépendances**
```bash
npm install
```

2. **Configuration des variables d'environnement**
Créez un fichier `.env.local` avec :
```env
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
OGGO_API_KEY=your_oggo_api_key
RINGOVER_API_KEY=your_ringover_api_key
RINGOVER_CALLER_ID=your_caller_id
```

3. **Démarrage du serveur de développement**
```bash
npm run dev
```

4. **Accès à l'application**
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Fonctionnalités Détaillées

### Intégration Oggo Data
- Simulation de complémentaires santé
- Paramètres personnalisables (âge, situation familiale, revenus)
- Comparaison d'offres en temps réel
- Génération de devis PDF

### Workflows Automatisés
- Déclencheurs : nouveau prospect, email ouvert, tâche en retard
- Actions : envoi d'email, création de tâche, mise à jour de champ
- Conditions et logique métier
- Monitoring et statistiques

### Import de Données
- Support CSV et Excel
- Mapping automatique des colonnes
- Validation des données
- Traitement par lots avec suivi de progression

### Marketing Automation
- Campagnes email ciblées
- Séquences de nurturing
- Segmentation avancée
- A/B testing

## API et Intégrations

### Oggo Data API
```javascript
// Exemple d'utilisation
const simulation = await fetch('/api/integrations', {
  method: 'POST',
  body: JSON.stringify({
    action: 'oggo_simulation',
    lead_id: 123,
    postal_code: '75001',
    birth_date: '1985-03-15',
    situation_familiale: 'Marié(e)',
    nombre_enfants: 2,
    revenus_annuels: 45000
  })
});
```

### Google Sheets Sync
```javascript
// Synchronisation automatique
const sync = await fetch('/api/google-sheets', {
  method: 'POST',
  body: JSON.stringify({
    action: 'sync',
    sheetId: 'your_sheet_id'
  })
});
```

## Design System

### Couleurs Principales
- **Primaire**: Bleu (#3B82F6) vers Violet (#8B5CF6)
- **Succès**: Vert (#10B981)
- **Attention**: Orange (#F59E0B)
- **Erreur**: Rouge (#EF4444)

### Composants UI
- Cards avec ombres subtiles
- Boutons avec gradients
- Formulaires avec validation
- Modales responsives
- Tableaux interactifs

## Sécurité

- Validation côté client et serveur
- Gestion des erreurs robuste
- Protection contre les injections
- Authentification et autorisation
- Chiffrement des données sensibles

## Performance

- Lazy loading des composants
- Optimisation des images
- Cache intelligent
- Pagination des données
- Compression des assets

## Déploiement

L'application est prête pour le déploiement sur :
- Vercel (recommandé pour Next.js)
- Netlify
- AWS Amplify
- Docker containers

## Support et Maintenance

- Logs détaillés pour le debugging
- Monitoring des performances
- Alertes automatiques
- Sauvegarde des données
- Mises à jour de sécurité

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Contact

Pour toute question ou support, contactez l'équipe de développement.