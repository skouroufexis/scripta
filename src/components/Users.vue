<template>

    <div>

        <div  id="passwordModal">
            <div class="container" id="newPasswordContainer">
                <div class="row">
                    <p>Password change</p>
                </div>

                <div class="row">
                    <label class="col" for="oldPassword">Old password
                    <input type="text" id="oldPassword" maxlength="20">
                    </label>
                </div>

                <div class="row">
                    <label class="col" for="newPassword1">New password
                    <input type="text" id="newPassword1"  maxlength="20">
                    </label>
                </div>
                
                <div class="row">
                    <label class="col" for="newPassword2">Repeat new password
                    <input type="text" id="newPassword2" maxlength="20" disabled>
                    </label>
                </div>


            </div>

            <div class="row">
                <button class="col-10 button_primary" id="button_updatePassword" v-on:click='updatePassword'>Modify password</button>
            </div>
            
            <div class="row">
                <button v-on:click='closePasswordModal'>cancel</button>
            </div>
            
        </div>


        <main id="Users" class="container">
            <div class="container top2">
                
              <div class="row" id="fieldsContainer">
                  <label class="col-12 users_label" for="users_username">Username
                      <input class="input" type="text" id="users_username" disabled>
                  </label>
    
                  <label class="col-12 users_label" for="users_email">Email
                      <input class="input" type="text" id="users_email" disabled>
                   </label>
    
                   <button class="col-11" id="buttonPasswordModal" v-on:click='openPasswordModal'>Modify password</button>                                  
              </div>
    
              <div class="row" id="editContainer">
                  <button class="col-10 top2 button_primary" id="users_edit" v-on:click='enableEdit'>Edit</button>
              </div>
    
              <div class="row" id="updateContainer">
                  <button class="col-10 button_primary" id="users_update" v-on:click='updateInfo'>Update</button>
                  <button class="col-10" id="users_cancel" v-on:click='cancel'>Cancel</button>
              </div>
    
              <div class="row" id="deleteContainer">
                  <button class="col-10 button_primary " id="users_delete" v-on:click='deleteAccount' >Delete account</button>
              </div>
    
              <div class="row" id="backContainer">
                  <button class="col-6" id="users_back" v-on:click='goBack'>Back</button>
              </div>  
                
            </div>
        </main>   
    </div> 
</template>


