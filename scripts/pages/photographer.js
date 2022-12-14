async function getData() {
    const url = 'data/photographers.json'
    return await fetch(url)
        .then(res => res.json())
        .then(data => data)
        .catch(error => console.log("erreur: " + error))
}


async function displayPhotographers(photographer) {
    const photographerModel = photographerMediaFactory(photographer); //Envoi data photogrpaher dans Factories>media
    photographerModel.getPhotographerCardDOM();
}


const mediasSection = document.querySelector(".media_section");
const slides = document.querySelector('.slides')
const selectDropdown = document.querySelector('#selectDropdown')
const titleFilters = document.querySelector('#title')
const dateFilters = document.querySelector('#date')
const popularFilters = document.querySelector('#popular')

// Filtres
function sort_array_by(medias, name) {
    mediasSection.innerHTML = ""
    slides.innerHTML = ""
    if (name === "likes") {
        medias.sort((p1, p2) => (p1[name] < p2[name]) ? 1 : (p1[name] > p2[name]) ? -1 : 0)
    } else {
        medias.sort((p1, p2) => (p1[name] > p2[name]) ? 1 : (p1[name] < p2[name]) ? -1 : 0)
    }

    return medias
}

async function displayMedia(medias, likes) {
    if (selectDropdown.textContent === '') {
        sort_array_by(medias, 'likes')
        selectDropdown.textContent = "Popularit√©"
        popularFilters.style.display = 'none'
    }
    // Filtres
    titleFilters.addEventListener("click", () => {
        let array = sort_array_by(medias, "title")
        selectDropdown.textContent = "Titre"
        displayMedia(array, likes)
        titleFilters.style.display = 'none'
        popularFilters.style.display = 'block'
        dateFilters.style.display = 'block'

    })
    dateFilters.addEventListener("click", () => {
        let array = sort_array_by(medias, "date")
        selectDropdown.textContent = "Date"
        displayMedia(array, likes)
        dateFilters.style.display = 'none'
        titleFilters.style.display = 'block'
        popularFilters.style.display = 'block'
    })
    popularFilters.addEventListener("click", () => {
        let array = sort_array_by(medias, 'likes')
        selectDropdown.textContent = "Popularit√©"
        displayMedia(array, likes)
        popularFilters.style.display = 'none'
        dateFilters.style.display = 'block'
        titleFilters.style.display = 'block'
    })


    medias.forEach((media) => { //boucle s√©paration media via tableau pr√© trier en amont

        let indexMedia = null
        indexMedia = medias.indexOf(media)
        const mediaModel = mediaFactory(media, likes, indexMedia); //Envoi data media dans Factories>media
        //Creation du Dom dans mediaSection 
        const mediaCardDOM = mediaModel.getMediaCardDOM();
        mediasSection.appendChild(mediaCardDOM);
    });
}

//Gestion des donn√©e
async function init() {
    const { photographers, media } = await getData(); //R√©cuperation Data
    const catchUrl = new URL(window.location) //R√©cuperation Url 
    const getParams = new URLSearchParams(catchUrl.search)
    const targetParams = getParams.get("id") //R√©cuperation Id dans Url
    const findPhotographer = photographers.find((e) => targetParams == e.id) //R√©cuperation Utilisateur via IdUrl
    const findMedia = [] //Creation tableau pour tri m√©dia en fonction de photogrpaherId et Id url
    const allLikes = [] //R√©cuperation de tout les likes pour les additionn√©s
    let total = 0
    //Boucle recuperation m√©dia
    media.forEach((e) => {
        if (e.photographerId == targetParams) {
            findMedia.push(e)
            allLikes.push(e.likes)
            total += e.likes //Sommes de touts les likes
        }
    })

    //Envoi data dans les diff√©rent display
    displayMedia(findMedia, total);
    displayPhotographers(findPhotographer)
}

init();


