import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import { tnc } from "../utils/tnc"
import { colormap } from "../utils/colormap";

const ProjectionView = (props) =>{
  const { attrPosition, pointData, center, circleUpdate } = props;
  const pViewSvg = useRef(null);
  const margin = 40;
  const width = 600;
  const svgSize = margin * 2 + width;
  const isUpdate = useRef(null);
  const [checkVis, setCheckVis] = useState(false);
  let xExtent, yExtent, newPosition, pointPosition;

  // first render & update
  useEffect(() =>{
    if(!isUpdate.current){
      updateData();
      drawPoint();
      isUpdate.current = true;
    }else
    {
      updateData();
      updatePoint();
      setCheckVis(false);
    }
  },[circleUpdate])

  // checkVis render & remove
  useEffect(() =>{
    if(checkVis)
    {
      updateData();
      drawVoronoi();
    }
    else
      d3.select(".voronoiSvg").remove();
  },[checkVis])

  // set projection
  function drawPoint(){
    const svg = d3.select(pViewSvg.current);
    const pointSvg = svg.append("g")
                        .attr("transform",`translate(0,0)`)
                        .attr("class","pointSvg")

    updatePoint();
  }

  // update projection position by attribute position
  function updateData()
  {
    newPosition = pointData.map( d =>{
      let pointX = 0;
      var pointY = 0;
      d.forEach((e,i) => {
        pointX += e * (attrPosition[i][0] - center);
        pointY += e * (attrPosition[i][1] - center);
      });
      return [pointX, pointY]
    })
    pointPosition = newPosition;
  }

  // update projection
  function updatePoint()
  {
    xExtent = d3.extent(pointPosition.map(d => d[0]));
		yExtent = d3.extent(pointPosition.map(d => d[1]));
    const xScale  = d3.scaleLinear().domain(xExtent).range([margin, margin + width]);
		const yScale  = d3.scaleLinear().domain(yExtent).range([margin, margin + width]);

    const pointSvg = d3.select(".pointSvg");
    pointSvg.selectAll("circle")
    .data(pointPosition)
    .join("circle")
    .transition()
    .duration(10)
    .attr("cx", d => xScale(d[0]))
    .attr("cy", d => yScale(d[1]))
    .attr("r", 3)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("class", (d,i) => `point${i}`);
  }

  // draw voronoi graph
  function drawVoronoi()
  {
    const svg = d3.select(pViewSvg.current);
    const voronoiSvg = svg.append("g")
                          .attr("transform",`translate(0,0)`)
                          .attr("class","voronoiSvg");

    xExtent = d3.extent(pointPosition.map(d => d[0]));
		yExtent = d3.extent(pointPosition.map(d => d[1]));
    const xScale  = d3.scaleLinear().domain(xExtent).range([margin, margin + width]);
		const yScale  = d3.scaleLinear().domain(yExtent).range([margin, margin + width]);
    const delaunayPosition = pointPosition.map(e => [xScale(e[0]),yScale(e[1])]);
    //console.log(tnc(pointData,delaunayPosition));
    const tncValue = tnc(pointData,delaunayPosition);
    let voronoi = d3.Delaunay
                    .from(delaunayPosition)
                    .voronoi([0, 0, svgSize, svgSize]);
    voronoiSvg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("d", voronoi.render());

    voronoiSvg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("class", "cell")
      .selectAll("path")
      .data(delaunayPosition)
      .join("path")
      .attr("d", (d, i) => voronoi.renderCell(i))
      .attr("fill", (_,i)=>{
        return colormap(tncValue.trust[i],tncValue.conti[i]);
      })

    voronoiSvg.append("g")
      .selectAll("circle")
      .data(pointPosition)
      .join("circle")
      .transition()
      .duration(10)
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[1]))
      .attr("r", 3)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("class", (d,i) => `point${i}`);
  }

  // button handler
  const clickHandler= () =>{
    checkVis? setCheckVis(false) : setCheckVis(true);
  };

  return(
    <div>
      <div>
      <svg ref={pViewSvg} width={svgSize} height={svgSize}/> 
      </div>
      <div>
      <button onClick={clickHandler}>{checkVis ? "Disable CheckVis" : "Enable CheckVis"}</button>
      </div>
    </div>
  )

}

export default ProjectionView;