<template>

  <div id="app">
    <div id="warning" ><b><p>Please rotate your device in portrait position</p></b></div>    
    <Header1 v-if="menu<=0"/>
   <Header v-if="menu>0 && menu!=5" v-bind:sectionTitle='sectionTitle' v-on:navigation='navigate' v-bind:changedInitials='initials' />
   <Login v-if="menu==0" v-on:navigation='navigate'/>
   <Signup v-if="menu==(-1)" v-on:gotoLogin='navigate'  />
   <Index v-if="menu==1" />
   <New v-if="menu==2" v-on:detach='detach' v-bind:attachments='attachments' v-bind:dossier='dossier' v-bind:tags='tags' />
   <Dossier  v-if="menu==3" />
   <!-- <Calendar v-if="menu==4" /> -->
    <Users v-if="menu==5" v-on:navigate='navigate' v-on:initials='getInitials'/>
   <Footer v-if="menu>0 && menu!=5" id="Footer" v-bind:menu='menu' v-bind:attachmentsF='attachments' v-bind:tagsF='tags' v-bind:dossierF='dossier' v-on:navigation='navigate' v-on:actionsData='actionsData'/>
  </div>
</template>

<script>

import Header1 from './components/Header1';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Index from './components/Index';
import Footer from './components/Footer';
import New from './components/New';
import Dossier from './components/Dossier';
// import Calendar from './components/Calendar';
import Users from './components/Users';






export default {
  name: 'App',
  components: {
    Login,Signup,Header1,
    Index,Header, Footer,
    New,Dossier,Users
  },

  data:function(){
    return {
      menu:0,
      sectionTitle:'Scripta',
      attachments:[],
      dossier:'',
      tags:[],
      keyDossier:0,
      initials:0
      
    }
  },

 mounted:function(){
  
  

        //call function to check if session_id is expired when the window closes
        this.checkExpiry();

        // let self=this;
        
        //if the user is logged in go directly to home page

        //get the session_id
          // let session_id=localStorage.getItem('session_id');
          
        //send GET request with session_id
          let request= new XMLHttpRequest();    
          request.open('GET','https://scripta-app.herokuapp.com/api/test');    
          // request.open('GET','https://scripta-app.herokuapp.com/api/navigate');        
          //set session_id header        
          // if(session_id){
          //   request.setRequestHeader('session_id', session_id);               
          // }

        //send request
        request.send();  
        
        request.onload=function(){
          alert(this.responseText);
        // if(this.status==200){
                      
        //     self.navigate(1,'Scripta');

        //   } 
        //   else{
        //     console.log(this.responseText);      
        //     //redirect to login page
        //   if(this.responseText=='unauthorized'){
        //     self.navigate(0,'','login')       
        //     }
        //   }  
        }  

        //set the background-colour of the home icon
        let footerButtons=document.getElementsByClassName('button_main');
        footerButtons[0].style.backgroundColor='rgb(0, 138, 138,0.1)';   

 },
 
  methods:{

    //calls a function inside Header component that retrieves the user initials
    getInitials:function(){
      this.initials++
    },

    navigate:function(n,sectionTitle){      
      
      this.menu=n;
      this.sectionTitle=sectionTitle;

      localStorage.setItem('section',n);
      localStorage.setItem('sectionTitle',sectionTitle);
      
      // let Users=localStorage.getItem('Users');
      
      //highlight selected menu section
      if(n!=5 && n!=0 && n!=-1){ //5==the account information screen,0=login,-1=sign up

        localStorage.setItem('previousSection',n);
        localStorage.setItem('previousSectionTitle',sectionTitle);
        setTimeout(() => {          
          let footerButtons=document.getElementsByClassName('footer_button_main');
          let c;
          // change background-colour of currently active menu option
          for(c=0;c<footerButtons.length;c++){
              footerButtons[c].style.backgroundColor='rgba(0,0,0,0)';
          }
          footerButtons[n-1].style.backgroundColor='rgb(0, 138, 138,0.1)';
          // localStorage.removeItem('Users');
        }, 200);
      } 
    },


    
    checkExpiry:function(){
      
      //get session_id
      let session_id=localStorage.getItem('session_id');

      //send GET request 
      let request=new XMLHttpRequest();

      request.open('GET','http://localhost:8080/api/expiry');        
      
      if(session_id){
      request.setRequestHeader('session_id', session_id);  
      }      
      request.send();  

      request.onload=function(){
          if(this.status==200){
            
            if(this.responseText=='session expired'){
              console.log(this.responseText);
              localStorage.clear();              
            }
            else{
              console.log(this.responseText);
            }
          }
          else{
            console.log(this.responseText);
          }          
      }
      
    },

    actionsData:function(attachments,dossier,tags){
      //update attachments,dossier,tags
      this.attachments=attachments;
      this.dossier=dossier;
      this.tags=tags;            
    },


    //removes the selected attachment, dossier or tag  
    detach:function(arrayNumber,indexNumber){
      let oldArray;
      let newArray=[];
      let self=this;
      //determine which array is dealt with
      if(arrayNumber==1){
        oldArray=this.attachments;      
        //update the array  
        updateArray(oldArray,indexNumber,function(newArray){
          
          self.attachments=newArray;     
              
        });
        
      }      
      else if (arrayNumber==2){
        this.dossier=''; //dossier is updated directly
        
      }
      else{
        oldArray=this.tags;

        //update the array
        updateArray(oldArray,indexNumber,function(newArray){
          self.tags=newArray;                    
        }
        );
      }

      //determine which array element is to be removed
      function updateArray(oldArray,indexNumber,callback){        
         
         oldArray.forEach((a,i) => {
            if(i!=indexNumber){
              newArray.push(a);
            }
         });
         callback(newArray);

         
      }
    console.log(this.tags[0]);
    },

  }

}
</script>

