require('isomorphic-fetch');

window.onload = getData()


function getData(){
  const key = '99a8db9a0f3c2e31'

  const nyc = fetch(`http://api.wunderground.com/api/${key}/conditions/forecast10day/q/NY/New_York.json`)
  .then(res => res.json())

  const buffalo = fetch(`http://api.wunderground.com/api/${key}/conditions/forecast10day/q/NY/buffalo.json`)
  .then(res => res.json())

  const boston = fetch(`http://api.wunderground.com/api/${key}/conditions/forecast10day/q/MA/boston.json`)
  .then(res => res.json())

  Promise.all([nyc, buffalo, boston])
  .then((values) =>{
    getWindChill(values)
    getAvgHumidity(values)
  })
}

function getAvgHumidity(cities){
  const aCityHumidity = tenDayHumidity(cities[0].forecast.simpleforecast.forecastday, cities[0].current_observation.display_location.full)
  const bCityHumidity = tenDayHumidity(cities[1].forecast.simpleforecast.forecastday, cities[1].current_observation.display_location.full)
  const cCityHumidity = tenDayHumidity(cities[2].forecast.simpleforecast.forecastday, cities[2].current_observation.display_location.full)
  let highestAvg = 0
  let cityName = ''
  const cityArr = [aCityHumidity, bCityHumidity, cCityHumidity]

  cityArr.forEach(city => {
    if (city.avg > highestAvg){
      highestAvg = city.avg
      cityName = city.name
    }
  })
  const text = `The city with the highest average humidity across 10 days is ${cityName}</h2>`
  const h2 = document.createElement('h2')
  h2.innerHTML = text

  document.getElementById('avgHumidity').appendChild(h2)
}

function tenDayHumidity(cityData, cityName){
  const tenDay =  cityData.map(city => {
    return city.avehumidity
  }).reduce((acc, curr) => {
    return acc + curr
  })
  return {'name':cityName, 'avg': tenDay}
}

function getWindChill(cities){
  const sortedWindChill = cities.map((city) => {
    return city.current_observation
  }).sort(function(a, b){
    return b.windchill_f - a.windchill_f
  })
  makeTable(sortedWindChill)
}

function makeTable(arr){
  const table = document.createElement('Table')
  document.body.appendChild(table)

  arr.forEach((city, i) => {
    let row = table.insertRow(i);
    let nameCell = row.insertCell(0)
    let windChillCell = row.insertCell(1)
    let tempCell = row.insertCell(2)
    let dewPointCell = row.insertCell(3)
    let weather = row.insertCell(4)
    let windDirection = row.insertCell(5)
    nameCell.innerHTML = `${city.display_location.city}`
    windChillCell.innerHTML = `Wind Chill (F): <b>${city.windchill_f} </b>`
    tempCell.innerHTML = `Temperature (F): <b>${city.temp_f}</b>`
    dewPointCell.innerHTML = `Dew Point (F): <b>${city.dewpoint_f}</b>`
    weather.innerHTML =  `Weather: <b>${city.weather}</b>`
    windDirection.innerHTML = `Wind Direction: <b>${city.wind_dir}</b>`
  })
}

module.exports = {
  getData,
  makeTable,
  getWindChill,
  tenDayHumidity
}
