import {
  getMovies,
  getMovieDetails,
  getUserMovieData,
  patchUserMovieData,
} from "./serverCalls.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
  getMovies(iterateMovies);
  getMovies(chooseDefaultDisplayMovie);
  addMovieReviewSubmitEvent();
  addWatchedButtonCheckEvent();
  // addMovieRandomizerEvent();
  // addResetEvent();
}

function iterateMovies(movies) {
  movies.forEach((movie) => {
    renderMovieInSidebar(movie); //Add Movie to the sidebar
    //postMovieReference(movie) //Create the user JSON db - only needs to be created once
  });
}

function renderMovieInSidebar(movie) {
  const toWatchMovies = document.getElementById("to-watch-movies");
  const watchedMovies = document.getElementById("watched-movies");
  const watchedStatus = movie.watched;

  const movieListItem = createMovieListItem(movie);

  if (watchedStatus === true) {
    watchedMovies.appendChild(movieListItem);
  } else {
    toWatchMovies.appendChild(movieListItem);
  }
}

function createMovieListItem(movie) {
  const movieListItem = document.createElement("li");
  movieListItem.classList.add("sidebar-titles");
  movieListItem.textContent = movie.movieName;
  movieListItem.dataset.num = movie.id;

  movieListItem.addEventListener("click", highlightList);
  movieListItem.addEventListener("click", () => showAllMovieDetails(movie.id));

  return movieListItem;
}

function showAllMovieDetails(movieId) {
  getMovieDetails(movieId).then((movie) => renderMovieData(movie));
  getUserMovieData(movieId).then((userMovieData) => {
    renderRatingAndWatchStatus(userMovieData);
    removePreviousMovieComments();
    renderComments(userMovieData);
  });
}

function renderMovieData(movie) {
  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("movie-title").dataset.num = movie.id;
  document.getElementById("japanese-title").textContent = movie.original_title;
  document.getElementById("movie-poster").src = movie.image;
  document.getElementById(
    "director"
  ).innerHTML = `<b>Director</b>: ${movie.director}`;
  document.getElementById(
    "release-date"
  ).innerHTML = `<b>Release date</b>: ${movie.release_date}`;
  document.getElementById(
    "run-time"
  ).innerHTML = `<b>Run Time</b>: ${movie.running_time} mins`;
  document.getElementById(
    "movie-description"
  ).innerHTML = `<b>Description</b>: <br> ${movie.description}`;
}

function renderRatingAndWatchStatus(userMovieData) {
  const rateSpan = document.getElementById("rating-span");
  rateSpan.textContent = userMovieData.rating;

  const watchedBtn = document.getElementById("watched");
  const watchedStatus = userMovieData.watched;
  watchedBtn.checked = watchedStatus;
}

function removePreviousMovieComments() {
  const comments = Array.from(
    document.getElementById("current-comments").children
  );
  comments.forEach((comment) => comment.remove());
}

function renderComments(userMovieData) {
  const ul = document.getElementById("current-comments");
  const commentArrayLength = userMovieData.comment.length;

  if (commentArrayLength > 0) {
    userMovieData.comment.forEach((comment) => {
      const li = createCommentListItem(comment);
      ul.append(li);
    });
  }
}

function createCommentListItem(comment) {
  const li = document.createElement("li");
  li.textContent = comment;
  return li;
}

// // Event Listeners
function highlightList(event) {
  const toWatchMovies = document.getElementById("to-watch-movies").childNodes;
  const watchedMovies = document.getElementById("watched-movies").childNodes;
  const allMovies = [...toWatchMovies, ...watchedMovies];

  allMovies.forEach((movie) => movie.classList.remove("active"));

  event.target.classList.add("active");
}

function addMovieReviewSubmitEvent() {
  const form = document.getElementById("review-form");
  form.addEventListener("submit", parseReview);
}

// function addMovieRandomizerEvent() {
//   document
//     .querySelector("#randomizer")
//     .addEventListener("click", pickRandomMovie);
// }

// //Extra helpers
function chooseDefaultDisplayMovie(movies) {
  const unwatchedMovies = movies.filter((movie) => movie.watched === false);
  const watchedMovies = movies.filter((movie) => movie.watched === true);

  let renderId;

  if (unwatchedMovies.length === 0) {
    renderId = watchedMovies[0].id;
  } else {
    renderId = unwatchedMovies[0].id;
  }

  showAllMovieDetails(renderId);
}

// //Add submit event for review form

function parseReview(newMovieData) {
  newMovieData.preventDefault();

  const movieId = document.getElementById("movie-title").dataset.num;

  getUserMovieData(movieId).then((existingMovieData) => {
    const comments = coalesceComments(existingMovieData, newMovieData);
    const rating = coalesceRating(existingMovieData, newMovieData);
    const parsedReview = {
      comment: comments,
      rating: rating,
      watched: true,
    };

    patchReviewAndRefreshForm(parsedReview, movieId);
  });
}

