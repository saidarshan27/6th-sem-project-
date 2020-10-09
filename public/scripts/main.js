moment.tz.setDefault('Asia/Kolkata');
var count = 0;
const tickets = $('.adminsupporticket');

$(function($) {
	$('.adminsupporticket').each(function(index) {
		if ($(this).find('.status').text() == 'Pending') {
			$(this).addClass('pending');
			$(this).find('.status').addClass('colorP');
		} else {
			$(this).addClass('solved');
			$(this).find('.status').addClass('colorS');
		}
	});
});

$('#threemonth').on('click', function() {
	$('#buy3').removeClass('displaymonth');
	$('#buy1').addClass('displaymonth');
	$('#buy6').addClass('displaymonth');
});

$('#sixmonth').on('click', function() {
	$('#buy6').removeClass('displaymonth');
	$('#buy3').addClass('displaymonth');
	$('#buy1').addClass('displaymonth');
});

$('#onemonth').on('click', function() {
	$('#buy1').removeClass('displaymonth');
	$('#buy3').addClass('displaymonth');
	$('#buy6').addClass('displaymonth');
});

$('.supportform').on('submit', function(e) {
	e.preventDefault();
	if ($(this).serialize().length > 15) {
		$('#exampleModal').modal('show');
		var type = $('#supporttype').val();
		var comment = $('#supporttxtA').val();
		var data = { type: type, comment: comment };
		$.ajax({
			method: 'POST',
			url: '/admin/support',
			data: data
		});
	}
});

$('.newconform').on('submit', function(e) {
	if (
		$('.reqfield').filter(function() {
			return this.value === '';
		}).length === 0
	) {
		e.preventDefault();
		$('#exampleModal').modal('show');
		const name = $('#newconname').val();
		const phone = $('#newconphone').val();
		const plan = $('#newconplan').val();
		const address = $('#newconaddress').val();
		const locality = $('#newconlocality').val();
		const email = $('#newconemail').val();
		const data = { name: name, phone: phone, plan: plan, address: address, locality: locality, email: email };
		$.ajax({
			method: 'POST',
			url: '/admin/request/new-connection',
			data: data
		});
	} else {
		e.preventDefault();
	}

	// console.log($( this ).serialize().length);
	// if($(".reqfield").each().val!=0){
	//   $('#exampleModal').modal('show');
	//   const name=$("#newconname").val();
	//   const phone=$("#newconphone").val();
	//   const plan=$("#newconplan").val();
	//   const address=$("#newconaddress").val();
	//   const locality=$("#newconlocality").val();
	//   const email=$("#newconemail").val();
	//   const data={name:name,phone:phone,plan:plan,address:address,locality:locality,email:email}
	//   $.ajax({
	//     method:"POST",
	//     url:"/admin/request/new-connection",
	//     data:data
	//   })
	// }
});

$('#Viewticketsbtn').on('click', function() {
	$('.ticketcard').show('slow');
	$(this).addClass('active');
	$(this).siblings('.active').removeClass('active');
	$('.supportform').hide('slow');
	$('.userviewticket').hide('slow');
	$('#pending').removeClass('active');
	$('#solved').removeClass('active');
	$('#all').addClass('active');
	$.get('/support', function(data) {
		console.log(data);
		data.forEach(function(ticket) {
			const time = moment.tz(ticket.date, 'Asia/Kolkata');
			const difftime = moment(time).fromNow();
			if (count == 0) {
				$('.ticketcontainer').append(
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
				);
			}
			$('.status').each(function(index) {
				if ($(this).text() == 'Pending') {
					$(this).addClass('colorP');
					$(this).parents('.ticketcard').addClass('pending');
				} else {
					$(this).addClass('colorS');
					$(this).parents('.ticketcard').addClass('solved');
				}
			});
		});
		count += +1;
		usertickets = $('.ticketcard');
		if (usertickets.length == 0) {
			$('.userticketfilter').hide();
			$('.nothingtoshow').show('slow');
		} else {
			$('.userticketfilter').show('slow');
		}
	});
});

$('#Raiseticketbtn').on('click', function() {
	$('.nothingtoshow').hide('slow');
	$(this).addClass('active');
	$(this).siblings('.active').removeClass('active');
	$('.ticketcard').hide('slow');
	$('.supportform').show('slow');
	$('.userviewticket').hide('slow');
	$('.userticketfilter').hide('slow');
});

