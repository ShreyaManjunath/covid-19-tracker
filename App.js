import React ,{useState,useEffect} from 'react';
import {MenuItem,FormControl,Select,Card,CardContent} from "@material-ui/core";
import './App.css';
import Infobox from './Infobox';
import Map from './Map';
import Table from './Table';
import {sortData,prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries,setContries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setcountryInfo] =useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter]=
  useState({lat:28.644800, lng:77.216721});
  // 34.80746, lng:-40.4796
  // 28.644800, lng:77.216721
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] =useState([]);
  const [casesType,setCasesType] =useState("cases");
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then(data =>{
      setcountryInfo(data);
    });
  }, []);

  //https://disease.sh/v3/covid-19/countries

  useEffect(() => {
   //the code inside run once when component changes
   const getCountriesData = async () =>{
     await fetch("https://disease.sh/v3/covid-19/countries")
     .then((response)=> response.json())
     .then((data) =>{
       const countries = data.map((country) =>(
         {
          name:country.country,
          value : country.countryInfo.iso2
       }));
       const sortedData = sortData(data);
       setTableData(sortedData);
       setMapCountries(data);
       setContries(countries);
     });
   };
   getCountriesData();
    
  }, []);

const oncountrychange =async (event) => {
  const countrycode = event.target.value;
  // setCountry(countrycode);

  const url =countrycode=== 'worldwide' ? "https://disease.sh/v3/covid-19/all" :
  `https://disease.sh/v3/covid-19/countries/${countrycode}`;

  await fetch(url)
  .then((response) => response.json())
  .then((data) =>{
    setCountry(countrycode);
    setcountryInfo(data);
    setMapCenter([data.countryInfo.lat,data.countryInfo.long])
    setMapZoom(4);
  });
};

  return (
    <div className="app">
      <div className="app_left">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select
          varient="outline"
          onChange={oncountrychange}
          value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map((country) =>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }

            {/* <MenuItem value="worldwide">worldwide</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>
            <MenuItem value="worldwide">Option 4</MenuItem> */}

        </Select>
      </FormControl>
      </div>
      {/*header-end*/}


      <div className="app_stats">
        <Infobox 
        active={casesType==="cases"}
        onClick={e => setCasesType('cases')}
        title="CoronaVirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
        <Infobox
         active={casesType==="recovered"}
        onClick={e =>setCasesType('recovered')}
        title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
        <Infobox 
        active={casesType==="deaths"}
        onClick={e =>setCasesType('deaths')}
        title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />

        

      </div>

    
      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
    </div>
    <Card className="app_right">
          <CardContent>
            <h3>Live cases by country</h3>
            {/*table*/}
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            {/*graph*/}
            <LineGraph className="app_gaph" casesType={casesType}/>
          </CardContent>
    </Card>
    </div>
  );
}

export default App;
