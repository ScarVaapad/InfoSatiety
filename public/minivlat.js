let vlatCnt;

let timeleft = 250;
let dir = "asset/MiniVlat/";
let vlat_files = [
    "TreeMap.png"
    ,"Stacked100.png"
    ,"Histogram.png"
    ,"Choropleth_New.png"
    ,"PieChart.png"
    ,"BubbleChart.png"
    ,"StackedBar.png"
    ,"LineChart.png"
    ,"BarChart.png"
    ,"StackedArea.png"
    ,"AreaChart.png"
    ,"Scatterplot.png"
]

let questions = ["Q1: eBay is nested in the Software category.",
    "Q2: Which country has the lowest proportion of Gold medals?",
    "Q3: What distance have customers traveled in the taxi the most?",
    "Q4: In 2020, the unemployment rate for Washington (WA) was higher than that of Wisconsin (WI)?",
    "Q5: What is the approximate global smartphone market share of Samsung?",
    "Q6: Which city’s metro system has the largest number of stations?",
    "Q7: What is the cost of peanuts in Seoul?",
    "Q8: What was the price of a barrel of oil in February 2020?",
    "Q9: What is the average internet speed in Japan?",
    "Q10: What was the average price of a pound of coffee in October 2019?",
    "Q11: .What was the ratio of girls named “Isla” to girls named “Amelia” in 2012 in the UK?",
    "Q12: .There is a negative relationship between the height and the weight of the 85 males."]

let answers = [["True", "False"],
    ["Great Britain", "USA", "Japan", "Australia"],
    ["60-70 km", "30-40 km", "20-30 km", "50-60 km"],
    ["True", "False"],
    ["17.6%", "25.3%", "10.9%", "35.2%"],
    ["Beijing", "Shanghai", "London", "Seoul"],
    ["$5.2", "$6.1", "$7.5", "$4.5"],
    ["$50.54", "$47.02", "$42.34", "$43.48"],
    ["42.30 Mbps", "40.51 Mbps", "35.25 Mbps", "16.16 Mbps"],
    ["$0.71", "$0.90", "$0.80", "$0.63"],
    ["1 to 1", "1 to 2", "1 to 3", "1 to 4"],
    ["True", "False"]]

let correct_answers = ["False", "Great Britain", "30-40 km", "True", "17.6%", "Shanghai", "$6.1", "$50.54", "40.51 Mbps", "$0.71", "1 to 2", "False"]

let vis_file,vis_question,vis_choices,vis_correct_answer;
let user_response = {};
let user_minivlat_score = 0;

function task_finish_handler(){

}


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    vlatCnt = urlParams.get("vlat_cnt");

    if(vlatCnt == vlat_files.length){
        $("#next-btn").hide();
        $("#task-desc").show();
    }

    let _cnt = parseInt(vlatCnt)-1;
    vis_file = dir+vlat_files[_cnt];
    vis_question = questions[_cnt];
    vis_choices = answers[_cnt];
    vis_correct_answer = correct_answers[_cnt];



    let img = $("<img />").attr('src', vis_file).attr('width', '560px').attr('height', '500px').attr('id', 'vlat-img');
    $("#vlat-div").append(img);
    $("#question-div").text(vis_question);

    $.each(vis_choices, function(i, val){
        $("#choice-list").append("<li><input type='radio' name='vlat-choices' value='"+val+"'>"+val+"</li>");
    });

    $("#progresss-txt").text((parseInt(vlatCnt)).toString()+"/"+vlat_files.length.toString());
});

$("#next-btn").click(function() {
    let selected = $("input[type='radio'][name='vlat-choices']:checked");
    if(selected.length > 0){
        user_response[vis_question] = selected.val();
        if(selected.val() == vis_correct_answer){
            user_minivlat_score += 1;
        }
        window.location.href = "MiniVlat.html?vlat_cnt="+(parseInt(vlatCnt)+1).toString();
    }else{
        alert("Please select an answer");
    }
});
$("#task-desc").click(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();

    //localStorage.setItem('taskData', JSON.stringify({'user_info': values}))

    window.location.href = "task_description.html";

});

var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.getElementById("countdown").innerHTML = "Time remaining: 0";
        task_finish_handler();
    } else {
        document.getElementById("countdown").innerHTML = "Time remaining: " + timeleft/10 ;
    }
    timeleft -= 1;
}, 100);


