async function fetchData () {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '94dd967b',
      t: 'chef'
    }
  });
  console.log(response.data);
}


