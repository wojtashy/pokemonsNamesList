var nextUrl = `https://pokeapi.co/api/v2/pokemon/`;
function createList(nextUrl){
fetch(nextUrl)
.then(res => res.json())
.then(data => {
    console.log(data.next)
    data.next === null ? getNames(data,true) : getNames(data,false)

} )
}
 var pokemonsNames=[];
var namesList = null;
var option;
function getNames(date,isLast){
    pokemons = date.results;
    pokemonsNames += pokemons.map(element=>{
        return(
            element.name
        )
    })
    if(isLast){
        namesList === null ? namesList = document.getElementById('namesList') : null
        pokemonsNames  = pokemonsNames.split(',');
        for(i=0;i<=pokemonsNames.length;i++){
            
            option = document.createElement("option");
            option.innerHTML = pokemonsNames[i];
            namesList.appendChild(option) 
        }}
    else{
        createList(date.next)
    }
    }
createList(`https://pokeapi.co/api/v2/pokemon/`);
