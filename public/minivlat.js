let vlatCnt;


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    vlatCnt = urlParams.get("vlat_cnt");


});

$("#task-desc").click(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();

    //localStorage.setItem('taskData', JSON.stringify({'user_info': values}))

    window.location.href = "task_description.html";

});