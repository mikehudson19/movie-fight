async function fetchData (searchTerm) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '94dd967b',
      s: searchTerm
    }
  });

  if (response.data.Error) {
    return [];
  } else {
    return response.data.Search;
  }
}

// Creating the structure of the dropdown list
const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`

// The UI element variables that we are going to use
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = async (e) => {
  const movies = await fetchData(e.target.value);
  if (movies.length == 0) {
    dropdown.classList.remove('is-active');
    return;
  }

  // Clear the dropdown each time a search is made
  resultsWrapper.innerHTML = '';
  
  // Add the 'is-active' class to display the dropdown menu
  dropdown.classList.add('is-active');

  for (let movie of movies) {
    // Create a dropdown item for each element in the 'movies' array
    const option = document.createElement('a');
    option.classList.add('dropdown-item');
    // Check to see if the image source is valid - set it to an empty string if not
    const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster; 
    option.innerHTML = `
      <img src="${imgSRC}"/>
      ${movie.Title} 
    `
    option.addEventListener('click', () => {
      input.value = movie.Title;
      dropdown.classList.remove('is-active');
      getMoreData(movie);
    })
    // Append each dropdown item to the UI
   resultsWrapper.appendChild(option);
  }


}

input.addEventListener('input', debounce(onInput, 700))

// Function to clear the dropdown when clicked away from
// document.addEventListener('click', (e) => {
//   if (e.target.className !== 'dropdown-item') {
//     resultsWrapper.innerHTML = '';
//   }
// })

// Steven's solution to clear the dropdown when clicked away from
document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active')
  }
})

const getMoreData = async (movie) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '94dd967b',
      i: movie.imdbID
    }
  })
  document.querySelector('.movie-info').innerHTML = updateUI(response.data);
}

function updateUI (movieDetail) {
  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}"/>
      </p>
    </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movieDetail.Title}</h1>
      <h4>${movieDetail.Genre}</h4>
      <p>${movieDetail.Plot}</p>
    </div>
  </div>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
</article> 
<article class="notification is-primary">
  <p class="title">${movieDetail.BoxOffie}</p>
  <p class="subtitle">Box Office</p>
</article> 
<article class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article> 
<article class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article> 
<article class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article> 
  `
}