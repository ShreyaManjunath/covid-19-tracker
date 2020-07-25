import React ,{useState,useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from "numeral";

const options = {
    legend:{
        display:false,

    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time: {
                    format:"MM/DD/YY",
                    tooltipFormat:"ll"
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
            },
            ticks:{
                callback:function (value,index,values){
                    return numeral(value).format("0a");

                },
            },
        },
        ],
    },
};


    const buildChartData = (data,casesType='cases') =>{
        const ChartData =[];
        let lastDataPoint;

        for(let date in data.cases){
            if (lastDataPoint) {
                let newDataPOint ={
                    x:date,
                    y:data[casesType][date] -lastDataPoint
                };

                ChartData.push(newDataPOint);
            }
            lastDataPoint =data[casesType][date];
        }

        return ChartData;
    };
    function LineGraph({casesType='cases',...props}) {
        const [data,setdata] =useState({});
    useEffect(() =>{
        const fetchData =async() =>{
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) =>{
                return response.json();
            })
            .then((data) =>{
                let ChartData =buildChartData(data,casesType);
                setdata(ChartData);
                
            });
    
        };
        fetchData();
    }, [casesType]);

    return (
        <div className={props.className}>
            {data?.length>0 && (
            <Line 
            options={options}
            data={{
                datasets:[
                    {
                        backgroundColor:"rgba(204,16,52,0.2)",
                        borderColor:"#CC1034",
                        data:data,
                    },
                ],
            }}
        />
        )}
        </div>
    )
}

export default LineGraph

