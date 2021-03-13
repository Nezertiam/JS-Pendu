// Initialisation des variables
let form = document.querySelector("form")
let divMot
let alphabet
let elementGameover
let mot = ""
let nbEchecs = 0
// variable permettant de voir si on a gagné, perdu ou si le jeu est encore en cours
// 2 = victoire
// 1 = défaite
// 0 = valeur initiale = jeu en cours
let gameover = 0

form.addEventListener("submit", (event) => {
    event.preventDefault()
    init()
    definirMot()
    genererAlphabet()
})


// Fonction utilisée uniquement pour la première génération du DOM
function init(){
    // on définit la valeur de mot grâce à celle entrée dans le formulaire.
    // Ce dernier n'accepte que les mots de plus de 3 lettres et moins de 20
    mot = document.querySelector("#mot").value
    str = "<div id='potence'></div>"
    str+= "<div id='motCache'></div>"
    str+= "<section id='alphabet'></section>"
    str+= "<section id='gameover' class='dispnone'><p id='textGameover'></p></section>"

    document.querySelector("#wrapper").innerHTML = str

    divMot = document.querySelector("#motCache")
    alphabet = document.querySelector("#alphabet")
    elementGameover = document.querySelector("#gameover")
}


// Fonction qui permet de récupérer le mot saisit pour en faire le mot à deviner et 
// l'affiche sous forme masquée.
function definirMot(){
    let str = ""

    // on défnit le mot en majuscule afin d'éviter les erreurs de sensibilité à la casse
    mot = mot.toUpperCase()

    for(index = 0; index < mot.length; index++){
        str+= "<div id='lettre" + index + "' class='lettreADeviner'>_</div>"
    }
    divMot.innerHTML = str
}

// Fonction pour générer un alphabet cliquable permettant de jouer en sélectionnant la
// lettre désirée.
function genererAlphabet(){
    let str = ""

    // boucle qui génère 26 divs dans la div#alphabet. Chaque div comprendra une lettre
    // écrite dedans grâce à son code. 65 pour "A", 90 pour "Z"
    for(l = 65; l <= 90; l++){
        str+= "<div id='" + String.fromCharCode(l) + "' class='lettre'>" + String.fromCharCode(l) + "</div>"
    }
    alphabet.innerHTML = str

    // cible les lettres de l'alphabet
    let lettres = alphabet.querySelectorAll(".lettre")
    // puis leur définit un event click
    for(const lettre of lettres){
        lettre.addEventListener("click", testLettre)
    }
}

