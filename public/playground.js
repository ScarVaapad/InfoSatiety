
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 660 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
const w = 400;
const h = 400;

let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

let isDrawing = false;
let data = [];

const svg = d3.select("#scatterplot-div")
    .append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('style', 'background-color: grey')
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr('style', 'background-color: white')
    .on("mousedown", function() {
    isDrawing = true;
    data = []; // Clear the old line data
    svg.selectAll("path").remove(); // Clear the old line from the SVG
})
    .on("mousemove", function(event) {
        if (!isDrawing) return;
        let coords = d3.pointer(event);
        data.push({x: coords[0], y: coords[1]});
        svg.selectAll("path").remove(); // Clear the old line from the SVG
        svg.append("path") // Draw the new line
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    })
    .on("mouseup", function() {
        isDrawing = false;
    });
