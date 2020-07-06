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

  // Clear the dropdown each time a search is made
  resultsWrapper.innerHTML = '';
  
  // Add the 'is-active' class to display the dropdown menu
  dropdown.classList.add('is-active');

  for (obj of movies) {
    // Create a dropdown item for each element in the 'movies' array
    const option = document.createElement('a');
    option.classList.add('dropdown-item');
    const imgSRC = obj.Poster === 'N/A' ? '' : obj.Poster; 
    option.innerHTML = `
      <img src="${imgSRC}"/>
      ${obj.Title} 
    `
    // Append each dropdown item to the UI
   resultsWrapper.appendChild(option);
  }

  

}

input.addEventListener('input', debounce(onInput, 1000))

