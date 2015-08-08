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
            type: "GET",
            data: {
            	login: $("#signUpName").val(),
            	pass: $("#signUpPass").val(),
            	name: $("#signUpName").val()
            },
            success: function(data){
            	console.log(data);
            },
            error: function() {
            	alert('SignUp: Ошибка доступа к базе!');
            }
        });

		var conf = document.getElementById('signUpPass2');
		if (conf.value != document.getElementById('signUpPass').value) {
			alert('Password should match!')
			};
	});

	$('.form1').submit(function(e) {
		e.preventDefault();

		$.ajax({
			url: 'http://api.prolaby.com/api/get/user',
            type: "GET",
            data: {
            	login: $(".login").val(),
            	pass: $(".logPass").val()
            },
            success: function(data){
            	if (data) {
            		var login = $(".login").val();
            		document.cookie = "userName = " + login;
            		document.cookie = "userId = " + data[0].id;
            		window.location.href = "http://denkorch.github.io";
            	} else {
            		window.location.reload();
            	};
            },
            error: function() {
            	alert('Login: Ошибка доступа к базе!');
            }
        });

		var conf = document.getElementById('signUpPass2');
		if (conf.value != document.getElementById('signUpPass').value) {
			alert('Password doesn`t match!')
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
	$('.message-list').css("height", h + 'px');


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
						$('.user-list').append('<li class="list-group-item li-user-list">' + data[i].name + '<span class="status">' + status(data[i].online) + '</span>' + '</li>')
						$('li.li-user-list').eq(i).attr("data-id", data[i].id);
					};
                },
                error: function() {
                    alert('ContactList: Ошибка доступа к базе!');
                }
            });
		}

		$('.header').append('<span class="me_icon">' + '<a href="#" title="You are logged in as: ">' + getCookie("userName") + '</a>' + '</span>');

	})(jQuery);
	$('.user-list').AddContactList();

	//Отримати id_recipient
	$(".recipient").focusout(function(){
		var value = $(this).val();
		$.ajax({
                url: 'http://api.prolaby.com/api/get/allusers',
                type: "GET",
                success: function(data){
                	for (var i = 0; i < data.length; i++) {
            			if (value == data[i].name) {
            				document.cookie = "recId = " + data[i].id;
            				i = data.length;
            			};
            		};
                },
                error: function() {
                    alert('ContactList: Ошибка доступа к базе!');
                }
            });
	});

	function getCookie(name) {
  		var matches = document.cookie.match(new RegExp(
    		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  		));
  		return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	//Відправка повідомлення
	$('.msg_form').submit(function(e) {
		e.preventDefault();

		$.ajax({
			url: 'http://api.prolaby.com/api/post/message',
            type: "GET",
            data: {
            	text: $(".text-message").val(),
            	id_sender: getCookie("userId"),
            	id_recipient: getCookie("recId")
            },
            success: function(data){
            	console.log(data);
            },
            error: function() {
            	alert('SendMessage: Ошибка доступа к базе!');
            }
        });
	});

	//Прочитати Повідоммлення
	$('.rd-msg').click(function(e) {
		e.preventDefault();
		$.ajax({
			url: 'http://api.prolaby.com/api/get/messages',
            type: "GET",
            data: {
            	id_user: getCookie("userId")
            },
            success: function(data){
            	console.log(data);
            	var myConversations = {};
            	function messages (arg) {
            					var obj = {};
            					var count = 0;
            					for (var i = 0; i < data.length; i++) {
            						if (data[i].name_sender == arg) {
            							obj[count] = {
            								"message": data[i].text,
            								"date": data[i].create_date,
            								"sender": data[i].name_sender,
            								"receiver": data[i].name_recipient,
            							}
            							count++;
            						};
            					};
            					return obj;
            				};
            	for (var i = 0; i < data.length; i++) {
            		var name = data[i].name_sender;
            		if (!(name in myConversations)) {
            				// myConversations[name] = name;
            				myConversations[name] = messages(name);
            			};
					// $('.message-list').append('<li class="list-group-item li-message-list">' + data[i].name_sender + '<span class="msg-time">' + data[i].create_date + '</span>'  + '</li>');
				};
				for (var i = 0; i < Object.keys(myConversations).length; i++) {
            		$('.message-list').append('<li class="list-group-item li-message-list">' + Object.getOwnPropertyNames(myConversations)[i] + '</li>');
            	};
				console.log(myConversations);
				$( ".li-message-list" ).on( "click", function() {
					var item = $(this).index()-1;
					var nick = Object.getOwnPropertyNames(myConversations)[item];
					// console.log(Object.getOwnPropertyNames(myConversations["den"][4])[2]); //???
					console.log(Object.getOwnPropertyNames(myConversations["den"][4][2])[0]); //???
					function ulItems(arg) {
					 	for (var i = 0; i < Object.keys(myConversations[arg]).length; i++) {
            				return '<li class="list-group">' + 'test' + '</li>'
            			};
					};
					$(".msg_form").css("display", "none");
					$(".msg-area").append('<div class="well well-lg">' + '<ul class="list-group">' + ulItems(nick) + '</ul>' + '</div>');
					// .text(data[$(this).index()-1].text);
				});
			},
			error: function() {
				alert('SendMessage: Ошибка доступа к базе!');
			}
		});

		$('.user-list').css("display", "none");
		$('.message-list').css("display", "block");

	});

});