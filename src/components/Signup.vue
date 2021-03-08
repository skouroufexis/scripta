<template>

    <main id="Signup" class="container">
        <div class="container">
            <div class="row header">
                <h3>User Registration</h3>
            </div>

            <form class="row" action="#">
                <label class="col-12" for="username" v-on:keyup='updateInput(1)'>Username<br>
                    <input type="text" class="userEntry"  id="username">
                </label>

                <label class="col-12" for="email" v-on:keyup='updateInput(2)'>Email<br>
                    <input type="text" class="userEntry"  id="email">
                </label>

                <label class="col-12" for="password1" v-on:keyup='updateInput(3)'>Password<br>
                    <input type="password" class="userEntry"  id="password1" maxlength="20">
                </label>

                <label class="col-12" for="password2" v-on:keyup='updateInput(4)'>Repeat password<br>
                    <input type="password" class="userEntry"  id="password2" maxlength="20" disabled>                    
                </label>

                <button class="col-6 button_primary" type="button" id="signup_button_register" v-on:click='register'>Register</button>

            </form>

            <div class="row" id="container_button_back">
                
                <button  v-on:click='gotoLogin' id="button_back">Back</button>  
                
            </div>

            
        </div>


    </main>    
</template>


<script>


export default {
    name:'Signup',

    data:function(){
        return{
            username:'',
            email:'',
            password1:'',
            password2:'',
            password:''
        }
    },

    mounted:function(){

        //remove focus upon keyup
        let inputs=document.getElementsByTagName('input');
        inputs.forEach(i=>{
            i.addEventListener('keyup',function(){
                i.classList.remove('focus');
                if(i===inputs[2]){
                        let password1=document.getElementById('password1').value;            
                        let password2=document.getElementById('password2');

                    if(password1.length>=8){
                        password2.disabled=false;                        
                        
                    }
                    else{
                        password2.disabled=true;
                        password2.value='';
                        password2.classList.remove('focus');                        
                    }
                }
            })
        })
    },

    methods:{
        register:function(){
            let username=this.username;
            let email=this.email;
            let password1=this.password1;
            let password2=this.password2;            
            //validate user input
            try{
                
                //empty input
                if(username.trim()==''){
                    this.setFocus(1);
                    throw 'Please enter your username';
                
                }
                if(email.trim()==''){
                    this.setFocus(2);
                    throw 'Please enter a valid email address';
                }
                else{
                    //validate email format
                    let emailValidator=require('email-validator');
                    let isValid=emailValidator.validate(email);
                    if(isValid==false){
                        this.setFocus(2);
                        throw 'Please enter a valid email address';
                    }
                }   
                //validate password
                if(password1.trim()==''){
                    this.setFocus(3);    
                    throw 'Please enter a valid password';
                }
                else if(password1.length<8){
                    this.setFocus(3);
                    throw 'Password must be between 8 and 20 characters long';
                }
                else{
                    if(password1.indexOf(' ')>=0){
                        this.setFocus(3);
                        throw 'Password cannot contain empty spaces';
                    }
                }                

                if(password1!=password2){
                        this.setFocus(4);
                    throw 'Passwords do not match. Please re-enter your password';
                }
                                
                this.password=this.password1;
                

                //POST request with user credentials                    
                let request= new XMLHttpRequest();    
                request.open('POST','http://localhost:8080/api/addNewUser');

                let data=JSON.stringify({user_name:this.username,user_email:this.email,user_password:this.password});
                request.send(data);  
                
                let self=this;
                request.onreadystatechange = function (){        
                    if(this.readyState==4 && this.status==200){
                    
                    
                    alert(this.responseText);

                    if(this.responseText=='Account successfully created'){
                        //redirect to login page
                        self.gotoLogin();
                    }
                    else if(this.responseText== 'Email already in use'){
                        //highlight email field
                        self.setFocus(2);
                    }
                    

                    }
                };

            }
            catch (error){
                alert(error);
            }

        },

        updateInput:function(n){
           
            if(n==1){
               this.username=document.getElementById('username').value;                
            }
            else if (n==2) {
               this.email=document.getElementById('email').value; 
            }

            else if (n==3) {

               this.password1=document.getElementById('password1').value;         
            }

            else if (n==4) {
               this.password2=document.getElementById('password2').value; 
            }
        },

        //function to set focus to input fields that weren't completed properly
        setFocus:function(n){
            
            let userEntries=document.getElementsByClassName('userEntry');

            userEntries.forEach(u => {
                u.classList.remove('focus');

            });            
            userEntries[n-1].classList.add('focus');
        },

        gotoLogin:function(){
            this.$emit('gotoLogin',0);
        },
    },
}
</script>


<style>


    .userEntry {
        text-align: center;
    }

    #container_button_back {        
        margin-top: 2%;
        justify-content: center;
    }

    #signup_button_register{
        background-color: darkcyan;
        color: white;
    }

    #button_back{
        background-color: rgba(0,0,0,0);    
    }
    

</style>

