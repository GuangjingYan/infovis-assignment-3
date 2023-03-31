import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import { colormap } from "../utils/colormap";

const LegendView = (props) =>{
  const lViewSvg = useRef(null);
  const margin = 40;
  const width = 200;
  const svgSize = width + 2 * margin;
  const num = 50;
  const rectWidth = width / num;

  useEffect(()=>{
    const svg = d3.select(lViewSvg.current);

    const xScale  = d3.scaleLinear().domain([margin, margin + width]).range([0,1]);
		const yScale  = d3.scaleLinear().domain([margin, margin + width]).range([1,0]);
    // set color rects
    const rectSvg = svg.append("g")
                       .attr("transform", `translate(0,0)`)
                       .attr("class","rectSvg");
    
    for(let i = 0; i < num; i++)
      for(let j = 0; j < num; j++ )
      {
        let positionX = margin + i * rectWidth;
        let positionY = margin + j * rectWidth;
        rectSvg.append("rect")
              .attr('x', positionX)
              .attr('y', positionY)
              .attr('width', rectWidth)
              .attr('height', rectWidth)
              .attr('stroke', 'none')
              .attr('fill', colormap( 1-xScale(positionX), 1-yScale(positionY)));
      }
    // set text
    const textSvg = svg.append("g")
                      .attr("transform", `translate(0,0)`)
                      .attr("class","colorTextSvg");
    
    textSvg.append("text")
           .attr("transform",`translate(${margin + 5},${margin + 15})`)
           .attr("fill", "white")
           .attr("font-size", "12px")
           .text("Missing Neighbors");
    textSvg.append("text")
           .attr("transform",`translate(${margin + 165},${margin + 15})`)
           .attr("fill", "white")
           .attr("font-size", "12px")
           .text("Both");
    textSvg.append("text")
           .attr("transform",`translate(${margin + 5},${margin + 195})`)
           .attr("fill", "black")
           .attr("font-size", "12px")
           .text("No Distortions");
    textSvg.append("text")
           .attr("transform",`translate(${margin + 105},${margin + 195})`)
           .attr("fill", "white")
           .attr("font-size", "12px")
           .text("False Neighbors");
  },[])

  return(
    <div>
      <svg ref={lViewSvg} width={svgSize} height={svgSize}/> 
      </div>
  )

}

export default LegendView;