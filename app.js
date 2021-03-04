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
