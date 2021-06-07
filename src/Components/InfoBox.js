import React from 'react'
import {Card, CardContent, Typography
} from "@material-ui/core"
import "../design/InfoBox.css";

function InfoBox({title, active, isRed, casesType, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick}
        className={`infoBox ${active && `infoBox--${casesType}`}`}>
            <CardContent>
                <Typography className="infoBox_title">
                  {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
                {cases}</h2>
                <Typography className="infoBox_total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox


