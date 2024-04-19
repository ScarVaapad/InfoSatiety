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
  .attr('style', 'background-color: white')
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


var _d,xMin,xMax,yMin,yMax;

// variables for drawing
var line;

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

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat((domainn,number)=>{return ""}));

    const y = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5])
        .range([ height, 0]);

    svg.append("g")
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
    svg.append('g')
        .selectAll("dot")
        .data(d)
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .join("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", 3.5)
        .style("fill", "Black" );
}

function mousedown() {
    var m = d3.mouse(this);
    line = svg.append("line")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])
        .attr("stroke", "red");

    svg.on("mousemove", mousemove);
}

function mousemove() {
    var m = d3.mouse(this);
    line.attr("x2", m[0])
        .attr("y2", m[1]);
}

function mouseup() {
    svg.on("mousemove", null);
}

//Listeners
//Click button to move to the next example/tutorial
$( "#try-more-btn" ).click(function() {
  window.location.href = "sample.html?samplecnt="+(parseInt(sampleCnt)+1).toString()
});

//Need to be reimplented
$( "#start-task-btn" ).click(function() {

  fetch("color_name_code.json")
    .then(response => response.json())
    .then(function(json) {
      const colorSelected = json[getRandomInt(10)]

      fetch("./asset/task_id_code.json")
        .then(response => response.json())
        .then(function(json) {
          
          const taskNum = json[getRandomInt(10)]
            let my_current_data = JSON.parse(localStorage.getItem('taskData'))
            my_current_data['task_info'] = {
              'task_id': taskNum,
              'color_palette': colorSelected,
              'time': Math.floor(Date.now() / 1000)
            }
            localStorage.setItem('taskData', JSON.stringify(my_current_data))
            window.location.href = "task.html?task="+taskNum+"&cnt=0&color="+colorSelected;
        })
  });
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

//Draw line button
$("#draw-line-btn").click(function(){
//user can only draw one line once, and adjust the end points
    svg.on("mousedown",mousedown)
        .on("mouseup",mouseup);
});

$(document).ready(function(){
  genChart()
  $("#progresss-txt").text(sampleCnt+"/3")
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
