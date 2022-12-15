async function getData() {
    const url = 'data/photographers.json'
    return await fetch(url)
    .then(res => res.json())
    .then(data => data)
    .catch(error=> console.log("erreur: " + error))
}


async function  displayPhotographers(photographer) {
    const photographerModel = photographerFactory(photographer); //Envoi data photogrpaher dans Factories>media
    photographerModel.getPhotographerCardDOM();
};



async function displayMedia(media, likes) {
    const mediasSection = document.querySelector(".media_section");
    media.forEach((media) => { //boucle séparation media via tableau pré trier en amont
        const mediaModel = mediaFactory(media, likes); //Envoi data media dans Factories>media
        //Creation du Dom dans mediaSection 
        const mediaCardDOM = mediaModel.getMediaCardDOM();
        mediasSection.appendChild(mediaCardDOM);
    });
};
// Gestion Like
function like(event) {
    const target = event.currentTarget;
    const targetHeart = target.querySelector('#targetHeart')
    if ( !target.checked ) { //Incrementation
        target.checked = true
        targetHeart.className = " fa-solid fa-heart fs3 primary anim_heart"
        const newLike =  parseInt(target.textContent)+1
        target.querySelector("#btn_like").textContent = newLike;
        
    }else{ //Décrementation
        target.checked = false
        targetHeart.className = " fa-regular fa-heart fs3 primary anim_heart"
        const newLike =  parseInt(target.textContent)+1
        target.querySelector("#btn_like").textContent = newLike;
    }
    updateTotalLikes();
}
async function updateTotalLikes() {
    const likes = document.querySelectorAll("#btn_like");
    const totalLikesNumber = document.querySelector(".allLikes");

    let totalLikes = 0;
    likes.forEach( like => totalLikes += parseInt(like.textContent) )

    totalLikesNumber.textContent = totalLikes + " ";
}

//Gestion des donnée
async function init() {
    const { photographers, media } = await getData(); //Récuperation Data
    const catchUrl = new URL(window.location) //Récuperation Url 
    const getParams = new URLSearchParams(catchUrl.search) 
    const targetParams = getParams.get("id") //Récuperation Id dans Url
    const findPhotographer = photographers.find((e) => targetParams == e.id) //Récuperation Utilisateur via IdUrl
    const findMedia = [] //Creation tableau pour tri média en fonction de photogrpaherId et Id url
    const allLikes = [] //Récuperation de tout les likes pour les additionnés
    let total = 0
    //Boucle recuperation média
    media.forEach(e => {
        if(e.photographerId == targetParams){
            findMedia.push(e)
            allLikes.push(e.likes)
            total += e.likes //Sommes de touts les likes
        }
    })
    
    //Envoi data dans les différent display
    displayMedia(findMedia, total);
    displayPhotographers(findPhotographer)
};

init();