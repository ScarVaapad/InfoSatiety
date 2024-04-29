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
let directory='./asset/Examples/';
let samples = ['s01_cor@0.5_m@1.5_b@0.5.csv','s02_cor@0.2_m@0.8_b@-0.8.csv','s03_cor@0.9_m@-1.8_b@-0.5.csv']
// let directory='./asset/Tasks/';
// let samples = ['t01_cor@0.3_m@1_b@0.csv','t02_cor@0.3_m@0.5_b@0.5.csv','t03_cor@0.3_m@-2_b@1.csv','t04_cor@0.3_m@-0.5_b@1.csv','t05_cor@0.8_m@2_b@2.csv','t06_cor@0.8_m@0.5_b@-1.csv','t07_cor@0.8_m@-1_b@-1.csv','t08_cor@0.8_m@-0.3_b@0.75.csv']

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

// variables for reward calculation
let reward = 100;

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
    let d = _d.slice(0,num);
    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([ 0, width ]);
    const y = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5])
        .range([ height, 0]);
    if(num != _d.length){    
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
        .transition(3000)
        .style("fill", function(d, i) {
            if (i < d_total-d_reveal){
                return "Black"; // Color for old data points
            } else {
                return "Blue"; // Color for new data points
            }
        });
    }else{//if all data points are shown, then all data points are grey, allowing user to see the regression line in yellow?
        margin_svg.append('g')
        .selectAll("dot")
        .data(d)
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .join("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", 3.5)
        .style("fill", "Grey"); 
    }

}

function showLine(_d){
    // draw the regression line for the data points on the scatterplot
    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([ 0, width ]);
    const y = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5])
        .range([ height, 0]);

    const x_values = _d.map(d => x(d.x));
    const y_values = _d.map(d => y(d.y));
    const x_mean = d3.mean(x_values);
    const y_mean = d3.mean(y_values);
    const m = d3.sum(x_values.map((x, i) => (x - x_mean) * (y_values[i] - y_mean))) / d3.sum(x_values.map(x => (x - x_mean) ** 2));
    const b = y_mean - m * x_mean;
    const reg_line_data = [{x: x(xMin), y: m * x(xMin) + b}, {x: x(xMax), y: m * x(xMax) + b}];

    margin_svg.append("path") // Draw the regression line
        .datum(reg_line_data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2.5)
        .attr("d", line)
        .attr("id","regLine");
    console.log("Regression line drawn:");
    
    reg_line_data.forEach(function(d){
        d.x += margin.left;
        d.y += margin.top;
    }
    ); 
    console.log(reg_line_data);
     
}

function calculateCI(_d){ //questionable
    // calculate the confidence interval for the regression line
    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([ 0, width ]);
    const y = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5])
        .range([ height, 0]);

    const x_values = _d.map(d => x(d.x));
    const y_values = _d.map(d => y(d.y));
    const x_mean = d3.mean(x_values);
    const y_mean = d3.mean(y_values);
    const m = d3.sum(x_values.map((x, i) => (x - x_mean) * (y_values[i] - y_mean))) / d3.sum(x_values.map(x => (x - x_mean) ** 2));
    const b = y_mean - m * x_mean;
    const y_hat = _d.map(d => m * x(d.x) + b);
    const residuals = _d.map((d, i) => y(d.y) - y_hat[i]);
    const sse = d3.sum(residuals.map(r => r ** 2));
    const n = _d.length;
    const se = Math.sqrt(sse / (n - 2));
    const x_var = d3.sum(x_values.map(x => (x - x_mean) ** 2));
    const se_m = se / Math.sqrt(x_var);
    const se_b = se * Math.sqrt(1 / n + x_mean ** 2 / x_var);
    const t = 2.776; // 99% confidence interval
    const ci_m = t * se_m;
    const ci_b = t * se_b;

    return {m: m, b: b, ci_m: ci_m, ci_b: ci_b};
}


//Listeners

//Slider for scatterplot numbers, could change the tick
// $("#slider-control").change(function(e){
//     let slider_elem = $(this);
//     let value = slider_elem.val();
//     updateChart(_d,value);
// });
// //Prevent sliding to the left
// $("#slider-control").on("input", function(e) {
//     const currentValue = parseInt(e.target.value, 10);

//     if (currentValue > prevValue) {
//         // Allow sliding to the right
//         prevValue = currentValue;
//     } else {
//         // Prevent sliding to the left
//         e.target.value = prevValue;
//     }
//     console.log("Slider bar moved");
//     updateChart(_d, currentValue);
// });

//Button function to add more data to the scatterplot
$("#add-more-btn").click(function(){
    if(reward >=0){
        reward -=2
    }else{
        reward = 0;
    }
    d_total += d_reveal;
    updateChart(_d,d_total);
});

//Draw line button
$("#draw-line-btn").click(function(){
//user can only draw one line once, and adjust the end points
    //user line data stored as global variable: userLineData
    $("#add-more-btn").prop('disabled', true).css('background-color', 'grey');
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
                .attr("stroke-width", 2.5)
                .attr("d", line)
                .attr("id","userLine");
        })
        .on("mouseup", function() {
            isDrawing = false;
            console.log(userLineData);
        });
});
//Need to be reimplented
$("#submit-result-btn" ).click(function() {
    //Give answers to participants
    // first, show all data points on scatterplot
    $("#add-more-btn").prop('disabled', true).css('background-color', 'gray');
    $("#draw-line-btn").prop("disabled", true).css("background-color", "gray");
    svg.on("mousedown",null);
    svg.on("mousemove",null);
    svg.on("mouseup",null);
    updateChart(_d,_d.length);
    // then, show the regression line of the scatterplot
    showLine(_d);
    // show the reward
    alert("You have earned " + reward + " points!");

    //pass the data to the database
});

$("#next-btn").click(function(){
    //and if count is 3, submitting will result into the next page
    if (parseInt(sampleCnt) == samples.length) {
        window.location.href = "finish.html";
    }else{
        window.location.href = "sample.html?samplecnt="+(parseInt(sampleCnt)+1).toString();
    }
});
$(document).ready(function(){
    genChart();
    $("#progresss-txt").text(sampleCnt+"/3");
    $("#slider-control").hide();//pause the slider as we don't use it in our tasks.
    $("#add-more-btn").show();
    $("#draw-line-btn").show();
    $("#submit-result-btn").show();
    $("#next-btn").hide();
});

// var downloadTimer = setInterval(function(){
//   if(timeleft <= 0){
//     clearInterval(downloadTimer);
//     document.getElementById("countdown").innerHTML = "Time remaining: 0";
//   } else {
//     document.getElementById("countdown").innerHTML = "Time remaining: " + timeleft/10 ;
//   }
//   timeleft -= 1;
// }, 100);