$('.ticketcontainer').on('click', '.viewticketbtn', function(e) {
	count = 0;
	e.preventDefault();
	$('.statuscard').fadeOut();
	$('.userticketfilter').hide('slow');
	const url = $(this).attr('href');
	if (count == 0) {
		$.get(url, function(data) {
			$('.ticketcard').hide('slow');
			const time = moment(data.date).format('DD.MM.YYYY HH:mm');
			const type = data.type;
			const comment = data.comment;
			const id = data._id;
			const status = data.status;
			$('.ticketcontainer').append(
				`
        <div class="col-md-12 userviewticket">
        <div class="col-md-5 mr-5">
        <form url="/support/${id}">
          <label style="width: 50em;display: flex;justify-content: space-between;">
          <strong>Ticket Refrence Number</strong>
          <span class="status">${status}</span>
          </label>
          <div class="input-group mb-3" style="width:50em">
              <input type="text" class="form-control ticketinput" value="${id}" name="id" disabled="true">
            </div>
          <label><strong>Type</strong></label>
          <div class="input-group mb-3" style="width:50em">
              <input type="text" class="form-control ticketinput" value="${type}" name="type" disabled="true">
            </div>
          <label><strong>Comment</strong></label>
          <div class="input-group mb-3" style="width:50em">
              <input type="text" class="form-control ticketinput" value="${comment}" name="comment" disabled="true">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary editdonebtn" type="button" style="display: none;"><i class="fas fa-check"></i></button>
                <button class="btn btn-outline-secondary editcancelbtn" type="button" style="display: none;"><i class="fas fa-times"></i></button>
                <button class="btn btn-outline-secondary profileditbtn" type="button"><i class="fas fa-pencil-alt"></i></button>
              </div>
            </div>
          <ul class="navbar-nav">
          <li class="nav-item">
          <a class="nav-link gobackbtn">Go back</a>
          </li>
          <ul>
          </div>
        `
			);
			$('.status').each(function(index) {
				if ($(this).text() == 'Pending') {
					$('.profileditbtn').show();
					$(this).addClass('colorP');
				} else {
					$('.profileditbtn').hide();
					$('.profileditbtn').parents().siblings('.form-control').prop('disabled', true);
					$(this).addClass('colorS');
				}
			});
		});
		count += +1;
	}
});

$('#pending').on('click', function() {
	$('.nothingtoshow').hide('slow');
	$('#all').removeClass('active');
	$('#solved').removeClass('active');
	$(this).addClass('active');
	const userPendingTickets = usertickets.filter('.pending');
	if (userPendingTickets.length == 0) {
		$('.nothingtoshow').show('slow');
	} else {
		userPendingTickets.show('slow');
	}
	usertickets.not('.pending').hide('slow');
});

$('#adminpending').on('click', function() {
	$('.nothingtoshow').hide('slow');
	$('#adminall').removeClass('active');
	$('#adminsolved').removeClass('active');
	$(this).addClass('active');
	const adminpending = tickets.filter('.pending');
	if (adminpending.length == 0) {
		$('.nothingtoshow').show('slow');
	}
	tickets.not('.pending').hide();
	tickets.filter('.pending').show();
});

$('#adminsolved').on('click', function() {
	$('.nothingtoshow').hide('slow');
	$('#adminall').removeClass('active');
	$('#adminpending').removeClass('active');
	$(this).addClass('active');
	const adminsolved = tickets.not('.pending');
	if (adminsolved.length == 0) {
		$('.nothingtoshow').show('slow');
	}
	tickets.filter('.pending').hide('slow');
	tickets.not('.pending').show('slow');
});

$('#adminall').on('click', function() {
	$('.nothingtoshow').hide('slow');
	$('#adminsolved').removeClass('active');
	$('#adminpending').removeClass('active');
	$(this).addClass('active');
	tickets.show('slow');
});

$('#solved').on('click', function() {
	$('#pending').removeClass('active');
	$('#all').removeClass('active');
	$(this).addClass('active');
	const adminsolvedtickets = tickets.not('.pending');
	if (adminsolvedtickets.length == 0) {
		$('.nothingtoshow').show('slow');
	} else {
		adminsolvedtickets.show('slow');
		tickets.filter('.pending').hide('slow');
	}
	const userSolvedTickets = usertickets.not('.pending');
	if (userSolvedTickets.length == 0) {
		$('.nothingtoshow').show('slow');
	} else {
		userSolvedTickets.show('slow');
		$('.nothingtoshow').hide();
	}
	usertickets.filter('.pending').hide('slow');
});

$('#all').on('click', function() {
	$('.nothingtoshow').hide();
	$('#pending').removeClass('active');
	$('#solved').removeClass('active');
	$('#all').addClass('active');
	usertickets.show('slow');
});

$('.ticketcontainer').on('click', '.gobackbtn', function() {
	$('.userviewticket').hide('slow');
	$('.ticketcard').show('show');
	$('.userticketfilter').show('slow');
	$('#pending').removeClass('active');
	$('#solved').removeClass('active');
	$('#all').addClass('active');
});

$('.ticketcontainer').on('click', '.optionsbtn', function() {
	const kyabre = $(this).find('.deletelbl');
	kyabre.toggle('slow');
});

$('.ticketcontainer').on('click', '.deletelbl', function() {
	const url = $(this).attr('href');
	const parent = $(this).parents('.ticketcard');
	$.ajax({
		method: 'DELETE',
		url: url,
		success: function(data) {
			parent.remove();
			const parentafter = $('.ticketcard');
			if (parentafter.length == 0) {
				$('.nothingtoshow').show('slow');
			}
		}
	});
});

