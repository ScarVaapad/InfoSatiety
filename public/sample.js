function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 660 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
const w = 400;
const h = 400;

let maxCatIndex;
let taskNum, taskCnt, useShape, colorPalette, colors, sampleCnt, prevValue;
let timeleft = 150;
let alreadyClick = false;
prevValue = 0;
// let directory='./asset/Examples/';
// let samples = ['s01_cor@0.5_m@1.5_b@0.5.csv','s02_cor@0.2_m@0.8_b@-0.8.csv','s03_cor@0.9_m@-1.8_b@-0.5.csv']
let directory='./asset/Tasks/';
let samples = ['t01_cor@0.3_m@1_b@0.csv','t02_cor@0.3_m@0.5_b@0.5.csv','t03_cor@0.3_m@-2_b@1.csv','t04_cor@0.3_m@-0.5_b@1.csv','t05_cor@0.8_m@2_b@2.csv','t06_cor@0.8_m@0.5_b@-1.csv','t07_cor@0.8_m@-1_b@-1.csv','t08_cor@0.8_m@-0.3_b@0.75.csv']

const svg = d3.select("#sample-div")
  .append("svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr('style', 'background-color: white');

const margin_svg = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let _d,xMin,xMax,yMin,yMax;

// variables for adding data into the scatter plot
// first, how many more data points will be revealed each time
const d_reveal = 5;
// then, how many data points are revealed in total
let d_total = 0;


// variables for drawing
let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
let isDrawing = false;
let userLineData = [];
let startPoint = null;

function genChart() {
    const urlParams = new URLSearchParams(window.location.search);
    sampleCnt=urlParams.get("samplecnt");

    if (parseInt(sampleCnt) == samples.length) {
      $('#try-more-btn').hide()
    }

    const fname = directory+samples[sampleCnt-1];

    d3.csv(fname).then(function(data){
      _d = data;
      console.log(_d);

    xMin = d3.min(data, function(d) { return +d.x; });
    xMax = d3.max(data, function(d) { return +d.x; });
    yMin = d3.min(data, function(d) { return +d.y; });
    yMax = d3.max(data, function(d) { return +d.y; });

    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([ 0, width ]);

    margin_svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat((domainn,number)=>{return ""}));

    const y = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5])
        .range([ height, 0]);

    margin_svg.append("g")
        .call(d3.axisLeft(y).tickFormat((domainn,number)=>{return ""}));

    });


}

function updateChart(_d,num){
    num = +num;
    let d = _d.slice(0,num+1);
    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([ 0, width ]);
    const y = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5])
        .range([ height, 0]);
    margin_svg.append('g')
        .selectAll("dot")
        .data(d)
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .join("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", 3.5)
        .style("fill", "Black" )
        .transition(1000)
        .style("fill", function(d, i) {
            if (i < d_total-d_reveal){
                return "Black"; // Color for old data points
            } else {
                return "Blue"; // Color for new data points
            }
        });

}



//Listeners
//Click button to move to the next example/tutorial
$( "#add-more-btn" ).click(function() {
    d_total += d_reveal;
    updateChart(_d,d_total);
});

//Need to be reimplented
$( "#submit-result-btn" ).click(function() {
    //pass the data to the database

    //and if count is 3, submitting will result into the next page
    if (parseInt(sampleCnt) == samples.length) {
        window.location.href = "finish.html";
    }else{
        window.location.href = "sample.html?samplecnt="+(parseInt(sampleCnt)+1).toString();
    }
});

//Slider for scatterplot numbers, could change the tick
$("#slider-control").change(function(e){
    let slider_elem = $(this);
    let value = slider_elem.val();
    updateChart(_d,value);
});
//Prevent sliding to the left
$("#slider-control").on("input", function(e) {
    const currentValue = parseInt(e.target.value, 10);

    if (currentValue > prevValue) {
        // Allow sliding to the right
        prevValue = currentValue;
    } else {
        // Prevent sliding to the left
        e.target.value = prevValue;
    }
    console.log("Slider bar moved");
    updateChart(_d, currentValue);
});

//Button function to add more data to the scatterplot
$("#add-data-btn").click(function(){
    let slider_elem = $("#slider-control");
    let value = slider_elem.val();
    value = parseInt(value)+1;
    slider_elem.val(value);
    updateChart(_d,value);
});

//Draw line button
$("#draw-line-btn").click(function(){
//user can only draw one line once, and adjust the end points
    //user line data stored as global variable: userLineData

    svg.on("mousedown", function(event) {
        isDrawing = true;
        let coords = d3.pointer(event);
        startPoint = {x: coords[0], y: coords[1]};
        userLineData= [startPoint]; // Clear the old line data
        svg.select("#userLine").remove(); // Clear the old line from the SVG
    })
        .on("mousemove", function(event) {
            if (!isDrawing) return;
            let coords = d3.pointer(event);
            userLineData[1]={x: coords[0], y: coords[1]};
            svg.select("#userLine").remove(); // Clear the old line from the SVG
            svg.append("path") // Draw the new line
                .datum(userLineData)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", line)
                .attr("id","userLine");
        })
        .on("mouseup", function() {
            isDrawing = false;
            console.log(userLineData);
        });


});

$(document).ready(function(){
  genChart();
  $("#slider-control").hide();//pause the slider as we don't use it in our tasks.

  $("#progresss-txt").text(sampleCnt+"/3");

});

var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("countdown").innerHTML = "Time remaining: 0";
  } else {
    document.getElementById("countdown").innerHTML = "Time remaining: " + timeleft/10 ;
  }
  timeleft -= 1;
}, 100);
