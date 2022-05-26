
//Adding DB

document.addEventListener('DOMContentLoaded', ()=>{
    fetch('https://ghibliapi.herokuapp.com/movies')
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
