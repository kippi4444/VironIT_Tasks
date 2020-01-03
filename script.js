
 axios.get('https://cors-anywhere.herokuapp.com/http://samples.openweathermap.org/data/2.5/weather?id=2172797&appid=b6907d289e10d714a6e88b30761fae22')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });