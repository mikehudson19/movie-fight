const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
  // Creating the structure of the dropdown list

root.innerHTML = `
  <label><b>Search</b></label>
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
  const items = await fetchData(e.target.value);
  if (items.length == 0) {
    dropdown.classList.remove('is-active');
    return;
  }

  // Clear the dropdown each time a search is made
  resultsWrapper.innerHTML = '';
  
  // Add the 'is-active' class to display the dropdown menu
  dropdown.classList.add('is-active');

  for (let item of items) {
    // Create a dropdown item for each element in the 'items' array
    const option = document.createElement('a');
    option.classList.add('dropdown-item');
    option.innerHTML = renderOption(item);

    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = inputValue(item);
      onOptionSelect(item);
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