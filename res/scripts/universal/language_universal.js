exports.get = (id, lang) => {
    if(lang == "fr") {
        return getFr(id)
    }
    else {
        return getFr(id)
    }
}

getFr = (id) => {
    switch(id) {
        case "will_be_redirected_to_chevrofr_for_log_in":
            return "Veuillez vous connecter avec votre compte CHEVRO."
        case "no_note":
            return "Vous n'avez aucune note..."
        case "api_inaccessible":
            return "L'api est inaccessible..."
        case "note_does_not_exist_or_not_authorized":
            return "Cette note n'existe pas ou vous n'êtes pas autorisé à y accéder."
        case "book_does_not_exist_or_not_authorized":
            return "Ce book n'existe pas ou vous n'êtes pas autorisé à y accéder."
        case "nameless":
            return "Sans nom"
        case "start_writing_something_incredible":
            return "Commencez à écrire quelque chose d'incroyable !"
        case "settings":
            return "Paramètres"
        case "sign_out":
            return "Se déconnecter"
        case "no_contributors":
            return "Aucun contributeurs"
        case "note_off":
            return "note de"
        case "deleted":
            return "Supprimé(e)"
        case "add_note":
            return "Ajouter une note"
        case "log_in":
            return "Connexion"
        case "my_notes":
            return "Mes notes"
        case "characters":
            return "caractères"
        case "synchronized_notes_application":
            return "Application de notes synchronisées"
        case "your_notes_on_all_your_devices":
            return "Retrouvez vos notes sur tous vos appareils"
        case "minimalist_interface_markdown_rendering":
            return "Interface minimaliste et rendu Markdown"
        case "share_notes_with_friends":
            return "Partagez vos notes et laissez vos amis les éditer"
        case "choose_a_book":
            return "Choisir un livre de notes"
        case "no_one":
            return "Aucun"
        case "my_books":
            return "Mes livres"
        case "no_notes_for_this_book":
            return "Aucune notes pour ce livre"
        case "delete_book_or_notes_and_book":
            return "Voulez-vous juste supprimer ce livre ou supprimer aussi toutes les notes qu’il comporte ?"
        case "delete_only_book":
            return "Ce livre"
        case "delete_book_and_notes":
            return "Ce livre et ses notes"
        case "please_wait_while_saving_your_note":
            return "Veuillez patienter pendant la sauvegarde de votre note"
        case "cant_autosave_note":
            return "Impossible d'effectuer une sauvegarde de votre note. Vérifiez que vous êtes connecté à internet."
    }
}