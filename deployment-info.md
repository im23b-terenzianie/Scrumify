# 🚀 Deployment Information

## Backend (bereits deployed) ✅
- **API**: https://api.scrumify.site
- **Docs**: https://api.scrumify.site/docs
- **Health Check**: https://api.scrumify.site/health
- **Server**: Ubuntu 24.04 mit Nginx, PostgreSQL, FastAPI
- **SSL**: Let's Encrypt Zertifikate installiert
- **CORS**: Konfiguriert für scrumify.site

## Frontend Deployment 🎨
- **URL**: https://scrumify.site
- **WWW URL**: https://www.scrumify.site
- **Server Path**: `/var/www/scrum-frontend/`
- **Build Output**: `dist/` (wichtig für Nginx)

### Frontend Deployment Commands
```bash
# Auf dem Server (Ubuntu):
cd /var/www/scrum-frontend/
git pull origin main
npm install
npm run build

# Build nach dist/ verschieben (falls nötig)
if [ -d "build" ] && [ ! -d "dist" ]; then
    mv build dist
fi

# Nginx Permissions setzen
sudo chown -R www-data:www-data dist/
sudo systemctl reload nginx
```

## Environment Variables für React 🔧
```env
REACT_APP_API_URL=https://api.scrumify.site
REACT_APP_ENVIRONMENT=production
REACT_APP_APP_NAME=Scrumify
```

## Development Setup 💻
```bash
# Local Development
REACT_APP_API_URL=https://api.scrumify.site  # Nutze Production API
REACT_APP_ENVIRONMENT=development
```

## Nginx Konfiguration (bereits fertig) ✅
- **Backend API**: `api.scrumify.site` → Proxy zu FastAPI (Port 8000)
- **Frontend**: `scrumify.site` → Statische Dateien aus `/var/www/scrum-frontend/dist/`
- **SSL**: Automatische HTTPS Weiterleitung
- **Caching**: Optimiert für React Build Assets

## Repository Information 📂
- **Backend Repo**: `im23b-terenzianie/scrum_backend` (bereits deployed)
- **Frontend Repo**: `im23b-terenzianie/scrum_planer` (aktuelles Repository)
- **Branch**: `main`

## API Integration 🔌
Das Backend bietet eine vollständige REST API für:
- User Authentication (JWT)
- Projects/Workspaces
- Sprints
- User Stories/Tasks
- Kanban Board Management

Alle Details in der API Dokumentation: https://api.scrumify.site/docs

---
**🎯 Alles bereit für React Frontend Development!**
