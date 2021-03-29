
const apiUrl = `https://pokeapi.co/api/v2/`;

const endpoints = {
    list: apiUrl + "pokemon", // https://pokeapi.co/api/v2/pokemon
};

function fetchAllPokemons() {
    const url = endpoints.list + "?limit=-1"; // https://pokeapi.co/api/v2/pokemon?limit=1
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.results);
}

function buildOptionsFromPokemonsList(data) {
  
    const selectElement = document.getElementById("namesList");

    data.forEach((pokemon) => {
    
        const option = new Option(
            pokemon.name, // Text
            pokemon.url, // Value
            false, 
            false 
        );


        selectElement.append(option);
    });
}


window.addEventListener("load", () => {

    fetchAllPokemons().then(buildOptionsFromPokemonsList);
});
function showMore(name) {
    if (!name) {
        var chosen = document.getElementById("namesList").value;
    }
    else {

        var chosen = 'https://pokeapi.co/api/v2/pokemon/' + name.innerHTML;
    }


    fetch(chosen)
        .then(data => data.json())
        .then(function (data) {


            document.querySelector('.loading').classList.add('spin');

            document.getElementById("name").innerText = data.name;
            document.getElementById("abilitiesData").innerHTML = data.abilities.length;
            document.getElementById("baseXpData").innerHTML = data.base_experience;
            document.getElementById("heightData").innerHTML = data.height;
            document.getElementById("weightData").innerHTML = data.weight;
            document.getElementById("movesData").innerHTML = data.moves.length;
            document.getElementById("itemsData").innerHTML = data.held_items.length;

            document.getElementById("baseHpData").innerHTML = data.stats[0].base_stat;
            document.getElementById("attackData").innerHTML = data.stats[1].base_stat;
            document.getElementById("defenseData").innerHTML = data.stats[2].base_stat;
            document.getElementById("specialAttackData").innerHTML = data.stats[3].base_stat;
            document.getElementById("specialDefenseData").innerHTML = data.stats[4].base_stat;
            document.getElementById("speedData").innerHTML = data.stats[5].base_stat;


        })
        .then(() => {
            document.querySelector('.loading').classList.remove('spin');
            document.querySelector('.about').style.right = "3vw";
            if (localStorage.getItem(document.getElementById("name").innerHTML.toLocaleLowerCase()) === null) {
                document.getElementById("unFavIcon").style.zIndex = -100;
            } 
            else {
                document.getElementById("unFavIcon").style.zIndex = 100;
            }
        })

}
function add_favouritve() {
    const name = document.getElementById('name').innerHTML.toLowerCase();
    const url = 'https://pokeapi.co/api/v2/pokemon/' + name;
    const fav = new favourite(name, url);
    document.getElementById("unFavIcon").style.zIndex = 100;
    render_favourite_item(name);
}

function remove_favourite() {
    localStorage.removeItem(document.getElementById('name').innerHTML.toLowerCase());
    document.getElementById("unFavIcon").style.zIndex = -100;
    const p = document.getElementById(document.getElementById("name").innerHTML.toLowerCase());
    document.querySelector('.favourite').removeChild(p);
}

function favourite(name, url) {
    localStorage.setItem(name, url);

}
var list_is_rendered = false;

function render_favourite_item(name) {
    const favourite_list = document.querySelector('.favourite');
    const favourite_item = document.createElement("p");
    favourite_item.innerHTML = name;
    favourite_item.id = name;
    favourite_item.setAttribute("onclick", `showMore(${favourite_item.innerHTML})`);
    favourite_list.append(favourite_item);

}
function render_favourite_list() {
    if (!list_is_rendered) {
        const key = Object.keys(localStorage);
        for (i = 0; i < key.length - 1; i++) {
            render_favourite_item(key[i]);
        }
        list_is_rendered = true;
    }
    document.querySelector(".favourite").style.left = "3vw";
}
