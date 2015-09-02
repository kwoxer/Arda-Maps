var showregions = false;

$("#regionbutton").click(function () {
    if (ardamap.getCurrentAge() != ""){
        showregions = negateValue(showregions);
        if (showregions){
            $("#region").show();
            $("#region-mesh").show();
            $("#regionbutton").addClass("regionbuttonactive");
        }else{
            $("#region").hide();
            $("#region-mesh").hide();
            $("#regionbutton").removeClass("regionbuttonactive");
        }
    }
});

function negateValue(val){
    return !val;
}