let vlatCnt;


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    vlatCnt = urlParams.get("vlat_cnt");


});

$( "#task-desc" ).submit(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();

    $.each($('#my-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
        console.log(values);
    });

    //localStorage.setItem('taskData', JSON.stringify({'user_info': values}))

    window.location.href = "task_description.html";

});