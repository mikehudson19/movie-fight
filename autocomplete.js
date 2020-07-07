const createAutoComplete = ({ root }) => {
  // Creating the structure of the dropdown list

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
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');


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

// Steven's solution to clear the dropdown when clicked away from
document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active')
  }
})
}