// Fonction pour tester si la lettre sélectionnée fait partie du mot caché. Si oui, révèle
// la lettre dans le mot. Si elle se trouve plusieurs fois dans le mot, toutes ses
// récurences s'afficheront également. Un compteur de fautes y est présent ce qui permet
// de déterminer l'avancée du pendu. Retire la possibilité de cliquer deux fois sur la
// même lettre.
function testLettre(){

    let lettreAlphabet = this.innerHTML // cible la lettre sur laquelle on clique
    // initialisation d'un compteur qui s'incrémente s'il découvre une récurence de la lettre
    // dans le mot à deviner
    let count = 0  
    // une boucle qui cible chaque lettre masquée grâce à son index
    for(i = 0; i <= mot.length; i++){
        // exemple : #lettre2 est la troisième div du mot à deviner "V O [_] _ U R _"
        caseATester = document.querySelector("#lettre" + i)
        // On regarde ensuite que le contenu de la div (sa lettre) sur laquelle on a cliqué 
        // correspond a la lettre en index i du mot à deviner.
        if(lettreAlphabet === mot[i]){  
            // s'il y a correspondance, #lettrei remplace son underscore (_) par la lettre
            // sur laquelle on a cliqué
            caseATester.innerHTML = lettreAlphabet
            // on incrémente ensuite count
            count++
            // on boucle à nouveau pour voir s'il reste encore des cases non découvertes
            let lettresADeviner = document.querySelectorAll(".lettreADeviner")
            // toujours réinitialiser cette variable au début. Ce serait dommage de récupérer
            // la valeur des tests précédents...
            let underscoreCount = 0
            // On boucle sur la nodeList qui contient toutes les lettres afin de compter
            // combien sont encore masquées (div possèdant le caractère "_" au lieu de la lettre)
            for(const lettreADeviner of lettresADeviner){
                if(lettreADeviner.innerHTML == "_"){
                    underscoreCount++
                    console.log(underscoreCount)
                }
            }
            // si le compteur d'underscore est toujours supérieur à 0, c'est qu'il
            // y a toujours une ou plusieurs lettres à trouver. On remet le compteur
            // à 0 pour la prochaine fois qu'on devra tester s'il reste des lettres à
            // trouver. Spoiler, c'est au prochain click de l'utilisateur...
            if(underscoreCount !== 0){
                underscoreCount = 0
            }
            else{
                // Evidemment, si le compteur = 0, y'a plus de lettre à trouver donc
                // c'est gagné !
                console.log(underscoreCount)
                gameover = 2 // 2 = victoire
                endgame()
            }
        }
    }
    // s'il n'y a pas eu de correspondance, count n'a pas pu s'incrémenter et vaut alors 0
    // c'est grâce à cela qu'on peut déterminer si le joueur a choisi une mauvaise lettre
    // et si c'est le cas, son compteur d'échec s'incrémente pour chaque lettre fausse.
    if(count === 0){
        nbEchecs++
        document.querySelector(":root").style.setProperty("--pendu", "url(img/etp" + nbEchecs + ".png)")
        if(nbEchecs === 10){
            gameover = 1    // 1 = défaite
            endgame()
        }
    }
    this.classList.add("clique") // permet de rajouter du style à une lettre cliquée

    // permet de supprimer le fonctionnement d'un lettre cliquée
    this.removeEventListener("click", testLettre)
}

function endgame(){
    elementGameover.classList.remove("dispnone")
    // on cible la balise p qui contiendra le message de gameover
    let p = document.querySelector("#textGameover")
    if(gameover === 1){
        p.innerHTML = "Perdu ! Le mot à deviner était : <br><br>" + mot + "<br><br><br>Cliquez pour rejouer !"
    }
    else{
        p.innerHTML = "Bien joué ! Vous avez réussi à deviner le mot caché !<br><br>Cliquez pour rejouer !"
    }
    elementGameover.addEventListener("click", reset)
}


// fonction qui réinitialise les variables et génère un nouveau DOM
function reset(){
    mot = ""
    nbEchecs = 0
    gameover = 0
    genererDOM()
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        mot = document.querySelector("#mot").value
        definirMot()
        genererAlphabet()
        form.parentElement.removeChild(form)
    })
}




// LA FONCTION ULTIME POUR GENERER UN DOM TOUT NEUF !!! I AM GOD !
// Mouais, après réflexion... modifier l'HTML revient à le faire une deuxième fois ici...
// sauf s'il y a un écran d'accueil qui n'apparait qu'une fois. Auquel cas, cette fonction serait
// moins encombrante ! EDIT : Je crois que je m'en sers bien comme il faut ! Le pendu marche du tonnerre !
function genererDOM(){
    let str = "<form>"
    str+= "<h1>PENDU JS</h1>"
    str+= "<h2>Veuillez saisir un mot à faire deviner</h2>"
    str+= "<input id='mot' type='text' pattern='[A-Za-z]{3,20}' title='Uniquement charactères alphabétiques sans accents. 20 lettres max' placeholder='Saisir mot'>"
    str+= "<input id='send' type='submit' value='COMMENCER'>"
    str+= "</form>"
    str+= "<div id='potence'></div>"
    str+= "<div id='motCache'></div>"
    str+= "<section id='alphabet'></section>"
    str+= "<section id='gameover' class='dispnone'><p id='textGameover'></p></section>"

    document.querySelector("#wrapper").innerHTML = str

    form = document.querySelector("form")
    divMot = document.querySelector("#motCache")
    alphabet = document.querySelector("#alphabet")
    elementGameover = document.querySelector("#gameover")
    form = document.querySelector("form")
    document.querySelector(":root").style.setProperty("--pendu", "url(img/etp0.png)")
}
