# 🚀 Projet Full Stack MERN avec Kubernetes - Guide Complet

## 📋 Table des Matières

- [Vue d'ensemble du projet](#vue-densemble-du-projet)
- [Architecture de l'application](#architecture-de-lapplication)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Développement Local](#développement-local)
  - [Docker Compose](#docker-compose)
  - [Kubernetes Local (Minikube)](#kubernetes-local-minikube)
- [Monitoring avec Prometheus & Grafana](#monitoring-avec-prometheus--grafana)
- [Déploiement sur Azure AKS](#déploiement-sur-azure-aks)
- [CI/CD Pipeline](#cicd-pipeline)
- [Concepts Kubernetes Utilisés](#concepts-kubernetes-utilisés)
- [Commandes de Référence](#commandes-de-référence)
- [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble du projet

Application de gestion de tâches (Task Manager) construite avec la stack MERN, déployée sur Kubernetes avec monitoring complet.

### Fonctionnalités principales
- ✅ Création, modification, suppression de tâches
- ✅ Marquage des tâches comme complétées
- ✅ Filtrage par statut (toutes, actives, terminées)
- ✅ Barre de progression
- ✅ Design moderne et responsive

---

## 🏗️ Architecture de l'application

### Architecture Générale 

```
┌─────────────────────────────────────────────────────────┐
│                    Internet / Users                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │      Ingress Controller            │
        │    (Nginx Ingress / TLS)           │
        └────────────┬───────────────────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   Service       │    │    Service      │
│  (LoadBalancer) │    │  (LoadBalancer) │
└────────┬────────┘    └────────┬────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Frontend Pods  │    │  Backend Pods   │
│  (Nginx + React)│───▶│  (Node.js/      │
│  Port: 80       │    │   Express)      │
└─────────────────┘    │  Port: 5000     │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  MongoDB Atlas  │
                       │  (External DB)  │
                       └─────────────────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                       ▼                 ▼
              ┌─────────────┐   ┌─────────────┐
              │ Prometheus  │   │  Grafana    │
              │ (Monitoring)│──▶│ (Dashboards)│
              └─────────────┘   └─────────────┘
```

### Architecture Réseau

```
Frontend (Nginx) ──┐
                   │
                   ├──▶ /api/* ──▶ Backend Service ──▶ Backend Pods
                   │
                   └──▶ /* ──────▶ Static Files (React Build)
```

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js** 18 (Alpine)
- **Express.js** - Framework web
- **MongoDB** - Base de données (MongoDB Atlas)
- **Mongoose** - ODM pour MongoDB
- **prom-client** - Métriques Prometheus
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **React** 19
- **Axios** - Client HTTP
- **Lucide React** - Icônes
- **Nginx** - Serveur web (en production)

### Infrastructure
- **Docker** & **Docker Compose**
- **Kubernetes** (Minikube local, Azure AKS cloud)
- **Prometheus** - Collecte des métriques
- **Grafana** - Visualisation des métriques
- **AlertManager** - Gestion des alertes
- **cert-manager** - Gestion des certificats TLS
- **Nginx Ingress Controller** - Routage HTTP/HTTPS

### CI/CD
- **GitHub Actions** - Pipeline d'intégration continue
- **Azure Container Registry (ACR)** - Registre d'images Docker

---

## 📁 Structure du projet

```
project-root/
│
├── Backend/
│   ├── config/
│   │   └── db.js                    # Configuration MongoDB
│   ├── controllers/
│   │   └── taskController.js        # Logique métier des tâches
│   ├── models/
│   │   └── taskModel.js             # Modèle Mongoose Task
│   ├── routes/
│   │   └── taskRoutes.js            # Routes API
│   ├── .env                         # Variables d'environnement
│   ├── .gitignore
│   ├── Dockerfile                   # Image Docker backend
│   ├── package.json
│   └── server.js                    # Point d'entrée serveur
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js                   # Composant principal React
│   │   ├── App.css                  # Styles de l'application
│   │   ├── index.js
│   │   └── ...
│   ├── Dockerfile                   # Image Docker frontend (multi-stage)
│   ├── nginx.conf                   # Configuration Nginx
│   └── package.json
│
├── K8s/
│   ├── backend.yaml                 # Deployment & Service backend (Minikube)
│   ├── frontend.yml                 # Deployment & Service frontend (Minikube)
│   ├── mongo.yaml                   # MongoDB + PVC
│   ├── mongo-secret.yaml            # Secret pour MongoDB URI
│   ├── ingress-template.yaml        # Configuration Ingress
│   ├── certificate.yaml             # Certificat TLS
│   ├── cluster-issuer.yaml          # Issuer self-signed
│   ├── backend-servicemonitor.yaml  # ServiceMonitor Prometheus
│   ├── backend-alerts.yaml          # Règles d'alertes Prometheus
│   ├── alertmanager-config.yaml     # Configuration AlertManager
│   ├── Aks-frontend-dep.yaml        # Deployment frontend pour AKS
│   └── (backend deployment AKS similaire)
│
├── docker-compose.yaml              # Orchestration Docker Compose
└── README.md                        # Ce fichier
```

---

## 💻 Développement Local

### Prérequis

```bash
# Installer Node.js 18+
node --version

# Installer Docker
docker --version

# Installer Docker Compose
docker-compose --version

# Installer kubectl
kubectl version --client

# Installer Minikube (pour Kubernetes local)
minikube version
```

### Variables d'environnement

#### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
```

---

## 🐳 Docker Compose
### Commandes Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Reconstruire les images
docker-compose up -d --build

# Supprimer les volumes (attention, supprime les données!)
docker-compose down -v
```

### Accès à l'application
- **Frontend** : http://localhost:3002
- **Backend API** : http://localhost:5000/api/tasks
- **MongoDB** : localhost:27017

---

## ☸️ Kubernetes Local (Minikube)

### Installation et démarrage de Minikube

```bash
# Démarrer Minikube
minikube start --driver=docker --cpus=4 --memory=8192

# Vérifier le statut
minikube status

# Activer l'add-on Ingress
minikube addons enable ingress

# Activer le dashboard
minikube dashboard
```

### Configuration des Secrets

```bash
# Créer le secret MongoDB
# 1. Encoder votre URI MongoDB en base64
echo -n "mongodb+srv://username:password@cluster.mongodb.net/K8?retryWrites=true&w=majority" | base64

# 2. Créer le fichier K8s/mongo-secret.yaml avec le résultat
kubectl apply -f K8s/mongo-secret.yaml
```

### Déploiement des ressources

```bash
# Ordre de déploiement (important!)

# 1. Secret MongoDB
kubectl apply -f K8s/mongo-secret.yaml

# 2. MongoDB (si local, sinon utiliser MongoDB Atlas)
kubectl apply -f K8s/mongo.yaml

# 3. Backend
kubectl apply -f K8s/backend.yaml

# 4. Frontend
kubectl apply -f K8s/frontend.yml

# 5. Ingress
kubectl apply -f K8s/ingress-template.yaml
```

### Vérification du déploiement

```bash
# Voir tous les pods
kubectl get pods

# Voir les services
kubectl get services

# Voir les deployments
kubectl get deployments

# Voir les ingress
kubectl get ingress

# Logs d'un pod spécifique
kubectl logs <nom-du-pod>

# Décrire un pod pour debug
kubectl describe pod <nom-du-pod>
```

### Configuration du fichier hosts

```bash
# Obtenir l'IP de Minikube
minikube ip
# Exemple: 192.168.49.2

# Ajouter à /etc/hosts (Linux/Mac) ou C:\Windows\System32\drivers\etc\hosts (Windows)
192.168.49.2  mern-tasks.com
```

### Accès à l'application
- **Application** : http://mern-tasks.com

### Port Forwarding (alternative)

```bash
# Accéder directement au frontend
kubectl port-forward service/frontend-service 3000:80

# Accéder directement au backend
kubectl port-forward service/backend-service 5000:5000
```

---

## 📊 Monitoring avec Prometheus & Grafana

### Installation de la stack Prometheus

```bash
# Ajouter le repository Helm de Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Installer Prometheus + Grafana + AlertManager
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Vérifier l'installation
kubectl get pods -n monitoring
```

### Services installés

```
prometheus-operated           # Prometheus server
alertmanager-operated         # AlertManager
grafana                       # Grafana dashboard
```

### Accès aux interfaces

```bash
# Prometheus
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
# Accès: http://localhost:9090

# Grafana
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
# Accès: http://localhost:3000
# Login: admin / prom-operator (ou vérifier avec la commande ci-dessous)

# Récupérer le mot de passe Grafana
kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode

# AlertManager
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-alertmanager 9093:9093
# Accès: http://localhost:9093
```

### Configuration du ServiceMonitor

Le fichier `K8s/backend-servicemonitor.yaml` permet à Prometheus de scraper les métriques du backend :

```bash
# Appliquer le ServiceMonitor
kubectl apply -f K8s/backend-servicemonitor.yaml
```

### Métriques exposées par le Backend

Le backend expose des métriques via `/metrics` grâce à `prom-client` :

```javascript
// Dans server.js
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({timeout: 6000});

app.get("/metrics", async(req, res) => {
  res.set("Content-type", client.register.contentType);
  res.end(await client.register.metrics())
});
```

**Métriques disponibles** :
- `nodejs_heap_size_used_bytes` - Mémoire utilisée
- `nodejs_heap_size_total_bytes` - Mémoire totale
- `process_cpu_user_seconds_total` - Temps CPU
- `nodejs_eventloop_lag_seconds` - Lag de l'event loop
- `nodejs_active_handles_total` - Handlers actifs
- `http_request_duration_seconds` - Durée des requêtes

### Configuration des Alertes

Le fichier `K8s/backend-alerts.yaml` définit des règles d'alerte 
```bash
# Appliquer les règles d'alerte
kubectl apply -f K8s/backend-alerts.yaml
```

### Configuration AlertManager

Le fichier `K8s/alertmanager-config.yaml` configure l'envoi d'emails :


```bash
# Appliquer la configuration AlertManager
kubectl apply -f K8s/alertmanager-config.yaml

# Redémarrer AlertManager pour prendre en compte les changements
kubectl rollout restart statefulset -n monitoring alertmanager-monitoring-kube-prometheus-alertmanager
```

### Dashboards Grafana recommandés

1. **Node Exporter Full** (ID: 1860) - Métriques système
2. **Kubernetes Cluster Monitoring** (ID: 7249)
3. **Kubernetes Pod Monitoring** (ID: 6417)

Pour importer :
1. Aller dans Grafana → Dashboards → Import
2. Entrer l'ID du dashboard
3. Sélectionner Prometheus comme source de données

---

## ☁️ Déploiement sur Azure AKS

### Prérequis Azure

```bash
# Installer Azure CLI
az --version

# Se connecter à Azure
az login

# Définir la subscription
az account set --subscription <SUBSCRIPTION-ID>
```

### Configuration du cluster AKS

```bash
# Variables
RESOURCE_GROUP="k8s_deployment"
CLUSTER_NAME="taskmanager-aks-cluster"
ACR_NAME="merntaskacr"
LOCATION="eastus"

# Créer un resource group (si nécessaire)
az group create --name $RESOURCE_GROUP --location $LOCATION

# Créer un cluster AKS
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --generate-ssh-keys
![Texte alternatif](./images/aks.png)

# Créer un Azure Container Registry
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic

![Texte alternatif](./images/acr.png)
# Attacher l'ACR au cluster AKS
az aks update \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --attach-acr $ACR_NAME
```

### Configuration des permissions RBAC

```bash
# Obtenir votre ID utilisateur
USER_ID=$(az ad signed-in-user show --query id -o tsv)

# Attribuer le rôle Cluster Admin
az role assignment create \
  --role "Azure Kubernetes Service RBAC Cluster Admin" \
  --assignee $USER_ID \
  --scope /subscriptions/<SUBSCRIPTION-ID>/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerService/managedClusters/$CLUSTER_NAME

# Obtenir les credentials du cluster
az aks get-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --overwrite-existing

# Configurer kubelogin
kubelogin convert-kubeconfig -l azurecli

# Vérifier l'accès
kubectl get nodes
```


### Déploiement sur AKS

#### Backend Deployment (backend-aks-deployment.yaml)
on utilise le loadbalancer
#### Frontend Deployment (K8s/Aks-frontend-dep.yaml)


### Commandes de déploiement

```bash
# Appliquer les déploiements
kubectl apply -f backend-aks-deployment.yaml
kubectl apply -f K8s/Aks-frontend-dep.yaml

# Vérifier les déploiements
kubectl get deployments
kubectl get pods
kubectl get services

# Obtenir les IPs externes (peut prendre 2-3 minutes)
kubectl get services --watch
```

### Accès à l'application sur AKS

```bash
# Obtenir les IPs externes
kubectl get services

# Exemple de sortie:
# NAME                    TYPE           EXTERNAL-IP       PORT(S)
# backend-service-aks     LoadBalancer   134.33.243.79     5000:30123/TCP
# frontend-service-aks    LoadBalancer   20.123.45.67      80:31456/TCP

# Application accessible à:
# Frontend: http://20.123.45.67
# Backend API: http://134.33.243.79:5000/api/tasks
```

### Mise à jour d'une image

```bash
# Build et push de la nouvelle version
docker build -t merntaskacr.azurecr.io/frontend:v5 .
docker push merntaskacr.azurecr.io/frontend:v5

# Mettre à jour le deployment
kubectl set image deployment/deployment-front-cloud frontend=merntaskacr.azurecr.io/frontend:v5

# Vérifier le rollout
kubectl rollout status deployment/deployment-front-cloud

# Rollback si nécessaire
kubectl rollout undo deployment/deployment-front-cloud
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions pour le Backend

 
### Configuration des secrets GitHub

Dans votre repository GitHub :
1. Settings → Secrets and variables → Actions
2. Ajouter les secrets :
   - `ACR_USERNAME` : Nom du registre ACR
   - `ACR_PASSWORD` : Mot de passe ACR

 
---

## 📚 Concepts Kubernetes Utilisés

### 1. **Pods**
Unité de base de Kubernetes. Contient un ou plusieurs conteneurs.

```bash
# Lister les pods
kubectl get pods

# Décrire un pod
kubectl describe pod <pod-name>

# Logs d'un pod
kubectl logs <pod-name>

# Shell dans un pod
kubectl exec -it <pod-name> -- /bin/sh
```

### 2. **Deployments**
Gère le déploiement et la mise à l'échelle des pods.
 
```bash
# Scaler un deployment
kubectl scale deployment/backend-deployment --replicas=3

# Voir l'historique des déploiements
kubectl rollout history deployment/backend-deployment

# Rollback
kubectl rollout undo deployment/backend-deployment
```

### 3. **Services**
Expose les pods via un point d'accès stable.

**Types de services** :
- **ClusterIP** (défaut) : Accessible uniquement dans le cluster
- **NodePort** : Expose sur un port de chaque nœud
- **LoadBalancer** : Crée un load balancer externe (cloud)

 
### 4. **ConfigMaps & Secrets**

**ConfigMap** : Configuration non sensible
 
**Secret** : Données sensibles (encodées en base64)
 
```bash
# Créer un secret depuis la ligne de commande
kubectl create secret generic mongo-secret \
  --from-literal=MONGO_URI='mongodb+srv://...'

# Encoder en base64
echo -n "ma-valeur" | base64
```

### 5. **PersistentVolumes & PersistentVolumeClaims**

Pour persister les données.



Utilisation dans un Pod :


### 6. **Ingress**

Gère le routage HTTP/HTTPS externe.

### 7. **Namespaces**

Isoler les ressources.

```bash
# Créer un namespace
kubectl create namespace monitoring

# Lister les namespaces
kubectl get namespaces

# Déployer dans un namespace spécifique
kubectl apply -f deployment.yaml -n monitoring

# Voir les ressources d'un namespace
kubectl get all -n monitoring

# Définir un namespace par défaut pour la session
kubectl config set-context --current --namespace=monitoring
```

### 8. **Labels & Selectors**

Les labels permettent d'organiser et de sélectionner les ressources.

```yaml
metadata:
  labels:
    app: backend
    environment: production
    version: v1
```

```bash
# Sélectionner par label
kubectl get pods -l app=backend

# Sélectionner avec plusieurs labels
kubectl get pods -l app=backend,environment=production

# Supprimer par label
kubectl delete pods -l app=backend
```

### 9. **ServiceMonitor (Prometheus Operator)**

Permet à Prometheus de découvrir automatiquement les endpoints à scraper.



### 10. **PrometheusRule**

Définit les règles d'alerte.

---

## 🎯 Commandes de Référence

### Docker

```bash
# Build une image
docker build -t nom-image:tag .

# Lister les images
docker images

# Supprimer une image
docker rmi nom-image:tag

# Lancer un conteneur
docker run -d -p 5000:5000 nom-image:tag

# Voir les conteneurs en cours
docker ps

# Voir tous les conteneurs
docker ps -a

# Arrêter un conteneur
docker stop <container-id>

# Supprimer un conteneur
docker rm <container-id>

# Logs d'un conteneur
docker logs <container-id>

# Shell dans un conteneur
docker exec -it <container-id> /bin/sh

# Nettoyer les ressources inutilisées
docker system prune -a
```

### Docker Compose

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f [service-name]

# Arrêter les services
docker-compose down

# Rebuild et redémarrer
docker-compose up -d --build

# Voir l'état des services
docker-compose ps

# Exécuter une commande dans un service
docker-compose exec backend sh
```

### Kubernetes - Gestion des ressources

```bash
# Appliquer une configuration
kubectl apply -f fichier.yaml

# Appliquer tous les fichiers d'un dossier
kubectl apply -f ./K8s/

# Supprimer une ressource
kubectl delete -f fichier.yaml

# Supprimer par type et nom
kubectl delete deployment backend-deployment
kubectl delete service backend-service

# Obtenir les ressources
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get ingress
kubectl get pvc
kubectl get secrets
kubectl get configmaps

# Tout voir dans un namespace
kubectl get all -n default

# Format de sortie
kubectl get pods -o wide
kubectl get pods -o yaml
kubectl get pods -o json
```

### Kubernetes - Debugging

```bash
# Décrire une ressource (détails + événements)
kubectl describe pod <pod-name>
kubectl describe service <service-name>

# Logs d'un pod
kubectl logs <pod-name>

# Logs en temps réel
kubectl logs -f <pod-name>

# Logs d'un conteneur spécifique dans un pod
kubectl logs <pod-name> -c <container-name>

# Logs précédents (après un crash)
kubectl logs <pod-name> --previous

# Shell dans un pod
kubectl exec -it <pod-name> -- /bin/sh
kubectl exec -it <pod-name> -- /bin/bash

# Copier des fichiers depuis/vers un pod
kubectl cp <pod-name>:/path/to/file ./local-file
kubectl cp ./local-file <pod-name>:/path/to/file

# Port-forward pour accéder à un service localement
kubectl port-forward service/backend-service 5000:5000
kubectl port-forward pod/<pod-name> 5000:5000

# Événements du cluster
kubectl get events --sort-by=.metadata.creationTimestamp

# Top des ressources
kubectl top nodes
kubectl top pods
```

### Kubernetes - Mise à l'échelle et mises à jour

```bash
# Scaler un deployment
kubectl scale deployment/backend-deployment --replicas=5

# Autoscaling (HPA - Horizontal Pod Autoscaler)
kubectl autoscale deployment backend-deployment --min=2 --max=10 --cpu-percent=80

# Mettre à jour l'image d'un deployment
kubectl set image deployment/backend-deployment backend=backend:v2

# Voir l'état du rollout
kubectl rollout status deployment/backend-deployment

# Historique des rollouts
kubectl rollout history deployment/backend-deployment

# Rollback à la version précédente
kubectl rollout undo deployment/backend-deployment

# Rollback à une version spécifique
kubectl rollout undo deployment/backend-deployment --to-revision=2

# Pause/Reprise d'un rollout
kubectl rollout pause deployment/backend-deployment
kubectl rollout resume deployment/backend-deployment

# Redémarrer un deployment (rolling restart)
kubectl rollout restart deployment/backend-deployment
```

### Kubernetes - Configuration

```bash
# Voir la configuration kubectl
kubectl config view

# Voir le contexte actuel
kubectl config current-context

# Lister les contextes
kubectl config get-contexts

# Changer de contexte
kubectl config use-context <context-name>

# Définir un namespace par défaut
kubectl config set-context --current --namespace=monitoring
```

### Azure CLI - AKS

```bash
# Login
az login

# Définir la subscription
az account set --subscription <subscription-id>

# Lister les clusters AKS
az aks list -o table

# Obtenir les credentials d'un cluster
az aks get-credentials --resource-group <rg-name> --name <cluster-name>

# Démarrer un cluster AKS (s'il est arrêté)
az aks start --resource-group <rg-name> --name <cluster-name>

# Arrêter un cluster AKS (économiser des coûts)
az aks stop --resource-group <rg-name> --name <cluster-name>

# Scaler les nœuds du cluster
az aks scale --resource-group <rg-name> --name <cluster-name> --node-count 3

# Mettre à jour le cluster
az aks upgrade --resource-group <rg-name> --name <cluster-name> --kubernetes-version 1.27.0

# Vérifier les versions disponibles
az aks get-versions --location eastus -o table
```

### Azure CLI - ACR

```bash
# Login à l'ACR
az acr login --name <acr-name>

# Lister les repositories
az acr repository list --name <acr-name> -o table

# Lister les tags d'un repository
az acr repository show-tags --name <acr-name> --repository backend -o table

# Supprimer une image
az acr repository delete --name <acr-name> --image backend:v1

# Vérifier l'accès AKS vers ACR
az aks check-acr --resource-group <rg-name> --name <cluster-name> --acr <acr-name>.azurecr.io

# Attacher l'ACR au cluster AKS
az aks update --resource-group <rg-name> --name <cluster-name> --attach-acr <acr-name>
```

### Minikube

```bash
# Démarrer Minikube
minikube start

# Spécifier les ressources
minikube start --cpus=4 --memory=8192 --driver=docker

# Arrêter Minikube
minikube stop

# Supprimer le cluster
minikube delete

# Statut
minikube status

# IP du cluster
minikube ip

# Dashboard
minikube dashboard

# Addons
minikube addons list
minikube addons enable ingress
minikube addons enable metrics-server

# SSH dans le nœud Minikube
minikube ssh

# Utiliser le Docker daemon de Minikube
eval $(minikube docker-env)

# Tunnel pour LoadBalancer (sur Minikube)
minikube tunnel
```

### Helm

```bash
# Ajouter un repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Mettre à jour les repositories
helm repo update

# Rechercher un chart
helm search repo prometheus

# Installer un chart
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Lister les releases
helm list -A

# Voir les valeurs d'une release
helm get values monitoring -n monitoring

# Mettre à jour une release
helm upgrade monitoring prometheus-community/kube-prometheus-stack -n monitoring

# Désinstaller une release
helm uninstall monitoring -n monitoring

# Voir l'historique d'une release
helm history monitoring -n monitoring

# Rollback d'une release
helm rollback monitoring 1 -n monitoring
```

---

## 🔧 Dépannage

### Problème : Pods en état "ImagePullBackOff"

**Cause** : Kubernetes ne peut pas télécharger l'image Docker.

```bash
# Vérifier les détails
kubectl describe pod <pod-name>

# Solutions:
# 1. Vérifier le nom de l'image
# 2. Vérifier l'accès à l'ACR
az aks check-acr --resource-group <rg> --name <cluster> --acr <acr-name>.azurecr.io

# 3. Attacher l'ACR au cluster
az aks update --resource-group <rg> --name <cluster> --attach-acr <acr-name>
```

### Problème : Pods en état "CrashLoopBackOff"

**Cause** : Le conteneur démarre puis crash immédiatement.

```bash
# Voir les logs
kubectl logs <pod-name>

# Voir les logs du conteneur précédent
kubectl logs <pod-name> --previous

# Vérifier les événements
kubectl describe pod <pod-name>

# Causes communes:
# - Erreur de configuration (variables d'environnement)
# - Erreur dans le code
# - Port déjà utilisé
# - Problème de connexion à la DB
```

### Problème : Service inaccessible

```bash
# Vérifier que le service existe
kubectl get services

# Vérifier les endpoints (doit avoir des IPs)
kubectl get endpoints <service-name>

# Si pas d'endpoints, vérifier les labels
kubectl get pods --show-labels
kubectl describe service <service-name>

# Tester depuis un pod dans le cluster
kubectl run test-pod --image=busybox --rm -it -- wget -O- http://backend-service:5000/api/tasks
```

### Problème : Permissions RBAC refusées sur AKS

**Erreur** : `User "xxx" cannot list resource "deployments"`

```bash
# Solution 1: Attribuer le rôle RBAC Cluster Admin
az role assignment create \
  --role "Azure Kubernetes Service RBAC Cluster Admin" \
  --assignee <user-id> \
  --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.ContainerService/managedClusters/<cluster-name>

# Solution 2: Rafraîchir les tokens
rm -rf ~/.kube/cache
az logout
az login
az aks get-credentials --resource-group <rg> --name <cluster> --overwrite-existing
kubelogin convert-kubeconfig -l azurecli

# Solution 3: Utiliser les credentials admin (temporaire)
az aks get-credentials --resource-group <rg> --name <cluster> --admin --overwrite-existing
```

### Problème : Ingress ne fonctionne pas

```bash
# Vérifier que l'Ingress Controller est installé
kubectl get pods -n ingress-nginx

# Sur Minikube, activer l'addon
minikube addons enable ingress

# Vérifier l'Ingress
kubectl get ingress
kubectl describe ingress <ingress-name>

# Vérifier que les services backend existent
kubectl get services

# Tester les services directement
kubectl port-forward service/backend-service 5000:5000
```

### Problème : Prometheus ne scrape pas les métriques

```bash
# Vérifier que le ServiceMonitor existe
kubectl get servicemonitor -n monitoring

# Vérifier les labels du ServiceMonitor
kubectl describe servicemonitor backend-monitor -n monitoring

# Vérifier que le service a les bons labels
kubectl get service backend-service -o yaml

# Vérifier dans Prometheus UI
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
# Aller à http://localhost:9090/targets
```

### Problème : PersistentVolumeClaim en "Pending"

```bash
# Vérifier le PVC
kubectl describe pvc <pvc-name>

# Causes communes:
# - Pas de StorageClass disponible
kubectl get storageclass

# - Pas de PersistentVolume disponible
kubectl get pv

# Sur Minikube, vérifier l'addon
minikube addons enable storage-provisioner
```

### Problème : MongoDB connexion refusée

```bash
# Vérifier le secret
kubectl get secret mongo-secret -o yaml

# Décoder le secret
kubectl get secret mongo-secret -o jsonpath='{.data.MONGO_URI}' | base64 --decode

# Vérifier que le backend peut accéder à MongoDB
kubectl exec -it <backend-pod> -- env | grep MONGO_URI

# Tester la connexion MongoDB depuis le pod
kubectl exec -it <backend-pod> -- sh
# Dans le pod:
npm install -g mongodb
mongo "mongodb+srv://..."
```

### Problème : Frontend ne peut pas appeler le Backend

```bash
# Vérifier nginx.conf dans le pod frontend
kubectl exec -it <frontend-pod> -- cat /etc/nginx/conf.d/default.conf

# Vérifier que le nom du service backend est correct
kubectl get services

# Tester depuis le pod frontend
kubectl exec -it <frontend-pod> -- wget -O- http://backend-service-aks:5000/api/tasks

# Vérifier les logs Nginx
kubectl logs <frontend-pod>
```

---

## 📈 Bonnes Pratiques

### 1. **Gestion des Images**

```bash
# Toujours utiliser des tags spécifiques (pas latest)
docker build -t myapp:v1.2.3 .

# Tag semantique
docker build -t myapp:1.2.3 .

# Tag avec le commit SHA
docker build -t myapp:${GIT_COMMIT_SHA} .
```

### 2. **Gestion des Secrets**

```bash
# Ne jamais committer les secrets dans Git
# Utiliser des Secrets Kubernetes
kubectl create secret generic api-keys \
  --from-literal=API_KEY=xxx \
  --from-literal=API_SECRET=yyy

# Ou utiliser des gestionnaires de secrets externes
# - Azure Key Vault
# - AWS Secrets Manager
# - HashiCorp Vault
```

### 3. **Resource Limits**

Toujours définir des limites de ressources :

### 4. **Health Checks**

Définir des probes pour la santé des pods :

### 5. **Labels et Annotations**

Toujours utiliser des labels descriptifs :
 
### 6. **Namespaces**

Organiser les ressources par namespace :

```bash
# Production
kubectl create namespace production

# Staging
kubectl create namespace staging

# Development
kubectl create namespace development

# Monitoring
kubectl create namespace monitoring
```

---

## 📊 Métriques Importantes à Surveiller

### Métriques Application (Backend)

```promql
# CPU utilisé par le process Node.js
rate(process_cpu_user_seconds_total{job="backend-service"}[5m])

# Mémoire utilisée (heap)
nodejs_heap_size_used_bytes / nodejs_heap_size_total_bytes

# Event Loop Lag (important pour Node.js!)
nodejs_eventloop_lag_seconds

# Handlers actifs
nodejs_active_handles_total

# Requêtes HTTP
http_request_duration_seconds
```

### Métriques Infrastructure

```promql
# CPU des Pods
sum(rate(container_cpu_usage_seconds_total{pod=~"backend.*"}[5m])) by (pod)

# Mémoire des Pods
sum(container_memory_working_set_bytes{pod=~"backend.*"}) by (pod)

# Pods disponibles
kube_deployment_status_replicas_available

# Pods en erreur
kube_pod_status_phase{phase="Failed"}
```

---

## 🎓 Résumé des Concepts Clés

### Architecture Kubernetes

1. **Cluster** : Ensemble de machines (nodes)
2. **Node** : Machine (physique ou VM) qui exécute les pods
3. **Pod** : Plus petite unité déployable, contient un ou plusieurs conteneurs
4. **Deployment** : Gère le déploiement et la mise à l'échelle des pods
5. **Service** : Expose les pods via un point d'accès stable
6. **Ingress** : Gère le routage HTTP/HTTPS externe
7. **ConfigMap** : Configuration non sensible
8. **Secret** : Données sensibles
9. **PersistentVolume** : Stockage persistant
10. **Namespace** : Isolation logique des ressources

### Flux de Requête

```
User → Ingress → Service → Pod → Container
```

### Communication Inter-Services

```
Frontend Pod → Backend Service (DNS: backend-service) → Backend Pod
```

### Workflow de Déploiement

```
1. Build Docker Image
2. Push to Registry (ACR)
3. Apply Kubernetes Manifests
4. Kubernetes pulls Image
5. Creates Pods
6. Service routes traffic to Pods
7. Ingress exposes to Internet
```

---

## 📚 Ressources Supplémentaires

### Documentation Officielle

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Azure AKS Documentation](https://docs.microsoft.com/azure/aks/)
- [Docker Documentation](https://docs.docker.com/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

### Tutorials et Guides

- [Kubernetes by Example](https://kubernetesbyexample.com/)
- [Katacoda Kubernetes](https://www.katacoda.com/courses/kubernetes)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)

### Outils Utiles

- **k9s** : Interface TUI pour Kubernetes
- **kubectx/kubens** : Changement rapide de contexte/namespace
- **Lens** : IDE Kubernetes
- **Helm** : Package manager pour Kubernetes
- **Kustomize** : Personnalisation de manifests

---

## 🎯 Checklist de Déploiement

### Avant le Déploiement

- [ ] Variables d'environnement configurées
- [ ] Secrets créés (MongoDB URI, API keys, etc.)
- [ ] Images Docker buildées et poussées vers ACR
- [ ] Namespaces créés si nécessaire
- [ ] Resource limits définis
- [ ] Health checks configurés

### Déploiement

- [ ] Apply Secrets
- [ ] Apply ConfigMaps
- [ ] Apply PersistentVolumeClaims
- [ ] Apply Deployments
- [ ] Apply Services
- [ ] Apply Ingress
- [ ] Vérifier que tous les pods sont Running
- [ ] Vérifier que les services ont des endpoints
- [ ] Tester l'accès via Ingress

### Post-Déploiement

- [ ] Monitoring configuré (Prometheus/Grafana)
- [ ] Alertes configurées
- [ ] Logs centralisés
- [ ] Backups configurés
- [ ] Documentation à jour
- [ ] Runbook pour les incidents

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne jamais exposer de secrets dans le code**
2. **Utiliser RBAC pour limiter les accès**
3. **Scaner les images pour les vulnérabilités**
4. **Mettre à jour régulièrement Kubernetes**
5. **Utiliser Network Policies pour isoler les pods**
6. **Activer Pod Security Standards**
7. **Utiliser TLS pour toutes les communications**

### Commandes de Sécurité

```bash
# Scanner une image Docker
docker scan myapp:v1

# Vérifier les permissions RBAC
kubectl auth can-i get pods
kubectl auth can-i delete deployments

# Créer un ServiceAccount
kubectl create serviceaccount my-app-sa

# Attacher un rôle
kubectl create rolebinding my-app-binding \
  --clusterrole=view \
  --serviceaccount=default:my-app-sa
```

---

## 💡 Astuces et Raccourcis

```bash
# Aliases utiles
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kl='kubectl logs'

# Voir tous les contextes
k config get-contexts

# Changer rapidement de namespace
k config set-context --current --namespace=monitoring

# Créer rapidement un pod de test
k run test --image=busybox --rm -it -- sh

# Forcer la suppression d'un pod
k delete pod <pod-name> --force --grace-period=0

# Voir les ressources consommées
k top nodes
k top pods

# Output JSON avec jq pour filtrage
k get pods -o json | jq '.items[].metadata.name'

# Watch en continu
k get pods -w
```

---

## 🎉 Conclusion

Ce projet démontre une architecture complète Full Stack MERN déployée sur Kubernetes avec :

✅ **Containerisation** avec Docker  
✅ **Orchestration** avec Kubernetes  
✅ **CI/CD** avec GitHub Actions  
✅ **Monitoring** avec Prometheus & Grafana  
✅ **Cloud** avec Azure AKS  
✅ **Sécurité** avec Secrets, RBAC, TLS  
✅ **Scalabilité** avec Deployments et Services  
✅ **Persistence** avec PVC  
✅ **Routing** avec Ingress  

---

**Auteur** : Nouhaila Lahsaoui  
**Date** : Octobre 2025  
**Version** : 1.0   

---
 