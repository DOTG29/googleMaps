let maCarte = null;
let marker = null;
let villes = [];

const newAdress = (adress,codePostal) => {
    let url = `https://api-adresse.data.gouv.fr/search/?q=${adress}&postcode=${codePostal}`

    fetch(url)
    .then((response) =>
      response.json().then((data) => {
        console.log(data);
        let lat = data.features[0].geometry.coordinates[1];
        let lon = data.features[0].geometry.coordinates[0];
        createMap([lat,lon])
        console.log(villes);
        if(villes.length >= 2){
            const distance = Math.sqrt((villes[0][0] - villes[1][0]) ** 2 + (villes[0][1] - villes[1][1]) ** 2) * 100;
            document.querySelector("#km").innerHTML += `<h2>${distance.toFixed(2)}km entre les deux adresses</h2>`;
        }
      })
    )
    .catch((error) => console.log("Error : " + error));
};

let searchCodePostal = document.querySelector("#searchCodePostal");
let searchAdresse = document.querySelector("#searchAdresse");
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  newAdress(searchAdresse.value, searchCodePostal.value);
  searchAdresse.value = "";
  searchCodePostal.value = "";
});

function createMap(coor) {
    if (maCarte) {
        maCarte.setView(coor, 11)
        marker = L.marker(coor).addTo(maCarte);
        villes.push(coor);
    } else {
        maCarte = L.map('map').setView(coor, 11);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(maCarte);
        marker = L.marker(coor).addTo(maCarte);
        villes.push(coor);
    }
}
