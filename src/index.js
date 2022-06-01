document.addEventListener('DOMContentLoaded', init)

function init(){
    getMovies();
    addMovieReviewEvent();
    addMovieRandomizerEvent();
    addResetEvent();
    //pickRandomMovie();
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
    getMovieReview(movie.id)
       
}


//Create the user JSON db
//  function postMovieReference(movie){

//     const newMovieForUser = {
//         id: movie.id,
//         movieName: movie.title,
//         watched: false,
//         rating: 'NR',
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
        displayFullReview(data);
    })
};

function displayFullReview(data){
    const rateSpan = document.getElementById('rating-span');
    rateSpan.textContent = data.rating;
    const commentArrayLength = data.comment.length;
    removeComments();

    if (commentArrayLength > 0) {
        data.comment.forEach((acomment) => displayComments(acomment));
    };
};

function removeComments() {
    const comments = Array.from(document.getElementById('current-comments').children);
    comments.forEach((comment)=> comment.remove());
}

function displayComments(comment) {
    const ul = document.getElementById('current-comments');
    const li = document.createElement('li');

    li.textContent = comment;
    ul.append(li);
}

//Add submit event for review form
function addMovieReviewEvent(){
    const form = document.getElementById('user-review');
    form.addEventListener('submit', parseReview);
    //form.reset();
};

function parseReview(event){
    event.preventDefault();

    const movieTitle = document.getElementById('movie-title');
    const movieId = movieTitle.dataset.num;

    let newRating = event.target.rating.value;
    let newComment = event.target["new-comment"].value;

    fetch(`http://localhost:3000/movies/${movieId}`)
    .then(resp => resp.json())
    .then((data) => {
        const existingComments = data.comment
        const existingRating = data.rating
        patchReviewComment(newRating, existingRating, newComment, existingComments, movieId)
    })
}

function patchReviewComment(newRating, existingRating, newComment, existingComments, movieId) {
    if (newComment !== '') {
        existingComments.push(newComment);
    };

    const comments = {comment: existingComments};

    fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json"
            },
        body: JSON.stringify(comments)
        } 
    )
    .then(resp => resp.json())
    .then(data => patchRating(newRating, existingRating, movieId))
};

function patchRating(newRating, existingRating, movieId) {
    let patchRatingDict = {};

    if (newRating === '') {
        patchRatingDict = {rating: existingRating}
    }
    else {
        patchRatingDict = {rating: newRating}
    }

    fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json"
            },
        body: JSON.stringify(patchRatingDict)
        } 
    )
    .then(resp => resp.json())
    .then(data => {
        displayMovieRating(data); // puts the rating in the sidebar
        displayFullReview(data)
        document.getElementById('user-review').reset()
    })    
}

function displayMovieRating(data){ //puts the rating in the sidebar
}; 

// //Add click event to begin randomize leftover movies

function addMovieRandomizerEvent(){
    document.querySelector("#randomizer").addEventListener('click', pickRandomMovie)
};

function pickRandomMovie(){
    const toWatchMovies = Array.from(document.querySelector("#to-watch-movies").children)
    const randomIndex = Math.floor(Math.random() * toWatchMovies.length)
    let randomId= (toWatchMovies[randomIndex]).dataset.num
    
    fetch(`https://ghibliapi.herokuapp.com/films/${randomId}`)
    .then(res => res.json())
    .then(data => displayMovieDetails(data))
    
};

//Add click event to begin chain reaction of reseting all user inputted data
function addResetEvent(){
    const btn = document.getElementById('reset');
    btn.addEventListener('click', iterateToResetMovies)
};

function iterateToResetMovies(event) {
    fetch(`http://localhost:3000/movies`)
    .then(resp => resp.json())
    .then((data) => {
        data.forEach((movie) => patchResetData(movie.id))
        return data
    })
    // add in a reset /display the current page with the new details
};

function patchResetData(movieId) {
    const resetDict = {
        watched: false,
        rating: "NR",
        comment: [] // look at why comments aren't resetting // add in a reset /display
    };

    fetch(`http://localhost:3000/movies/${movieId}`, {
        method: 'PATCH',
        headers: {'content-type': 'application/json',
        'Accept': 'application/json'
        }, 
        body: JSON.stringify(resetDict)
    })
    .then(resp => resp.json())
    .then((data) => resetDisplayMovieDetails(data))
};

function resetDisplayMovieDetails(data) {
    const displayID = document.getElementById("movie-title").dataset.num;
    if (data.id === displayID) {
        displayFullReview(data)
    };
 };


// move movies to the watched list

const watchedbtn = document.querySelector("#watched")
watchedbtn.addEventListener('change', moveToWatchedList)

function moveToWatchedList(event){
    let dataTag = document.querySelector("#movie-title").dataset.num

    const toWatchList = Array.from(document.querySelector("#to-watch-movies").children)
    moveMovieDown = toWatchList.find(m => m.dataset.num === dataTag)

    const watchedList = Array.from(document.querySelector("#watched-movies").children)
    moveMovieUp = watchedList.find(mov=> mov.dataset.num === dataTag)

    if(event.currentTarget.checked){
        document.querySelector("#watched-movies").appendChild(moveMovieDown)
    }
    else{
        document.querySelector("#to-watch-movies").appendChild(moveMovieUp)
    }
}

