import React,{useState, useEffect} from 'react';
import {MenuItem,
FormControl,
Select,
Card,
CardContent,
} from "@material-ui/core";
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import './App.css';
import { getItSorted, prettyPrintStat } from "./util";
import LineGraph from "./Components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const  [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapzoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getWorldwideInfo = async () => await fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => setCountryInfo(data))
    getWorldwideInfo();
  },[])
  useEffect(()=>{
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json()
      )
       .then((data) => {
        const countries = data.map((country) => (
         {
            name: country.country,
            value: country.countryInfo.iso2
          }
       ));
          const sortedData = getItSorted(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
      })
    };
    getCountriesData();
  },[]);
  
const onCountryChange = async (event) => {
const countryCode=event.target.value;

const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all'
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
   

  await fetch(url)
  .then(response => response.json())
  .then((data) => {
    setSelectedCountry(countryCode);
    setCountryInfo(data);
  
    if(countryCode !== "worldwide") {setMapCenter([ data.countryInfo.lat, data.countryInfo.long]);
    setMapzoom(4);
    }
    else{
      setMapCenter([]);
    }
  });
};
  return (
    <div className="app">
     <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
              >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country)=>{
                return <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem> 
              })}
              
            </Select>
          </FormControl>
        </div>
      <div className="app_stats">
        <InfoBox isRed
        casesType={casesType} active={casesType === 'cases'}
        onClick={e=> setCasesType("cases")}
        title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox casesType={casesType} active={casesType === "recovered"}
        onClick={e=> setCasesType("recovered")}
         title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox isRed
        casesType={casesType} active={casesType==="deaths"}
        onClick={e=> setCasesType("deaths")}
        title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div> 
    <Map
    center={mapCenter}
    zoom={mapZoom}
    countries={mapCountries}
    casesType={casesType}
    />
  </div>
  <div className="app_right">
    <Card>
        <CardContent>
          {/*Table */}
          <h2>Live Cases by Country</h2>
          <Table countries={tableData}/>
          {/*Graph*/}
          <h3 className="app_graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
    </Card>
  </div>
 </div>

  );
}

export default App;
