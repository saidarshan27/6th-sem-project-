

// const test=document.querySelector("#test");
// const threemonth=document.getElementById("threemonth");
// const sixmonth=document.getElementById("sixmonth");
// const onemonth=document.getElementById("onemonth");

moment.tz.setDefault("Asia/Kolkata");
var isInside=true;



// const buy1=document.getElementById("buy1");
// const buy3=document.getElementById("buy3");
// const buy6=document.getElementById("buy6");




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


// threemonth.addEventListener("click",function(){
//   buy3.classList.remove("displaymonth");
//   buy1.classList.add("displaymonth");
//   buy6.classList.add("displaymonth");
// })

// sixmonth.addEventListener("click",function(){
//   buy6.classList.remove("displaymonth");
//   buy3.classList.add("displaymonth");
//   buy1.classList.add("displaymonth");
// })

// onemonth.addEventListener("click",function(){
//   buy1.classList.remove("displaymonth");
//   buy6.classList.add("displaymonth");
//   buy3.classList.add("displaymonth");
// })


// test.addEventListener("click",function(){
//   alert("you have clicked");
// })

