<template>

    <main id="Login" class="container">
        <div class="container">
            <div class="row header">
                <h3>USER LOGIN</h3>
            </div>

            <form class="row" action="#">
                <label class="col-12" for="email" v-on:keyup='updateInput(1)'>Email<br>
                    <input type="text"  id="email">
                </label>

                <label class="col-12" for="password" v-on:keyup='updateInput(2)'>Password<br>
                    <input type="password" id="password">
                </label>

                <button class="col-6 button_primary" type="button" id="login_button_submit" v-on:click='login'>submit</button>

            </form>

            <div class="row" id="container_button_signup">
                <label for="button_signup">No account?
                <button class="col-6" id="button_signup" v-on:click='gotoSignup'>Sign Up</button>  
                </label>
            </div>

            
        </div>


    </main>    
</template>


<script>
export default {
    name:'Login',

    data:function(){
        return{
            email:'',
            password:''
        }
    },

    methods:{
        login:function(){
            let email=this.email;
            let password=this.password;

            //validate user input
            try{
                
                //empty input
                if(email.trim()==''){
                throw 'please enter your email';
                }
                if(password.trim()==''){
                throw 'please enter your password';
                }

                //send post request with credentials
                let request=new XMLHttpRequest();
                
                request.open('POST','https://scripta.domes-web.net/api/login');
                request.setRequestHeader('Content-Type','application/json');

                

                let data=JSON.stringify({email:this.email,password:this.password});
                request.send(data);                  
                let self=this;
                request.onload = function (){        
                        
                    let response=JSON.parse(this.responseText);                    
                        if(this.status==200){
                            
                            
                            // //save session_id to localStorage
                            localStorage.setItem('session_id',response.session_id);
                                
                            // //save user_id to localStorage
                            localStorage.setItem('user_id',response.user_id);

                            // //go to home screen
                            self.$emit('navigation',1,'Scripta','index');
                        }
                        else{
                            alert(response.message);
                        }                    
                };

            }
            catch (error){
                alert(error);
            }

        },

        updateInput:function(n){
            
            if(n==1){
               this.email=document.getElementById('email').value;                
            }
            else{
               this.password=document.getElementById('password').value; 
            }
        },

        gotoSignup:function(){
            this.$emit('navigation',-1,'signup');
        }

    },
}
</script>


<style>

    form{
        margin-top: 1%;
        background-color: rgb(0, 139, 139,0.1);
    }

    label{
        text-align: center;
    }

    input{
        width: 100%;
        text-align: center;
    }

    
    #container_button_signup {
        justify-content: center;

        margin-top: 2%; 
    }

    #login_button_submit {
        background-color: darkcyan;
        color: white;
    }

    #button_signup {
        background-color: rgba(0,0,0,0);
        height: 40px;
    }

    

</style>

