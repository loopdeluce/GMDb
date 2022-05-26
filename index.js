
//Adding DB

document.addEventListener('DOMContentLoaded', ()=>{
    fetch('http://localhost:3000/characters')
    .then(res => res.json())
    .then(data => displayMovies(data))

})


function displayMovies(movies){
    movies.forEach(movie =>{
        displayMovie(movie)
    })
}

//Adding Movies to sidebar

function displayCharacter(movie){

}