<style>
body {
      
      height: 100vh;
      background-image: url('./assets/background2.png');
      background-size: contain;
      background-position: center;
      /* background-origin: content-box; */
      
      
}

#app {
      position: relative;
      margin-top: auto;
      margin-bottom: auto;
      height: 100%;
      
}


#warning {
            background-color: black; 
            color: white;
            position: absolute; top: 0;
            z-index: 1;
            height: 100%;
            width: 100%;
            display: none;
            justify-content: center;
            align-items: center;
  }





#Header, #Header1 {
         margin-top: 1vh;
         /* its height will be determined by the logo image  */
         /* which is set to 10vh */
        
         height: 9vh; 
         
         
}

#Signup {height: auto;}

main { 
      
      position: relative;
      height: 68vh;
      margin-top: 2vh;      
      overflow-y: scroll;   
      border: solid whitesmoke thin;

}

#Footer  {
          height: 20vh;
          
          
          
} 

.header {
        justify-content: center;
}

form {
      justify-content: center;
      padding: 2%;
} 

  input {
    outline: none;
    text-align: left;
    
  }

  input:focus,textarea:focus {  
    outline: none;
                             
  }
   
 button {
         background-color: rgba(0,0,0,0);
         font-weight: bold;
         border: none;
         height: 40px;
         color: darkcyan;   
}

a{cursor: pointer;}

/* .inputText {
  background-color:rgb(0, 139, 139,0.05);
  color: rgba(0,0,0,0.8);
  border: none;
  height: 40px;
} */

 button:focus{
        outline: none;              
}

.button_primary {
                      
        border: solid white thin;
        box-shadow: 0px 0px 2px darkcyan;
        color: white;  
        background-color: rgb(0, 139, 139,1);              
        height: 40px;
        margin-left: auto;
        margin-right: auto;
        /* border-radius: 50px;     */
    }

.button_secondary{
  color: darkcyan;
  border: solid darkcyan thin;
  
  background-color: white;
 
}

.button_cancel{
  color: black;
} 

.back{font-size: 1.5em;}

.attachment{
       /* max-width: 100px; */
       /* max-height: 100px; */
       width: 70px;height: 70px;
       cursor: pointer; 
        /* border: solid white thin; */
       box-shadow: 0px 0px 3px darkcyan; 
       border-radius: 50%;
       /* border: solid darkcyan thin; */
       padding: 3px;

    }

:disabled {
      background-color: white;
      color: rgba(0,0,0,0.1);
      border:none;
  }

.focus {    
    border: solid red medium;
}

.centre{
  text-align: center;
  
}

.left{
  text-align: left;
}

.right{
  text-align: right;
}

.justify-centre{
  justify-content: center;
}

.justify-right{
  justify-content: right;
}

.left-auto{margin-left: auto;}

.left1{margin-left: 1%;}

.left2{margin-left: 2%;}

.vertical-centre{
    display: flex;flex-direction: column;justify-content: center;
  
}

.full{
  width: 100%;
  
}

.systemMessage{
  color: rgba(0,0,0,0.4);
}

.results_row{
  background-color: rgb(245, 245, 245,0.4);
  
  margin-top: 1%;
}

.results_label{
  color: rgba(0,0,0,0.7);
}


.darkcyan{color: darkcyan;}
.background_darkcyan{background-color: rgb(0, 139, 139,0.1);}

.black{color: rgba(0,0,0,0.8);}

.top1{margin-top: 1%;}
.top2{margin-top: 2%;}


.border{border: solid red thin;
      color: darkcyan;
      }

.padding1{padding: 1%;}
.padding2{padding: 2%;}

.record{
    background-color: rgb(245, 245, 245,0.6);        
    
}


.record p{
    word-wrap: break-word;

}  

.sideDataContainer {height:auto; max-height: 300px; overflow-y: scroll;}

.img_fullScreen {max-height: 300px;}

.fade-enter-active{
        transition: all 0.5s;
    }
    
.fade-enter{
        opacity: 0;
        transform: translateX(10px);
}

.fade-leave{
        opacity: 1;
        
}


.fade-leave-active{
        opacity: 0;
        
        transition: all 0s;
    }


.down-enter-active{
        transition: all 0.5s;
    }
    
.down-enter{
        opacity: 0;
        transform: translateY(-10px);
}

.down-leave{
        opacity: 1;
        
}


.down-leave-active{
        opacity: 0;
        
        transition: all 0s;
}    



</style>
