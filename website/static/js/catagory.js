$(document).ready(function () {
    // Card Multi Select
    $("input[type=checkbox]").click(function () {
        if ($(this).parent().hasClass("active")) {
            $(this).parent().removeClass("active");
        } else {
            $(this).parent().addClass("active");
        }
    });
});
