import React, {useState, useEffect} from "react";
import AxisView from "./components/AxisView";
import ProjectionView from "./components/ProjectionView";
import LegendView from "./components/LegendView";
import attr from "./data/attr.json";
import pointData from "./data/raw.json";

import "./App.css";

function App() {
  // AxisView Parameters
  const radius = 150;
  const margin = 80;
  const width = 360;
  const center = margin + radius;
  // ProjectionView Update State
  const [circleUpdate, setCircleUpdate] = useState();
  // Axis Position
  const [attrPosition, setAttrPosition] = useState(
    attr.map((d,i) => {
        let angle = Math.PI * 2 / attr.length;
        let xPosition = center + radius * Math.cos( angle * i );
        let yPosition = center + radius * Math.sin( angle * i) ;
        return [xPosition, yPosition,d];
      })
  );

  return(
    <div className="Container">
      <div>
        <ProjectionView
        attrPosition = {attrPosition}
        pointData = {pointData}
        center = {center}
        circleUpdate = {circleUpdate}
        />
      </div>
      <div className="VerticalLayout">
        <div>
            <AxisView
            attrPosition = {attrPosition}
            center = {center}
            radius = {radius}
            margin = {margin}
            width = {width}
            setCircleUpdate = {setCircleUpdate}
            />
        </div>
        <div>
          <LegendView/>
        </div>
      </div>
    </div>
  )

}

export default App;