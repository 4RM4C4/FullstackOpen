import React, { useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country, api_key, weather, setWeather }) => {
    if(weather != undefined && weather.length != 0 && weather.name == country.capital[0]){
        let direction = ''
        const directionCalc = weather.wind.deg/11.25
        if (directionCalc <=1 || directionCalc>=31) {direction='N'}
        if (directionCalc >1 && directionCalc<=3) {direction='N/NE'}
        if (directionCalc >3 && directionCalc<=5) {direction='NE'}
        if (directionCalc >5 && directionCalc<=7) {direction='E/NE'}
        if (directionCalc >7 && directionCalc<=9) {direction='E'}
        if (directionCalc >9 && directionCalc<=11) {direction='E/SE'}
        if (directionCalc >11 && directionCalc<=13) {direction='SE'}
        if (directionCalc >13 && directionCalc<=15) {direction='S/SE'}
        if (directionCalc >15 && directionCalc<=17) {direction='S'}
        if (directionCalc >17 && directionCalc<=19) {direction='S/SW'}
        if (directionCalc >19 && directionCalc<=21) {direction='SW'}
        if (directionCalc >21 && directionCalc<=23) {direction='W/SW'}
        if (directionCalc >23 && directionCalc<=25) {direction='W'}
        if (directionCalc >25 && directionCalc<=27) {direction='W/NW'}
        if (directionCalc >27 && directionCalc<=29) {direction='NW'}
        if (directionCalc >29 && directionCalc<31) {direction='N/NW'}
        return     <>
        <h2>Weather in {country.capital[0]}</h2>
        <p>Temperature: {Math.round((weather.main.temp - 273.15)*10)/10}° Celcius</p>
        <img src={"https://openweathermap.org/img/wn/".concat(weather.weather[0].icon).concat("@2x.png")}></img>
        <p>Wind: {Math.round((weather.wind.speed*3.6)*10)/10} Km/h. Direction: {direction}</p>
    </>
     }

    return <>
    <h2>Weather not available</h2></>
}

export default Weather