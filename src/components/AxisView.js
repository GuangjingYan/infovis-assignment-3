import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";

const AxisView = (props) =>{
  const { attrPosition, center, radius, margin, width, setCircleUpdate } = props;
  
  const AxisSvg = useRef(null);
  const svgSize = margin * 2 + width;
  let drag = d3.drag().on('drag',handleDrag).on('end',dragEnded);

  useEffect(() =>{
    drawBigCircle();
    drawCircle();
    drawText();
    drawLine();
  },[])

  // drag handler
  function handleDrag(e){
    let name = this.getAttribute("class");
    d3.select(".lineSvg").select(`.${name}`).style('stroke',"red");
    d3.select(".textSvg").select(`.${name}`).style('fill',"red");
    d3.select(this).style("fill","red");
    let deltaX = e.x - center;
    let deltaY = e.y - center;
    let tan = deltaY / deltaX;
    if( deltaX >= 0) {
      e.subject[0] = center + radius * Math.cos( Math.atan(tan) );
      e.subject[1] = center + radius * Math.sin( Math.atan(tan) );
    }
    else {
      e.subject[0] = center - radius * Math.cos( Math.atan(tan) );
      e.subject[1] = center - radius * Math.sin( Math.atan(tan) );
    }
    updateCircle();
    updateText();
    updateLine();
    setCircleUpdate(preState => !preState);
  }

  // dragend handler
  function dragEnded(e){
    d3.select(this).style("fill","black");
    let name = this.getAttribute("class");
    d3.select(".lineSvg").select(`.${name}`).style('stroke',"black");
    d3.select(".textSvg").select(`.${name}`).style('fill',"black");
  }
  
  // draw star coordinate
  function drawBigCircle()
  {
    const svg = d3.select(AxisSvg.current);
    const arcSvg = svg.append("g")
                      .attr("transform", `translate(${margin + radius},${radius + margin})`)
                      .attr("class", "arcSvg")

    const arcGenerator = d3.arc()
                          .innerRadius(radius)
                          .outerRadius(radius)
                          .startAngle(0)
                          .endAngle(Math.PI * 2);

    const path = arcSvg.append("path")
                    .attr("d", arcGenerator)
                    .attr("fill", "white")
                    .style("stroke", "grey")
                    .style("stroke-width", "3px")
                    .style("stroke-dasharray", "5,5"); 
  }

  // draw axis handle
  function drawCircle()
  {
    const svg = d3.select(AxisSvg.current);
    // set circles
    const circleSvg = svg.append("g")
                        .attr("transform", `translate(0,0)`)
                        .attr("class", "circleSvg")
    updateCircle();
  }

  // draw axis
  function drawLine()
  {
    const svg = d3.select(AxisSvg.current);
    const lineSvg =  svg.append("g")
                        .attr("transform", `translate(0,0)`)
                        .attr("class", "lineSvg")
    updateLine();
  }

  // render attribute text
  function drawText()
  {
    const svg = d3.select(AxisSvg.current);
    const textSvg = svg.append("g")
                        .attr("transform", `translate(0,0)`)
                        .attr("class", "textSvg")
    updateText();
  }
  
  // update axis handle
  function updateCircle()
  {
    const circleSvg = d3.select(".circleSvg")
    circleSvg.selectAll("circle")
        .data(attrPosition)
        .join("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 7)
        .attr("fill", "black")
        .attr("class", (d,i) => `attr${i}`)
        .call(drag)
        .on("mouseover", function(d){
          d3.select(this).style("fill", "red");
          let name = this.getAttribute("class");
          d3.select(".lineSvg").select(`.${name}`).style('stroke',"red");
          d3.select(".textSvg").select(`.${name}`).style('fill',"red");
         })
        .on("mouseout", function(d){
          d3.select(this).style("fill", "black");
          let name = this.getAttribute("class");
          d3.select(".lineSvg").select(`.${name}`).style('stroke',"black");
          d3.select(".textSvg").select(`.${name}`).style('fill',"black");
         })
  }

  // update attribute text
  function updateText()
  {
    const textSvg = d3.select(".textSvg");
    textSvg.selectAll("text")
    .data(attrPosition)
    .join("text")
    .attr("class", (_,i) => `attr${i}`)
    .attr("transform",(d)=>{ 
      let textX = d[0];
      let textY = d[1];
      textX > center ? textX +=  20 : textX -= 80;
      textY > center ? textY +=  20 : textY -= 20;
      return `translate(${textX},${textY})`; 
    })
    .text(d => d[2]);
  }

  // update axis
  function updateLine()
  {
    const lineSvg = d3.select(".lineSvg");

    const lineData = attrPosition.map(e => {
      return[[center, center],[e[0],e[1]]];
    })
    lineSvg.selectAll("line")
         .data(lineData)
         .join("line")
         .attr("x1",d => d[0][0])
         .attr("y1",d => d[0][1])
         .attr("x2",d => d[1][0])
         .attr("y2",d => d[1][1])
         .attr("class",(_,i) => `attr${i}`)
         .attr("stroke", "black")
         .style("stroke-width", "1px");
  }

  return (
		<div>
			<svg ref={AxisSvg} width={svgSize} height={svgSize - margin}> 
			</svg>
		</div>
	)

}

export default AxisView;