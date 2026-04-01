# Laravel Auth API

API RESTful d'authentification et de gestion de profil, construite avec **Laravel 11**, **Laravel Sanctum** et **Laravel Socialite**.

---

## Stack technique

| Outil | Rôle |
|---|---|
| Laravel 11 | Framework PHP |
| Laravel Sanctum | Authentification par token |
| Laravel Socialite | OAuth2 (Google, GitHub) |
| MySQL / SQLite | Base de données |

---

## Installation

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd laravel-auth-api

# 2. Installer les dépendances
composer install

# 3. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 4. Installer Sanctum et Socialite
composer require laravel/sanctum
composer require laravel/socialite

# 5. Exécuter les migrations
php artisan migrate

# 6. Lancer le serveur
php artisan serve
```

L'API sera disponible sur `http://localhost:8000`.

---

## Variables d'environnement

```env
# .env — valeurs à remplir

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

---

## Routes disponibles

### Publiques

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/register` | Créer un compte |
| POST | `/api/login` | Se connecter (retourne un token) |
| GET | `/api/auth/{provider}/redirect` | Obtenir l'URL OAuth du provider |
| GET | `/api/auth/{provider}/callback` | Callback OAuth → token → redirect SPA |

Providers supportés : `google`, `github`

### Protégées (Bearer token obligatoire)

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/logout` | Se déconnecter |
| GET | `/api/me` | Consulter son profil |
| PUT | `/api/me` | Modifier son profil |
| PUT | `/api/me/password` | Changer son mot de passe |
| DELETE | `/api/me` | Supprimer son compte |

---

## Configurer les credentials OAuth

### Google
1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un projet → **APIs & Services** → **Credentials**
3. Créer un **OAuth 2.0 Client ID** (type : Web application)
4. Ajouter `http://localhost:8000/api/auth/google/callback` dans les **Authorized redirect URIs**
5. Copier Client ID et Client Secret dans `.env`

### GitHub
1. Aller sur [github.com/settings/developers](https://github.com/settings/developers)
2. **New OAuth App**
3. Homepage URL : `http://localhost:8000`
4. Authorization callback URL : `http://localhost:8000/api/auth/github/callback`
5. Copier Client ID et Client Secret dans `.env`

---

## Règles métier importantes

- Les mots de passe sont **hachés** avec bcrypt — jamais stockés en clair
- Les comptes OAuth ont `password = null` — le changement de mot de passe est désactivé côté SPA
- Un email déjà enregistré via inscription classique ne crée **pas de doublon** si utilisé ensuite avec OAuth — les deux comptes sont fusionnés
- Après **changement de mot de passe**, tous les tokens sont révoqués
- Un utilisateur ne peut accéder et modifier **que son propre profil**

---

## Structure des fichiers ajoutés/modifiés (OAuth)

```
app/Http/Controllers/
└── SocialAuthController.php      ← nouveau

app/Models/
└── User.php                      ← ajout provider, provider_id, isOAuth()

config/
└── services.php                  ← credentials Google + GitHub

database/migrations/
└── ..._add_oauth_columns_to_users_table.php  ← nouveau

routes/
└── api.php                       ← 2 routes OAuth ajoutées
```