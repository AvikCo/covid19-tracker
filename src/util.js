import React from 'react';
import numeral from 'numeral';
import {Circle, Popup} from "react-leaflet";


const casesTypeColors = {
	cases: {
		hex: "#CC1034",
		rgb: 'rgb(204, 16, 52, 0.5)',
		half_op: 'rgba(204, 16, 52, 0.5)',
		multiplier: 280,
	},
	recovered: {
		hex: '#A0E723',
		multiplier: 360,
	},
	deaths: {
		hex: '#fb4443',
		rgb: 'rgb(251, 68, 67)',
		half_op: 'rgba(251, 68, 67, 0.5)',
		multiplier: 1530,
	},
};



export const getItSorted = (data) => {
const sortedList = [...data];

sortedList.sort((a,b) => a.cases > b.cases ? -1 : 1);
return sortedList;
}

export const prettyPrintStat = (stat) =>{
return stat ? `+${numeral(stat).format("0.0a")}`:
"+0";
}
//draw circles on  the map with interactive tooltip

export const showDataOnMap = (data, casesType) => {//we can remove the second braces and return statement as per es16
return data.map((country)=>(
    <Circle
    key={country.name}    
    center = {[country.countryInfo.lat, country.countryInfo.long]}
    fillOpacity={0.4}
    color={casesTypeColors[casesType].hex}
    fillColor={casesTypeColors[casesType].hex}
    radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
    }
    > 
        <Popup>
            <div className="info-container">
                <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                />
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
            </div>
        </Popup>
    </Circle>
))};
