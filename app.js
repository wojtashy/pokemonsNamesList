/**
 * Główny url do całego API
 */
const apiUrl = `https://pokeapi.co/api/v2/`;

/**
 * Lista endpointów z jakich korzystamy w obrębie aplikacji
 * Robimy tak, żeby nie powtarzać tych samych stringów w obrębie całej aplikacji,
 * skoro możemy użyć zmiennej/obiektu to to róbmy :)
 */
const endpoints = {
    list: apiUrl + "pokemon", // https://pokeapi.co/api/v2/pokemon
};

/**
 * Funkcja pobiera wszystkie pokemony
 * Nazwa funkcji jest wg. żargonu 'self-explanatory'
 *
 * Dodatkowo robi tylko jedną konkretną rzecz - pobiera wszystkie pokemony z API
 *
 * Bardzo polecam poznać pierwszy akronim z SOLID https://pl.wikipedia.org/wiki/SOLID_(programowanie_obiektowe)
 * 
 * @return {Promise<any>}
 */
function fetchAllPokemons() {
    // Fajny miałeś pomysł z tym rekursywnym wywoływaniem kolejnych stron,
    // ale dużo łatwiej dodać do url parametr limit i ustawić na -1
    // Nie ma tego w dokumentacji, ale tak na czuja ustawiłem na -1 i okazuje się,
    // że zwracane są wtedy wszystkie pokemony od razu :D
    // Dużym problemem w Twoim skrypcie było to, że wykonywało się mnóstwo requestów 1 po drugim,
    // co zajmowało baaardzo dużo czasu zanim załadowała się cała lista :(
    const url = endpoints.list + "?limit=-1"; // https://pokeapi.co/api/v2/pokemon?limit=1

    // Chcemy żeby zwrócone były elegancko wszystkie pokemony już jako lista
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.results);
}

/**
 * Nazwa funkcji jest trochę długa, ale wyjaśnia dosłownie co robi
 *
 * @param {Array} data
 * 
 * @return void
 */
function buildOptionsFromPokemonsList(data) {
    // Tak jeszcze dodam, że w czystym js id lepiej pisać snake_case
    const selectElement = document.getElementById("namesList");

    data.forEach((pokemon) => {
        // Opcję można też tak stworzyć
        const option = new Option(
            pokemon.name, // Text
            pokemon.url, // Value
            false, // Czy domyślnie zaznaczony
            false // Czy aktualnie zaznaczony
        );

        // I appendujemy po prostu :)
        selectElement.append(option);
    });
}

/**
 * Nie możemy zapomnieć o takich konstrukcjach
 *
 * JS może się załadować asynchronicznie lub z pamięci podręcznej przeglądarki.
 * Nie mamy zatem pewności, że całe drzewo DOM będzie już załadowane.
 *
 * Żeby tego uniknąć możemy jak w tym przypadku nasłuchiwać zdarzenia load
 * na obiekcie dokumentu i dopiero wtedy wykonywać wszelkie skrypty, które manipulują
 * drzewem DOM (a 90% funkcji w aplikacjach js to robi)
 */
window.addEventListener("load", () => {
    /**
     * Dzięki takiej konstrukcji nazw funkcji możemy dalej pisać kod, który sam się dokumentuje,
     *
     * Dosłownie znaczy to pobierzWszystkiePokemony.potem(zbudujOpcjeZListyPokemonów)
     */
    fetchAllPokemons().then(buildOptionsFromPokemonsList);
});
// _________________________________________________________________________________________


//funkcja do wyświetlania informacji o wybranym pokemonie
function showMore(name) {
    if (name===false) {
        var chosen = document.getElementById("namesList").value;
    }
    else {

        var chosen = 'https://pokeapi.co/api/v2/pokemon/' + document.querySelector(`.favourite p:nth-of-type(${parseInt(name)})`).id;

    }

    fetch(chosen)
        .then(data => data.json())
        .then(function (data) {


            document.querySelector('.loading').classList.add('spin');

            document.getElementById("nameLabel").innerText = data.name;
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
            if (localStorage.getItem(document.getElementById("nameLabel").innerHTML.toLocaleLowerCase()) === null) {
                document.getElementById("unFavIcon").style.display = "none";
                document.getElementById("favIcon").style.display = "block";
            } 
            else {
                document.getElementById("unFavIcon").style.display = "block";
                document.getElementById("favIcon").style.display = "none";
            }
        })

}
function add_favouritve() {
    const name = document.getElementById('nameLabel').innerHTML.toLowerCase();
    const url = 'https://pokeapi.co/api/v2/pokemon/' + name;
    const fav = new favourite(name, url);
    document.getElementById("unFavIcon").style.display = "block";
    document.getElementById("favIcon").style.display = "none";
    render_favourite_item(name);
    favourite_list_id_update();
}

function remove_favourite() {
    localStorage.removeItem(document.getElementById('name').innerHTML.toLowerCase());
    document.getElementById("unFavIcon").style.display = "none";
    document.getElementById("favIcon").style.display = "block";
    const p = document.getElementById(document.getElementById("nameLabel").innerHTML.toLowerCase());
    document.querySelector('.favourite').removeChild(p);
    favourite_list_id_update();

}
 function favourite_list_id_update(){
    let favourite_items = document.querySelectorAll(".favourite p");

    for(var i=1;i<=favourite_items.length;i++){
        favourite_items[i].setAttribute("onclick", `showMore(${i+1})`);
    }
 }
function favourite(name, url) {
    localStorage.setItem(name, url);

}
var list_is_rendered = false;
var list_item_number=0;
function render_favourite_item(name) {
    const favourite_list = document.querySelector('.favourite');
    const favourite_item = document.createElement("p");
    favourite_item.innerHTML = name;
    favourite_item.id = name;
    favourite_item.number = list_item_number;
    list_item_number += 1;
    favourite_item.setAttribute("onclick", `showMore(${favourite_item.number})`);
    favourite_list.append(favourite_item);

}
var list_is_visible = false;
function toggle_fav_list(){
    list_is_visible ? document.querySelector(".favourite").style.left = "-100vw" :document.querySelector(".favourite").style.left = "3vw";
    list_is_visible = !list_is_visible;
}
function render_favourite_list() {
    if (!list_is_rendered) {
        const key = Object.keys(localStorage);
        for (i = 0; i < key.length - 1; i++) {
            render_favourite_item(key[i]);
        }
        
    }
    else{
        
    }
    list_is_rendered = true;
    toggle_fav_list();
    favourite_list_id_update();
}