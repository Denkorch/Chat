$(document).ready(function() {

	//Log-in/Sign-up Page

	$('.log-js').click(function(event){
		event.preventDefault();
		$('.form2').removeClass("active");
		$('.form1').addClass("active");
	});

	$('.sign-js').click(function(event){
		event.preventDefault();
		$('.form1').removeClass("active");
		$('.form2').addClass("active");
	});


	$('.form2').submit(function(e) {
		e.preventDefault();

		$.ajax({
			url: 'http://api.prolaby.com/api/post/newuser',
            type: "POST",
            data: {
            	login: $("#signUpName").val(),
            	pass: $("#signUpPass").val(),
            	name: $("#signUpName").val()
            },
            success: function(data){
            	console.log(data);
            },
            error: function() {
            	alert('GetUser Ошибка доступа к базе!');
            }
        });

		var conf = document.getElementById('signUpPass2');
		if (conf.value != document.getElementById('signUpPass').value) {
			alert('Password should match!')
			};
	});



	// document.getElementById('signUpPass2').oninput = function() {
	// 	if (this.value != $('#signUpPass').value) {
	// 		this.setCustomValidity('Password Must be Matching!');
	// 		} else {
	// 		// input is valid -- reset the error message
	// 		this.setCustomValidity('');
	// 		}
	// };

	var h = $(window).height() * 0.75;
	$('.user-list').css("height", h + 'px');


	//Index Page

	//Upload contact list

	(function($){
		$.fn.AddContactList = function(){

			var status = function(arg) {
				if (!arg) {
					return("offline");
				} else {
					return("online");
				}
			};

			$.ajax({
                url: 'http://api.prolaby.com/api/get/allusers',
                type: "GET",
                success: function(data){
                	for (var i = 0; i < data.length; i++) {
						$('.list-group').append('<li class="list-group-item">' + data[i].name + '<span class="status">' + status(data[i].online) + '</span>' + '</li>')
						$('li.list-group-item').eq(i).attr("data-id", data[i].id);
					};
                },
                error: function() {
                    alert('GetUser Ошибка доступа к базе!');
                }
            });

		}
	})(jQuery);
	$('.user-list').AddContactList();

	
});