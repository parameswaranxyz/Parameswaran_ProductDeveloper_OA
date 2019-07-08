import React from "react";
import * as d3 from "d3";
// import './App.css';

class D3Component extends React.Component {

    constructor(props) {
        super(props);
    }

    pack = data => {
        const { width, height } = this.props;
        return (d3.pack()
            .size([width - 2, height - 2])
            .padding(50)
            (d3.hierarchy(data)
                .sum(d => d.parent_size)
                .sort((a, b) => b.parent_size - a.parent_size)));
    }

    color = (p) => {
        let scale = d3.scaleLinear()
            .domain([0, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl)
        return scale(p);
    }
    
    renderSvg = () => {
        const { data, width, height, canvasId, svgId } = this.props;
        const root = this.pack(data);
        let focus = root;
        let view;

        const svg = d3.select("#" + canvasId)
            .append("svg")
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .attr("id", svgId)
            .style("display", "block")
            .style("margin", "0 -14px")
            .style("background", this.color(0))
            .style("cursor", "pointer")
            .style("pointer-events", "visible")
            .on("click", () => zoom(root));

        const node = svg.append("g")
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", d => {
                return d.children ? this.color(d.depth) : "white"
            })
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function () {
                return d3.select(this).attr("stroke", "#000");                
            }
            )         
            .on("mouseout", function () { d3.select(this).attr("stroke", null); })            
            .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));
                    
        const label = svg.append("g")
            .style("font", "30px sans-serif")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(d => d.data.children_circle);
                                                
        function zoomTo(v) {
            const k = width / v[2];
            view = v;
            label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);
        }

        function zoom(d) {
            let focus = d;

            const transition = svg.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            label
                .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        zoomTo([root.x, root.y, root.r * 2])

    }

    render() {
        const { canvasId } = this.props;
        return (
            <div>
                <div id={canvasId}></div>
                <button onClick={this.renderSvg} >Click met to see graph..</button>
            </div>
        )
    }
};

export default D3Component;