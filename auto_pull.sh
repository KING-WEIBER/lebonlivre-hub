#!/bin/bash
# auto_pull.sh
# Script pour mettre à jour automatiquement la branche main depuis le dépôt distant

# Chemin vers ton projet local (à adapter)
cd "/c/Users/hp/lebonlivre-hub" || exit

# Boucle infinie
while true; do
    echo "Vérification des mises à jour..."
    
    # Récupère les dernières infos du dépôt distant
    git fetch origin

    # Compare HEAD local et distant
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Des changements détectés ! Pull en cours..."
        git pull origin main
        echo "Mise à jour terminée."
    else
        echo "Aucun changement."
    fi

    # Attendre 60 secondes avant la prochaine vérification
    sleep 60
done