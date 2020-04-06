moment.tz.setDefault("Asia/Kolkata");
var isInside=true;
const tickets=$(".adminsupporticket");

$(function(){
  $(".adminsupporticket" ).each(function( index ) {
    if($( this ).find(".status").text()=="Pending"){
      $( this ).addClass("pending");
      $( this ).find(".status").addClass("colorP");
    }else{
      $( this ).addClass("solved");
      $( this ).find(".status").addClass("colorS");
    }
  });
})

$("#threemonth").on("click",function(){
  $("#buy3").removeClass("displaymonth");
  $("#buy1").addClass("displaymonth");
  $("#buy6").addClass("displaymonth");
})

$("#sixmonth").on("click",function(){
  $("#buy6").removeClass("displaymonth");
  $("#buy3").addClass("displaymonth");
  $("#buy1").addClass("displaymonth");
})

$("#onemonth").on("click",function(){
  $("#buy1").removeClass("displaymonth");
  $("#buy3").addClass("displaymonth");
  $("#buy6").addClass("displaymonth");
})

$("#routerpricebutton").on("click",function(){
  var name=$("#routername1").text();
  var price=$("#routerprice").text();
  var data={routername:name,price:price}
  $.ajax({
    method:"POST",
    url:"/admin/request/new-router",
    data:data
  })

})
$("#supportbtn").on("click",function(){
  var type=$("#supporttype").val();
  var comment=$("#supporttxtA").val();
  var data={type:type,comment:comment}
  $.ajax({
    method:"POST",
    url:"/admin/support",
    data:data
  })
})

$("#newconbtn").click(function(){
  const name=$("#newconname").val();
  const phone=$("#newconphone").val();
  const plan=$("#newconplan").val();
  const address=$("#newconaddress").val();
  const locality=$("#newconlocality").val();
  const email=$("#newconemail").val();
  const data={name:name,phone:phone,plan:plan,address:address,locality:locality,email:email}
  console.log(data);
  $.ajax({
    method:"POST",
    url:"/admin/request/new-connection",
    data:data
  })
})

$("#Viewticketsbtn").on("click",function(){
  $(this).addClass("active");
  $(this).siblings(".active").removeClass("active");
  $(".supportform").hide("slow");
  if(isInside==true){
    $.get("/support",function(data){
      data.forEach(function(ticket){
        const time=moment.tz(ticket.date,"Asia/Kolkata");
        const difftime=moment(time).fromNow();
          $(".ticketcontainer").append(
            `
            <div class="card ticketcard">
            <div class="card-header ticketheader">
             <h5>${ticket.type}</h5>
            </div>
            <div class="card-footer ticketfooter">
                <p class="mb-3">${ticket.status}<span class="ml-3"><i class="fas fa-clock mr-1"></i> ${difftime}<span></p>
            </div>
            </div>
            `
          )
      })
      })
      isInside=false;
      console.log(isInside);
  }
  })

$("#Raiseticketbtn").on("click",function(){
  isInside=true;
  console.log(isInside);
  $(this).addClass("active");
  $(this).siblings(".active").removeClass("active");
  $(".ticketcard").hide("slow");
  $(".supportform").show("slow");
})


$("#pending").on("click",function(){
  $("#all").removeClass("active");
  $("#solved").removeClass("active");
  $(this).addClass("active");
  tickets.filter(".pending").show();
  tickets.not(".pending").hide();
})

$("#solved").on("click",function(){
  $("#pending").removeClass("active");
  $("#all").removeClass("active");
  $(this).addClass("active");
  tickets.not(".pending").show();
  tickets.filter(".pending").hide();
})

$("#all").on("click",function(){
   $("#pending").removeClass("active");
   $("#solved").removeClass("active");
   $("#all").addClass("active");
  tickets.show();
})