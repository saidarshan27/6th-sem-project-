


// const test=document.querySelector("#test");
// const threemonth=document.getElementById("threemonth");
// const sixmonth=document.getElementById("sixmonth");
// const onemonth=document.getElementById("onemonth");




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
  alert("clicked");
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

