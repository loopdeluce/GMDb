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
        //postMovieReference(movie) //Create the user JSON db - only needs to be created once
    })
};

//Adding Movie to sidebar
function displayMovie(movie){

};

//Create the user JSON db
//  function postMovieReference(movie){
//      console.log(movie);

//     const newMovieForUser = {
//         id: movie.id,
//         watched: null,
//         rating: null,
//         comment: [],
//     }

//     fetch(`http://localhost:3000/movies`, {
//         method: 'POST',
//         headers: {
//             "content-type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify(newMovieForUser)
//     })
//  };

function getMovieReview(movieId) {
    fetch(`http://localhost:3000/movies/${movieId}`)
    .then(resp => resp.json())
    .then(data => {
        displayReview(data);
    })
};


//Add submit event for review form
function addMovieReviewEvent(){
    const form = document.getElementById('user-review');
    form.addEventListener('submit', parseReview)
};

function parseReview(event){
    event.preventDefault();

    // const movieTitle = document.getElementById('');
    // const movieId = movieTitle.dataset.num.textContent;
    const movieId = "12cfb892-aac0-4c5b-94af-521852e46d6a"

    let rating = event.target.rating.value;
    let comment = event.target["new-comment"].value;

    if (rating === '') {
        rating = 'NR';
    }

    if (comment === '') {
        comment = null;
    }

    patchReview(rating, comment, movieId);
}

function patchReview(rating, comment, movieId) {
    const review = {
        rating: rating,
        comment: comment
    }

  fetch(`http://localhost:3000/movies/${movieId}`, {
    method: "PATCH",
    headers: {
        "content-type": "application/json",
        "Accept": "application/json"
        },
    body: JSON.stringify(review)
    } 
  )
  .then(resp => resp.json())
  .then(data => {
      //console.log(data);
      displayMovieRating(data);
      displayReview(data);
  })
};

function displayMovieRating(data){};

function displayReview(data){};


//Add click event to begin randomize leftover movies
function addMovieRandomizerEvent(){

};

//Add click event to begin chain reaction of reseting all user inputted data
function addResetEvent(){

};