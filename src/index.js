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
        postMovieReference(movie) //Create the user JSON db
    })
};

//Adding Movie to sidebar
function displayMovie(movie){

};

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