let vlatCnt;


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    vlatCnt = urlParams.get("vlat_cnt");
});