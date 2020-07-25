import React from 'react';
import {Card ,CardContent,Typography} from '@material-ui/core';
import "./Infobox.css";

function Infobox({title,cases,active,total,...props}) {
    return (
        <Card onClick={props.onClick}
        className={`infobox ${active && 'infobox--selected'}`}>
            <CardContent>
                {/* title coronavirus-cases*/}
                <Typography className="infobox_title" color="textSecondary">
                    {title}
                </Typography>
                {/*no. of caess*/}

                <h2 className="infobox-cases">{cases}</h2>
                {/* total*/}
                <Typography className="infobox_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
        
    )
}

export default Infobox