$('.ticketcontainer').on('click', '.profileditbtn', function() {
	$(this).siblings().toggle('slow');
	$(this).parent().siblings('.form-control').prop('disabled', false);
	$(this).parent().siblings('.form-control').focus();
});

$('.ticketcontainer').on('click', '.editcancelbtn', function() {
	const input = $(this).parents().siblings('.ticketinput');
	input.focusout();
	input.prop('disabled', true);
	$(this).hide('slow');
	$(this).siblings('.editdonebtn').hide('slow');
});

$('.ticketcontainer').on('click', '.editdonebtn', function() {
	$(this).hide('slow');
	$(this).siblings('.editcancelbtn').hide('slow');
	const input = $(this).parents().siblings('.ticketinput');
	input.focusout();
	input.prop('disabled', true);
	const key = input.attr('name');
	const data = { [key]: input.val() };
	const url = $(this).parents('form').attr('url');
	$originalItem = input;
	$.ajax({
		method: 'PUT',
		url: url,
		data: data,
		originalItem: $originalItem,
		success: function(data) {
			const editdata = data[key];
			this.originalItem.val(`${editdata}`);
		}
	});
	input.css('border', '3px solid green');
	setTimeout(function() {
		input.css('border', '1px solid #ced4da');
		input.prop('disabled', true);
	}, 1500);
});

$('.profileditbtn').click(function() {
	$(this).siblings().toggle('slow');
	$(this).parent().siblings('.form-control').prop('disabled', false);
	$(this).parent().siblings('.form-control').focus();
});

$('.editdonebtn').click(function() {
	$(this).hide('slow');
	$(this).siblings('.editcancelbtn').hide('slow');
	const input = $(this).parents().siblings('.profileinput');
	input.focusout();
	const key = input.attr('name');
	const data = { [key]: input.val() };
	const url = $(this).parents('form').attr('url');
	console.log(url);
	$originalItem = input;
	$.ajax({
		method: 'PUT',
		url: url,
		data: data,
		originalItem: $originalItem,
		success: function(data) {
			const editdata = data[key];
			if (key == 'name') {
				$('.profilecardname').text(`${editdata}`);
			}
			this.originalItem.val(`${editdata}`);
		}
	});
	input.css('border', '3px solid green');
	$(this).parents('.input-group').siblings().show('slow').delay(1000).hide('slow');
	setTimeout(function() {
		input.css('border', '1px solid #ced4da');
		input.prop('disabled', true);
	}, 1500);
});

$('.editcancelbtn').click(function() {
	const input = $(this).parents().siblings('.profileinput');
	input.focusout();
	input.prop('disabled', true);
	$(this).hide('slow');
	$(this).siblings('.editdonebtn').hide('slow');
});

$('.cameraicon').click(function() {
	$('.fielupload').toggle('slow');
});

$('.custom-file-input').change(function() {
	var file = $('.custom-file-input')[0].files[0].name;
	$('.custom-file-label').text(file);
});

$('.ticketuserinfo').click(function() {
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
	$('.adminticketform').hide('slow');
	$('.personalsupportinfo').show('slow');
	const url = $('.adminticketform').attr('url');
	console.log(url);
	if (count === 0) {
		$.get(url, function(data){
			console.log(data);
			$('.realticket').append(`
      <div class="personalsupportinfo">
      <div class="input-group">
      <label class="activeuser d-flex justify-content-between" style="width: 50em;">
      <strong>Name</strong>
      <span class="isconuser " style="	font-size: .9rem;font-family: 'Baloo 2',cursive;font-weight: 700;color:green">
      Active Connection User
      </span>
      </label>
      </div>
      <label class="form-control mb-3">${data.name}</label>
      <div class="input-group">
      <label><strong>Plan</strong></label>
      </div>
      <label class="form-control mb-3">${data.plan}</label>
      <div class="input-group">
      <label><strong>E-mail ID</strong></label>
      </div>
      <label class="form-control mb-3">${data.email}</label>
      <div class="input-group">
      <label><strong>Phone</strong></label>
      </div>
      <label class="form-control mb-3">${data.phone}</label>
      <div class="input-group">
      <label><strong>Address</strong></label>
      </div>
      <textarea class="form-control mb-3">${data.address}</textarea>
      </div>
      `);
		});
		count += +1;
	}
});

$('.ticketinfo').click(function() {
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
	$('.adminticketform').show('slow');
	$('.personalsupportinfo').hide('slow');
});

$('.faq-open').click(function() {
	if ($(this).parent('.faqtitle').siblings('.faq-answer').hasClass('opened')) {
		$(this).parent('.faqtitle').siblings('.faq-answer').removeClass('opened');
		$(this).parent('.faqtitle').siblings('.faq-answer').fadeOut('slow');
		$(this).html(`<i class="fas fa-plus">`);
	} else {
		$(this).html(`<i class="fas fa-minus">`);
		$(this).parent('.faqtitle').siblings('.faq-answer').fadeIn('slow');
		$(this).parent('.faqtitle').siblings('.faq-answer').addClass('opened');
	}
});