function coalesceComments(existingMovieData, newMovieData) {
  const newComment = newMovieData.target["new-comment"].value;
  const existingComments = existingMovieData.comment;
  const finalComments = [...existingComments];

  if (newComment !== "") {
    finalComments.push(newComment);
  }
  return finalComments;
}

function coalesceRating(existingMovieData, newMovieData) {
  const newRating = newMovieData.target.rating.value;
  const existingRating = existingMovieData.rating;
  let finalRating;

  if (newRating === "") {
    finalRating = existingRating;
  } else {
    finalRating = newRating;
  }

  return finalRating;
}

function patchReviewAndRefreshForm(parsedReview, movieId) {
  patchUserMovieData(parsedReview, movieId).then((patchedMovie) => {
    showAllMovieDetails(patchedMovie.id);
    document.getElementById("review-form").reset();
  });
}

// // function displayMovieRating(data){ //puts the rating in the sidebar
// // };

// // //Add click event to begin randomize leftover movies

// function pickRandomMovie() {
//   const toWatchMovies = Array.from(
//     document.querySelector("#to-watch-movies").children
//   );
//   const randomIndex = Math.floor(Math.random() * toWatchMovies.length);
//   let randomId = toWatchMovies[randomIndex].dataset.num;

//   fetch(`https://ghibliapi.herokuapp.com/films/${randomId}`)
//     .then((res) => res.json())
//     .then((data) => renderMovieData(data));
// }

// //Add click event to begin chain reaction of reseting all user inputted data
// function addResetEvent() {
//   const btn = document.getElementById("reset");
//   btn.addEventListener("click", patchResetMovie);
// }

// function patchResetMovie(event) {
//   const movieId = document.getElementById("movie-title").dataset.num;

//   const resetDict = {
//     watched: false,
//     rating: "NR",
//     comment: [], // look at why comments aren't resetting // add in a reset /display
//   };

//   fetch(`http://localhost:3000/movies/${movieId}`, {
//     method: "PATCH",
//     headers: { "content-type": "application/json", Accept: "application/json" },
//     body: JSON.stringify(resetDict),
//   })
//     .then((resp) => resp.json())
//     .then((data) => {
//       displayFullReview(data);
//       moveMovie(data);
//     });
// }

// // move movies to the watched list

function addWatchedButtonCheckEvent() {
  const watchedbtn = document.querySelector("#watched");
  watchedbtn.addEventListener("change", moveToWatchedList);
}

function moveToWatchedList(event) {
  const movieId = document.getElementById("movie-title").dataset.num;

  getUserMovieData(movieId).then((userMovieData) => {});

  fetch(`http://localhost:3000/movies/${movieId}`)
    .then((resp) => resp.json())
    .then((data) => {
      let watchedStatus = data.watched;

      if (event.target.checked) {
        watchedStatus = true;
        patchWatchedBox(watchedStatus, movieId);
      } else {
        watchedStatus = false;
        patchWatchedBox(watchedStatus, movieId);
      }
    });
}

function patchWatchedBox(watchedStatus, movieId) {
  const watchedDictionary = {
    watched: watchedStatus,
  };
  fetch(`http://localhost:3000/movies/${movieId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", Accept: "application/json" },
    body: JSON.stringify(watchedDictionary),
  })
    .then((resp) => resp.json())
    .then((data) => moveMovie(data));
}

function moveMovie(data) {
  let dataTag = document.querySelector("#movie-title").dataset.num;
  const toWatchList = Array.from(
    document.querySelector("#to-watch-movies").children
  );
  moveMovieDown = toWatchList.find((m) => m.dataset.num === dataTag);

  const watchedList = Array.from(
    document.querySelector("#watched-movies").children
  );
  moveMovieUp = watchedList.find((mov) => mov.dataset.num === dataTag);

  if (data.watched === true) {
    document.querySelector("#watched-movies").appendChild(moveMovieDown);
  } else {
    document.querySelector("#to-watch-movies").appendChild(moveMovieUp);
  }

  confirmCheckBox(data);
}

function confirmCheckBox(data) {
  const checkbox = document.getElementById("watched");
  checkbox.checked = data.watched;
}

// //Create the user JSON db; only needed
// //  function postMovieReference(movie){

// //     const newMovieForUser = {
// //         id: movie.id,
// //         movieName: movie.title,
// //         watched: false,
// //         rating: 'NR',
// //         comment: [],
// //     }

// //     fetch(`http://localhost:3000/movies`, {
// //         method: 'POST',
// //         headers: {
// //             "content-type": "application/json",
// //             "Accept": "application/json"
// //         },
// //         body: JSON.stringify(newMovieForUser)
// //     })
// //  };
