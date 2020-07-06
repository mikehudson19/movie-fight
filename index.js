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


const input = document.querySelector('input');


const onInput = async e => {
  const movies = await fetchData(e.target.value);
  
  for (obj of movies) {
    const div = document.createElement('a');
    div.className = 'dropdown-item';
    div.innerHTML = `${obj.Title}`
    const target = document.querySelector('.dropdown-content');
    target.appendChild(div);
  }

}

input.addEventListener('input', debounce(onInput, 1500))