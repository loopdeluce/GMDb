function getMovies(dataManipulationFunction) {
  fetch("http://localhost:3000/movies")
    .then((res) => res.json())
    .then((data) => dataManipulationFunction(data));
}

function getMovieDetails(movieId) {
  return fetch(`https://ghibliapi.herokuapp.com/films/${movieId}`).then(
    (resp) => resp.json()
  );
}

function getUserMovieData(movieId) {
  return fetch(`http://localhost:3000/movies/${movieId}`).then((resp) =>
    resp.json()
  );
}

function patchUserMovieData(patchDict, movieId) {
  return fetch(`http://localhost:3000/movies/${movieId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(patchDict),
  }).then((resp) => resp.json());
}

export { getMovies, getMovieDetails, getUserMovieData, patchUserMovieData };
