// import  {updateDB}  from "./firebase.js";
//
let values = {}
$( "#my-form" ).submit(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();

    $.each($('#my-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
        console.log(values);
    });

    //localStorage.setItem('taskData', JSON.stringify({'user_info': values}))

    window.location.href = "MiniVlat.html";

});