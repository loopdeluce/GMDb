document.addEventListener('DOMContentLoaded', init)

function init(){
    getMovies();
    addMovieReviewEvent();
    addMovieRandomizerEvent();
    addResetEvent();
};

function getMovies() {
    fetch('https://ghibliapi.herokuapp.com/films')
    .then(res => res.json())
    .then(data => iterateMovies(data))
};

function iterateMovies(movies){
    movies.forEach(movie => {
        displayMovie(movie) //Add Movie to the sidebar
        //postMovieReference(movie) //Create the user JSON db
    })
};

//Adding Movie to sidebar
function displayMovie(movie){
    const movieList = document.getElementById('to-watch-movies')
    const movieListItem = document.createElement('li')
    movieListItem.innerHTML = movie.title
    movieListItem.dataset.num = movie.id

movieListItem.addEventListener('click', getDetails)
movieList.appendChild(movieListItem)
}

function getDetails(event){
    const movieId = event.target.dataset.num
    fetch(`https://ghibliapi.herokuapp.com/films/${movieId}`)
    .then(res => res.json())
    .then(data => displayMovieDetails(data))
}


function displayMovieDetails(movie){
    document.getElementById('movie-title').innerHTML = movie.title
    document.getElementById('movie-title').dataset.num = movie.id
    document.getElementById('japanese-title').innerHTML = movie.original_title
    document.getElementById('movie-poster').src  = movie.image
    document.getElementById('director').innerHTML = `Director: ${movie.director}`
    document.getElementById('release-date').innerHTML = `Release date: ${movie.release_date}`
    document.getElementById('run-time').innerHTML = `Run Time: ${movie.running_time}`
    document.getElementById('movie-description').innerHTML = movie.description

       // getMovieReview(movie.id)
    }


//Create the user JSON db
// function postMovieReference(movie){
//     console.log(movie);

//     const newMovieForUser = {
//         movieId: movie.id,
//         watched: null,
//         rating: null,
//         comment: [],
//     }

    // fetch(`http://localhost:3000/movies`, {
    //     method: 'POST',
    //     headers: {
    //         "content-type": "application/json",
    //         "Accept": "application/json"
    //     },
    //     body: JSON.stringify(newMovieForUser)
    // })
// };


//Add submit event for review form
function addMovieReviewEvent(){

};

//Add click event to begin randomize leftover movies
function addMovieRandomizerEvent(){

};

//Add click event to begin chain reaction of reseting all user inputted data
function addResetEvent(){

};