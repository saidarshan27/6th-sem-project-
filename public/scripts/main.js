moment.tz.setDefault("Asia/Kolkata");
var count=0;
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
  console.log(type);
  var comment=$("#supporttxtA").val();
  console.log(comment);
  var data={type:type,comment:comment}
  console.log(data);
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
  $(".ticketcard").show("slow");
  $(this).addClass("active");
  $(this).siblings(".active").removeClass("active");
  $(".supportform").hide("slow");
  $(".userviewticket").hide("slow");
  $(".userticketfilter").show("slow");
  $("#pending").removeClass("active");
   $("#solved").removeClass("active");
   $("#all").addClass("active");
  // if(isInside==true){
    if(count==0){
    $.get("/support",function(data){
      data.forEach(function(ticket){
        const time=moment.tz(ticket.date,"Asia/Kolkata");
        const difftime=moment(time).fromNow();
          $(".ticketcontainer").append(
            `
            <div class="card ticketcard" style="width: 90%;">
            <div class="card-header ticketheader">
             <h5>${ticket.type}</h5>
             <span class="optionsbtn">
             <i class="fas fa-ellipsis-v"></i>
             <label class="deletelbl" href="/support/${ticket._id}"><span style="font-size:.7rem"><i class="far fa-trash-alt mr-2" ></i>Delete</span></lablel>
             </span>
            </div>
            <div class="card-footer ticketfooter">
                <p class="mb-3 ">
                <span class="status">${ticket.status}</span>
                <span class="ml-3 time"><i class="fas fa-clock mr-1"></i> ${difftime}</span>
                </p>
                <a href="/support/${ticket._id}" class="btn btn-outline-danger btn-sm viewticketbtn">View</a>
            </div>
            </div>
            `
          )
            $(".status").each(function(index){
              if($( this ).text()=="Pending"){
                $( this ).addClass("colorP");
                $( this ).parents(".ticketcard").addClass("pending")
              }else{
                $( this ).addClass("colorS");
                $( this ).parents(".ticketcard").addClass("solved");
              }
            })
      })
      usertickets=$(".ticketcard");
      })
      // isInside=false;
  // }
     count+=+1;
    }
  })



$("#Raiseticketbtn").on("click",function(){
  isInside=true;
  console.log(isInside);
  $(this).addClass("active");
  $(this).siblings(".active").removeClass("active");
  $(".ticketcard").hide("slow");
  $(".supportform").show("slow");
  $(".userviewticket").hide("slow");
  $(".userticketfilter").hide("slow");
})

$(".ticketcontainer").on("click",".viewticketbtn",function(e){
  count=0;
  e.preventDefault();
  $(".filterdiv").fadeOut();
  $(".statuscard").fadeOut();
  const url=$(this).attr("href");
  if(count==0){
    $.get(url,function(data){
      $(".ticketcard").hide("slow");
      const time=moment(data.date).format("DD.MM.YYYY HH:mm");
      const type=data.type;
      const comment=data.comment;
      const id=data._id;
      $(".ticketcontainer").append(
        `
        <div class="col-md-12 userviewticket">
              <form action="/admin/support/<%=ticket._id %>?_method=PUT" method="POST">
              <div>
                  <label>Ticket Refrence Number</label>
              </div>
              <div>
                 <label class="form-control" style="padding-top:10px;padding-bottom:10px;height:45px;">${id}</label>
              </div>
              <div>
                  <label>Type</label>
              </div>
              <div>
                 <input type="text" class="form-control" value="${type}" disabled></input>
              </div>
              <div>
                  <label>Comments</label>
              </div>
              <div>
                  <input type="text" class="form-control" value="${comment}">
              </div>
          </form>
          <ul class="navbar-nav">
          <li class="nav-item">
          <a class="nav-link gobackbtn">Go back</a>
          </li>
          <ul>
          </div>
  
        `
      )
    })
    count+=+1;
  }
})

$("#pending").on("click",function(){
  $("#all").removeClass("active");
  $("#solved").removeClass("active");
  $(this).addClass("active");
  tickets.filter(".pending").show();
  tickets.not(".pending").hide();
  usertickets.filter(".pending").show("slow");
  usertickets.not(".pending").hide("slow");
  
})

$("#solved").on("click",function(){
  $("#pending").removeClass("active");
  $("#all").removeClass("active");
  $(this).addClass("active");
  tickets.not(".pending").show();
  tickets.filter(".pending").hide();
  usertickets.filter(".pending").hide("slow");
  usertickets.not(".pending").show("slow");
})

$("#all").on("click",function(){
   $("#pending").removeClass("active");
   $("#solved").removeClass("active");
   $("#all").addClass("active");
  tickets.show("slow");
  usertickets.show("slow");
})

$(".ticketcontainer").on("click",".gobackbtn",function(){
  $(".userviewticket").hide("slow");
  $(".ticketcard").show("show");
  $("#pending").removeClass("active");
  $("#solved").removeClass("active");
  $("#all").addClass("active");
})

$(".ticketcontainer").on("click",".optionsbtn",function(){
  const kyabre=$(this).find(".deletelbl");
  kyabre.toggle("slow");
})

$(".ticketcontainer").on("click",".deletelbl",function(){
  const url=$(this).attr("href");
  const parent=$(this).parents(".ticketcard");
  $.ajax({
    method:"DELETE",
    url:url
  })
  parent.remove();
})

$(".ticketcontainer").on("click",".filterdiv",function(){
  const kyabre1=$(this).siblings(".statuscard");
  kyabre1.fadeToggle();
})

