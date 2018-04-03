
check();//表单验证
var updateFee = function () {
    $("[id^='fee_']").addClass("hide");
    var member = $("input[name='member']:checked").val();
    var pay =  $("input[name='pay']:checked").val();
    if(member==1){
        if(pay==1){
            $("#fee_sense_1").removeClass("hide");
        }else {
            $("#fee_1").removeClass("hide");
        }
    }else {
        if(pay==1){
            $("#fee_sense_2").removeClass("hide");
        }else {
            $("#fee_2").removeClass("hide");
        }
    }

};
$("input[name='member']").click(updateFee);
$("input[name='pay']").click(updateFee);