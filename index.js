const autocompleteConfig = {
  renderOption(movie) {
    // Check to see if the image source is valid - set it to an empty string if not
    const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster; 
    return `
      <img src="${imgSRC}"/>
      ${movie.Title} (${movie.Year})
    `
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
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
}

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    const tutorial = document.querySelector('.tutorial');
    tutorial.classList.add('is-hidden')
    getMoreData(movie, document.querySelector('#left-summary'));
  },
})

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    const tutorial = document.querySelector('.tutorial');
    tutorial.classList.add('is-hidden')
    getMoreData(movie, document.querySelector('#right-summary'));
  },
})

const getMoreData = async (movie, summaryElement) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '94dd967b',
      i: movie.imdbID
    }
  })
  summaryElement.innerHTML = updateUI(response.data);
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