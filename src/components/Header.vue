
<template>

    <div>
        <div id="Header" class="container header">
            <div class="container">
                <div class="row">
                    <div class="col-8" id="container_logo">                        
                        <img id="logo" src="../assets/logo.png" alt="logo"> 
                        <span id="sectionTitle">{{this.sectionTitle}}</span>  
                    </div>
                            
                    <div class="col-4" id="container_ButtonUpperMenu">
                        <button id="button_upperMenu" v-on:click='openMenu'>{{this.initials}}</button>                                        
                    </div>
                </div>
                        
            </div>
        </div>


        <div id="menu">
            <div class="container">
                <nav class="row">
                    <button v-on:click='closeMenu'><h3>CLOSE</h3></button>
                </nav>
                <div id="options_container">
                    
                    <nav class="row">
                        <a v-on:click='navigate(5,"Account information")' ><h4>My account</h4></a>                    
                    </nav>

                    <nav class="row">
                        <a  v-on:click='logout'><h4>Logout</h4></a>                      
                    </nav>
                </div>

            </div>

                        
        </div>

    </div>
    

</template>

<script>
export default {
    name:'Header',

    mounted:function(){
        this.userInitials();

    },

    data:function(){
        return {
            initials:''
        }
    },



    methods:{

        //gets the user initials
        userInitials:function(){
           let self=this;
           let request= new XMLHttpRequest();            
            request.open('GET','https://scripta.domes-web.net/api/initials');        

            let session_id=localStorage.getItem('session_id');
            let user_id=localStorage.getItem('user_id');
            
            request.setRequestHeader('session_id', session_id);               
            request.setRequestHeader('user_id', user_id);               

            //send request
            request.send();  

         request.onload=function(){
             
             
            if(this.status==200){
                
                let response=JSON.parse(this.responseText);
                let initials=response.user_name;
                    
                    initials=initials.substr(0,1);
                    self.initials=initials;
            } 
            else{
                  alert(this.responseText); 
            }  
        }   
        },
        //opens the menu    
        openMenu:function(){
            let modal=document.getElementById('menu');
            let currentMenu=localStorage.getItem('section');
            if(currentMenu!=5){
                document.getElementById('Footer').style.display='none';
            }    
            
            document.getElementById('Header').style.display='none';
            let main = document.getElementsByTagName('main');
                main[0].style.display='none';

            modal.style.display='flex';
            
            setTimeout(() => {
                modal.style.opacity='1';
                modal.style.transform='translateY(0px)';

            }, 100);

        },

        //closes menu
        closeMenu:function(n){
            if(!n){
                this.userInitials();
            }
            
            let modal=document.getElementById('menu');        



            modal.style.opacity='0';
            modal.style.transform='translateY(20px)';
            setTimeout(() => {
                modal.style.display='none';

                document.getElementById('Footer').style.display='flex';
                document.getElementById('Header').style.display='flex';
                let main = document.getElementsByTagName('main');
                    main[0].style.display='block';
                    
            }, 200);
        },

        logout:function(){
            
            //send request to delete the session from the database
                let self = this;
                //get session_id from localStorage             
                let session_id=localStorage.getItem('session_id');  
                
                let request=new XMLHttpRequest();            
                request.open('GET','https://scripta.domes-web.net/api/logout');        
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
                        self.closeMenu('logout');
                        
                        setTimeout(() => {
                        self.$emit('navigation',0,'');     
                        }, 200);
                    } 
                    else{
                        console.log(this.responseText);                                                                            
                    }  
                } 
        },

         navigate:function(n,title){
         
            //set the selected section in local storage
            localStorage.setItem('section',n);
            localStorage.setItem('sectionTitle',title);

            //get the with session_id
            let session_id=localStorage.getItem('session_id');

            //send GET request with session_id
            let request= new XMLHttpRequest();    
            
            request.open('GET','https://scripta.domes-web.net/api/navigate');        
        
            //set session_id header        
            if(session_id){
                    request.setRequestHeader('session_id', session_id);               
            }

            //send request
            request.send();  
            let self=this;
            request.onload=function(){
                if(this.status==200){                        
                    self.closeMenu();
                    
                    setTimeout(() => {
                    self.$emit('navigation',n,title);    
                    }, 200);                                                
                } 
                else{
                        console.log(this.responseText);                    
                        //redirect to login page
                        if(this.responseText=='unauthorized'){
                        self.$emit('navigation',0,'','login');      
                           
                        }
                }  
            }  
 
        }
    },

    props:['sectionTitle','changedInitials'],

    watch:{
         changedInitials:function(newVal){
               this.changedInitials=newVal;  
               this.userInitials();               
         }
        //  }, 
        //  dossier:function(newVal){
        //        this.dossier=newVal;   
               
        //  },
        //  tags:function(newVal){
        //          this.new_tags=newVal;                 
        //  },
        
    },
    
      
}
</script>


<style>



.header {
        position: relative;                  
}

.title {
         text-align: center; 
         width: 100%;
         }

#container_logo{
        position: relative;
        width: auto;
        /* border: solid blue thin; */
        text-align: left;
}   


#logo { 
        height: 9vh;            
}
#sectionTitle {
        
        margin-left: 4%;
        
}



#container_ButtonUpperMenu {
    
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    /* border: solid red thin; */
    
}

#button_upperMenu {
    position: absolute;
    
    right: 4%;
    top: 20%;
    background-color: rgba(0,0,0,0);
    /* border: solid red thin; */
    width: 30px;
    height: 30px;
    color: rgba(0,0,0,1);
    background-color: rgb(0, 139, 139,0.1);
    border-radius: 50%;
    /* color: darkorange; */
    
}

#menu {
        
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: none;
        opacity: 0;        
        flex-direction: column;
        
        justify-content: center;
        
        transform: translateY(20px);
        transition: opacity 0.2s,transform 0.2s;    
}



#menu  a, #menu a:visited,#menu  a:active{        
        color: rgba(0,0,0,0.9);        
        /* color: white; */
}

#menu a:hover {
        text-decoration: none;
        
}

#menu a  {
        background-color:  rgb(0, 139, 139,0.05);
        width: 70%;
        text-align: center;
        
}
#menu button {  margin-left: 0px;
                width: 100%;
                }

#menu nav {
        margin-top: 1%;
        
        justify-content: center;
}


</style>