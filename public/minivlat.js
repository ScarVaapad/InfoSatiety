let vlatCnt;

let timeleft = 250;
let dir = "asset/MiniVlat/";
let vlat_files = ["AreaChart.png"
    ,"BarChart.png"
    ,"BubbleChart.png"
    ,"Choropleth.png"
    ,"Choropleth_New.png"
    ,"Histogram.png"
    ,"LineChart.png"
    ,"PieChart.png"
    ,"Scatterplot.png"
    ,"Stacked100.png"
    ,"StackedArea.png"
    ,"StackedBar.png"
    ,"TreeMap.png"]

let vis_file;


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    vlatCnt = urlParams.get("vlat_cnt");
    vis_file = dir+vlat_files[parseInt(vlatCnt)-1];
    let img = $("<img />").attr('src', vis_file).attr('width', '560px').attr('height', '500px').attr('id', 'vlat-img');
    $("#vlat-div").append(img);

    $("#progresss-txt").text((parseInt(vlatCnt)).toString()+"/"+vlat_files.length.toString());
});

$("#next-btn").click(function() {

});
$( "#task-desc" ).submit(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();

    //localStorage.setItem('taskData', JSON.stringify({'user_info': values}))

    window.location.href = "task_description.html";

});

var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.getElementById("countdown").innerHTML = "Time remaining: 0";
        window.location.href = "MiniVlat.html?vlat_cnt="+(parseInt(vlatCnt)+1).toString();
    } else {
        document.getElementById("countdown").innerHTML = "Time remaining: " + timeleft/10 ;
    }
    timeleft -= 1;
}, 100);


