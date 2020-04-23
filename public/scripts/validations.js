$(function(){

    $.validator.setDefaults({
        highlight:function(element){
            $(element).closest(".form-control").addClass("invalid");
        },
        unhighlight:function(element){
            $(element).closest(".form-control").removeClass("invalid");
        }
    })
    
   $.validator.addMethod("strongPassword",function(value,element){
       return this.optional(element)
       || value.length >=6
       && /\d/.test(value)
       && /[a-z]/i.test(value);
   },"Your password must be atleast 6 characters long and contain atleast one number and one character");

   $.validator.addMethod("mobile",function(value,element){
       return this.optional(element)
       || value.length == 10
       && /^\d*$/.test(value);
   },"Please enter digits only")


    $(".signupform").validate({
        rules:{
            name:{
                required:true,
                lettersonly:true
            },
            email:{
                required:true,
                email:true,
                remote:{
                    type: 'post',
                    url: 'register/isEmailAvailable',
                    data: {
                        'email': function () { return $('#email').val(); }
                    },
                    dataType: 'json'
                }
            },
            username:{
                required:true,
                alphanumeric:true,
                remote:{
                    type: 'post',
                    url: 'register/isUsernameAvailable',
                    data: {
                        'username': function () { return $('#username').val(); }
                    },
                    dataType: 'json'
                }
            },
            password:{
                required:true,
                strongPassword:true
            }
        },
        messages:{
            name:{
                required:"Please enter your name",
                lettersonly:"Please enter alphabets only"
            },
            email:{
                required:"Please enter your email address",
                email:"Please enter a valid email addresss",
                remote:$.validator.format("{0} is already associated with a account.Would like to <a href='/login'>login</a>")
            },
            username:{
                required:"Please enter the username",
                remote:$.validator.format("{0} is already taken")
            },
            password:{
                required:"Please enter the password"
            }
        }
    })
    $(".realoginform").validate({
       rules:{
        username:{
            required:true,
            alphanumeric:true
        },
        password:{
            required:true
        }
       },
       messages:{
           username:{
               required:"Please enter your username"
           },
           password:{
               required:"Please enter your password"
           }
       } 
    })
    $(".newconform").validate({
        rules:{
           'newcon[phone]':{
               required:true,
               mobile:true
           },
           'newcon[plan]':{
               required:true
           },
           'newcon[address]':{
               required:true
           },
           'newcon[locality]':{
               required:true
           }
        },
        messages:{
            'newcon[phone]':{
                required:"Please enter your phone number"
            },
            'newcon[plan]':{
                required:"Please select a plan"
            },
            'newcon[address]':{
                required:"Please enter your address"
            },
            'newcon[locality]':{
                required:"Please enter your locality"
            }
        }
    })
    $(".supportform").validate({
        rules:{
            type:{
                required:true
            },
            comments:{
                required:true
            }
        },
        messages:{
            type:{
                required:"Please select a issue"
            },
            comments:{
                required:"Please enter your description"
            }
        }
    })
    $(".resetform").validate({
        rules:{
            password:{
                required:true,
                strongPassword:true
            },
            confirm:{
                required:true,
                equalTo:"#password"
            }
        },
        messages:{
            password:{
                required:"Please enter the new password"
            },
            confirm:{
                required:"Please re-enter your password",
                equalTo:"Please enter the same password"
            }
        }
    })
    $(".forgotform").validate({
        rules:{
            email:{
                required:true
            }
        },
        messages:{
            email:{
                required:"Please enter your email"
            }
        }
    })
})