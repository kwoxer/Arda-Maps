var showregions = false;

$("#regionbutton").click(function () {
    if (ardamap.getCurrentAge() != ""){
        showregions = negateValue(showregions);
        if (showregions){
            $("#region").show();
            $("#region-mesh").show();
            $("#regionbutton").addClass("btn-active");
        }else{
            $("#region").hide();
            $("#region-mesh").hide();
            $("#regionbutton").removeClass("btn-active");
        }
    }
});

function negateValue(val){
    return !val;
}