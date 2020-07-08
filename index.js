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
    getMoreData(movie, document.querySelector('#left-summary'), 'left');
  },
})

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    const tutorial = document.querySelector('.tutorial');
    tutorial.classList.add('is-hidden')
    getMoreData(movie, document.querySelector('#right-summary', 'right'));
  },
})

let leftMovie;
let rightMovie;

const getMoreData = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '94dd967b',
      i: movie.imdbID
    }
  })
  summaryElement.innerHTML = updateUI(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#right-summary .notification');
  const rightSideStats = document.querySelectorAll('#left-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  })
}

function updateUI (movieDetail) {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0)

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
<article data-value=${awards} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
</article> 
<article data-value=${dollars} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffie}</p>
  <p class="subtitle">Box Office</p>
</article> 
<article data-value=${metascore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article> 
<article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article> 
<article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article> 
  `
}