<script>
export default {
    name:'Users',

    data:function(){
        return{
           //
        }
    },

    mounted:function(){

        let inputs=document.getElementsByTagName('input');
        inputs.forEach(i=>{
            i.addEventListener('keyup',function(){
                i.classList.remove('focus');
                if(i===inputs[1]){
                     let password1=document.getElementById('newPassword1').value;            
                     let password2=document.getElementById('newPassword2');

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

        //GET request to retrieve user account info
        let request= new XMLHttpRequest();    
        
        let session_id=localStorage.getItem('session_id');
        let user_id=localStorage.getItem('user_id');

        request.open('GET','https://scripta-app.herokuapp.com/api/account');        

        //set session_id header        
        if(session_id){
            request.setRequestHeader('session_id', session_id);
            request.setRequestHeader('user_id', user_id);               
        }

        //send request
        request.send();  

        request.onload=function(){
            if(this.status==200){
                let response=JSON.parse(this.responseText);
                    let user_name=response.user_name;
                    let user_email=response.user_email;
                    // let user_password=response.user_password;
                    //     user_password=user_password.substr(0,3);
                        
                document.getElementById('users_username').value=user_name
                document.getElementById('users_email').value=user_email;
                // document.getElementById('password').innerHTML=user_password;
            } 
            else{
                 //   
            }  
        }  


        
    },


    methods:{

        enableEdit:function(){
            let inputs =document.getElementsByClassName('input');
            inputs.forEach(i => {
                i.disabled=false;                
            });

            document.getElementById('users_update').style.display='block';
            document.getElementById('users_cancel').style.display='block';
            document.getElementById('buttonPasswordModal').style.display='block';
            document.getElementById('users_edit').style.display='none';
            document.getElementById('users_delete').style.display='none';
            document.getElementById('users_back').style.display='none';

        },
        cancel:function(){
            let inputs =document.getElementsByClassName('input');
            inputs.forEach(i => {
                i.disabled=true;                
            });

            document.getElementById('users_update').style.display='none';
            document.getElementById('users_cancel').style.display='none';
            document.getElementById('buttonPasswordModal').style.display='none';
            document.getElementById('users_edit').style.display='block';
            document.getElementById('users_delete').style.display='block';
            document.getElementById('users_back').style.display='block';
            
        },
        deleteAccount:function(){
            let self=this;
            let ans= window.confirm('Are you sure you want to delete your account?');
            if(ans==true){

                let confirmPassword =prompt('Please enter your password','');
                
                let session_id=localStorage.getItem('session_id');
                let user_id=localStorage.getItem('user_id');
                
                let url='https://scripta-app.herokuapp.com/api/delete-user';
                let request=new XMLHttpRequest();
                
                request.open('DELETE',url);
                request.setRequestHeader('session_id', session_id);               
                            
                let data=JSON.stringify({user_id:user_id,user_password:confirmPassword});
                request.send(data);                  

                request.onload = function (){        
                                                                            
                        if(this.status==200){ //request is valid
                            alert(this.responseText);
                            self.logout();
                        
                        }
                        else{
                            alert(this.responseText);
                        }                    
                };


            }
        },

        openPasswordModal:function(){
            
            let modal=document.getElementById('passwordModal');
            // document.getElementById('Footer').style.display='none';
            document.getElementById('Header').style.display='none';
            let main = document.getElementsByTagName('main');
                main[0].style.display='none';

            modal.style.display='flex';
        
            setTimeout(() => {
                modal.style.opacity='1';
                modal.style.transform='translateY(0px)';

            }, 100);
            
        },
        closePasswordModal:function(){


            let modal=document.getElementById('passwordModal');
            modal.style.opacity='0';
            modal.style.transform='translateY(20px)';
            
            
        
            setTimeout(() => {
                modal.style.display='none';                
                document.getElementById('Header').style.display='flex';
                let main = document.getElementsByTagName('main');
                main[0].style.display='flex';
                
            }, 100);
            
        },
        updateInfo:function(){
            let user_name=document.getElementById('users_username').value;
            let user_email=document.getElementById('users_email').value;

            try{
                //empty input
                if(user_name.trim()==''){
                    this.setFocus(4);
                    throw 'Please enter your username';
                
                }
                if(user_email.trim()==''){
                    this.setFocus(5);
                    throw 'Please enter a valid email address';
                }
                else{
                    //validate email format
                    let emailValidator=require('email-validator');
                    let isValid=emailValidator.validate(user_email);
                    if(isValid==false){
                        this.setFocus(5);
                        throw 'Please enter a valid email address';
                    }
                }
                let url='https://scripta-app.herokuapp.com/api/update-info';
                let user_id=localStorage.getItem('user_id');                
                let session_id=localStorage.getItem('session_id');
                let userData={user_name:user_name,user_email:user_email};                
                this.sendUpdateRequest(url,user_id,userData,session_id,1);    


            }catch(e){
                alert(e);
            }
            



        },
        updatePassword:function(){
            let oldPassword=document.getElementById('oldPassword').value;                
            let password1=document.getElementById('newPassword1').value;
                password1=password1.trim();
            let password2=document.getElementById('newPassword2').value;
                password2=password2.trim();

            try{

                if(oldPassword.trim()==''){
                    this.setFocus(1);    
                    throw 'Please enter a valid password';
                }

                if(oldPassword.length<8){
                    this.setFocus(1);
                    throw 'Password must be between 8 and 20 characters long';
                }

                if(oldPassword.indexOf(' ')>=0){
                        this.setFocus(1);
                        throw 'Password cannot contain empty spaces';
                }

                if(password1.trim()==''){
                        this.setFocus(2);    
                        throw 'Please enter a valid password';
                }
                if(password1.length<8){
                        this.setFocus(2);
                        throw 'Password must be between 8 and 20 characters long';
                }
                
                if(password1.indexOf(' ')>=0){
                        this.setFocus(2);
                        throw 'Password cannot contain empty spaces';
                }
                if(password1!=password2){
                        this.setFocus(3);
                        throw 'Passwords do not match. Please re-enter your new password';
                }
                
                //send post request to authenticate password
                 let self=this;
                 let user_id=localStorage.getItem('user_id');
             
                 let request=new XMLHttpRequest();
                
                 request.open('POST','https://scripta-app.herokuapp.com/api/validate_password');
                 request.setRequestHeader('Content-Type','application/json');
                 let data=JSON.stringify({oldPassword:oldPassword,user_id:user_id});
                 request.send(data);                  
                    

                 request.onload = function (){                                          
                 let response=this.responseText;                
                    if(this.status==200){ //request is valid
                        console.log(response);                        
                        
                       
                        //send put request for updating password
                        let session_id=localStorage.getItem('session_id');
                        
                        let requestUrl='https://scripta-app.herokuapp.com/api/update_password';
                        self.sendUpdateRequest(requestUrl,user_id,password1,session_id,2);    

                    }
                    else{
                        console.log(response);
                        alert('The password provided does not match the one stored in the database! Please re-enter your old password.');
                        self.setFocus(1);
                    }   
                 };
                               
            }
            catch(error){
                alert(error);
            }
            
        },
        

        //function to set focus to input fields that weren't completed properly
        setFocus:function(n){
            
            let userEntries=document.getElementsByTagName('input');
            userEntries.forEach(u=>{
                u.classList.remove('focus');
            });
            userEntries[n-1].classList.add('focus');
        },
        sendUpdateRequest:function(url,user_id,userData,session_id,n){
            //n=1-->update username & email, n=2-->update password
            let self=this;
            let data;
            let request=new XMLHttpRequest();                
            request.open('PUT',url);
            request.setRequestHeader('session_id', session_id);
            
            if(n==1){
                data=JSON.stringify({user_id:user_id, 
                                    user_name:userData.user_name,
                                    user_email:userData.user_email});
            }
            else{
                data=JSON.stringify({user_id:user_id,user_password:userData});  
            }
            
            request.send(data);      
            if(n==1){
                request.onload = function (){        
                                               
                    if(this.status==200){ //request is valid                    
                        alert(this.responseText);   
                                             
                        self.cancel();

                    }
                    else{
                        alert(this.responseText);        
                    }                    
                }; 
            }   
            else{
                request.onload = function (){        
                                               
                    if(this.status==200){ //request is valid                    
                        alert(this.responseText);   
                        //empty text boxes
                        document.getElementById('oldPassword').value='' ;
                        document.getElementById('newPassword1').value='' ;
                        document.getElementById('newPassword2').value='' ;

                        //redirect to account information page
                        self.closePasswordModal();
                        self.cancel();

                    }
                    else{
                        alert(this.responseText);        
                    }                    
                };    

            }         
            
        },

        navigate:function(n,sectionTitle){
            
            this.$emit('navigate',n,sectionTitle);
        },

        goBack:function(){
            
            //this will flag that the navigation originates from the Users screen
            //so that inside the navigate function, the code will not search
            //for the footer buttons

            // localStorage.setItem('Users','true');
            
            let previousSection=localStorage.getItem('previousSection');
            let previousSectionTitle=localStorage.getItem('previousSectionTitle');            
            this.$emit('initials');
            this.navigate(previousSection,previousSectionTitle);
        },

        logout:function(){
            
            //send request to delete the session from the database
                let self = this;
                //get session_id from localStorage             
                let session_id=localStorage.getItem('session_id');  
                
                let request=new XMLHttpRequest();            
                request.open('GET','https://scripta-app.herokuapp.com/api/logout');        
                //set session_id header        
                if(session_id){
                request.setRequestHeader('session_id', session_id);               
                }
                //send request
                request.send();  
                
                request.onload=function(){
                    
                    if(this.status==200){
                        
                        //logout
                        localStorage.clear();
                        // self.closeMenu();
                        
                        setTimeout(() => {
                        self.$emit('navigate',0,'');     
                        }, 200);
                    } 
                    else{
                        console.log(this.responseText);                                                                            
                    }  
                } 
        }

    },
}
</script>


<style>

   main {
    border: solid whitesmoke thin;
    padding: 2%;            
}


.users_label{
    margin-top: 1%;
}

#fieldsContainer{
    background-color: rgb(0, 139, 139,0.1);
    padding-top: 2%;
    padding-bottom: 2%;
    justify-content: center;
}

#buttonPasswordModal{
    background-color: rgb(0, 139, 139,0);
    height: 40px;
    width: auto;
    margin-left: 0;
    display: none;
}
   
#editContainer,#updateContainer,#deleteContainer {
    justify-content: center;
    margin-top: 1%;
    
}

#editContainer{margin-top: 3%;}

#users_update{
    display: none;
    width: 50%;
}

#users_cancel {
    color: black;
    display: none;
}
#backContainer{
    margin-top: 2%;
    
    justify-content: center;
}

#users_delete {
    background-color: white;
    color: red;
    border: solid red thin;
    box-shadow: none;

}

#passwordModal{
     position: absolute;
     z-index: 1;     
     height: 100%;
     width: 100%;
     display: none;
     opacity: 0;        
     flex-direction: column;    
     justify-content: center;    
     transform: translateY(20px);
     transition: opacity 0.2s,transform 0.2s;       
}

#passwordModal .row{
    
    justify-content: center;
    
}

#newPasswordContainer {
    background-color: rgb(0, 139, 139,0.1);
    padding: 2%;
    
}

#button_updatePassword{
    margin-top: 2%;
    margin-bottom: 1%;
}


</style>

