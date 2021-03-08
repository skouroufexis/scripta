
<template>

    <div>
        <div class="container">
            <main id="New" class="container">
                <div class="container" id="mainContentContainer">
                    
                    <div class="row" id="header">
                        <div class="d-none d-md-block col-md-6"></div>
                        <div class="col-6 col-md" id="time" v-on:click ='openModal(4)'>{{currentTime}}</div>
                        <div class="col-6 col-md" id="day" v-on:click ='openModal(2)'>{{day()}}</div>
                        <div class="col-12" id="div_title"  v-on:click ='openModal(1)' role="button">{{title}}</div>                
                    </div>
        
                    <div class="row" id="new_mainTextContainer">
                        <div class="col-12" id="div_mainText" v-on:click ='openModal(3)' role="button">{{mainText}}</div>
                    </div>
        
                    <div class="row" id="new_assignedDataContainer">
    
                        
                        <button v-if='this.attachments!=""' class="col new_assignedData" id="new_assigned_attachments" v-on:click='openModal(5)'>                        
                            <i  class="fas fa-paperclip"> {{this.attachments.length}} </i>
                        </button>
    
                        <button v-if='this.attachments==""' class="col empty new_assignedData" >                        
                            <i  class="fas fa-paperclip"></i>
                        </button>
    
                        <button v-if='this.dossier!=""' class="col new_assignedData" id="new_assigned_dossier" v-on:click='openModal(6)'>
                            <i  class="fas fa-folder"> {{this.dossier}} </i> 
                        </button>
    
                        <button v-if='this.dossier==""' class="col empty new_assignedData">
                            <i  class="fas fa-folder"></i> 
                        </button>
    
                        <button v-if='this.tags!=""' class="col new_assignedData" id="new_assigned_tags" v-on:click='openModal(7)'>
                            <i class="fas fa-tag"> {{this.tags.length}} </i> 
                        </button>
                        <button v-if='this.tags==""' class="col empty new_assignedData">
                            <i class="fas fa-tag"></i> 
                        </button>
    
                        
                    </div>
        
                    <div class="row">
                        <button class="col-12" id="new_buttonSubmit" v-on:click='submitEntry'>submit entry</button>                    
                    </div>
        
                </div>
        
                <!-- MODALS -->
                <div class="container" id="titleModal">
                        <button v-on:click='closeModal(1)'>OK</button><br>
                        <input type="text" id="title">
                </div>
        
                <div class="container" id="calendarModal">
                        <button v-on:click='closeModal(2)'>OK</button><br>
                        
                        <Calendario v-bind:months='months' v-on:updateToday='updateToday'/>
                </div>
        
                <div class="container" id="textAreaModal">
                        <button v-on:click='closeModal(3)'>OK</button><br>   
        
                        <textarea class="row" id="textareaMainText" maxlength="6000"></textarea>             
                </div>
            </main>   
        </div>
    
        <!-- MODALS -->
         <div class="container">
             <div class="container clockModal" id="clockModal">
                        <button v-on:click='closeModal(4)'>OK</button><br>   
        
                        <Clock  />
            </div>

             <div v-if='this.attachments!=""' class="container" id="attachmentsModal">
                <button v-on:click='closeModal(5)'>OK</button><br>   
                <div class="container record sideDataContainer"  id="attachmentsContainer">
                    <div v-for="(attachment,index) in attachments" :key="attachment" class="row full justify-centre padding1 top2">
                        <div ><img class="attachment" v-bind:src="attachment.attachment_data" alt="attachment preview"> </div>                                
                        <button style="height:80px" class="left1" v-bind:id='attachment.attachment_name' v-on:click='removeAttachments(index,attachment.attachment_name)'>
                            <i class="far fa-trash-alt"></i>   
                        </button>
                    </div>                    
                </div>

                        
            </div>

             <div v-if='this.dossier!=""' class="container" id="dossierModal">
                <button v-on:click='closeModal(6)'>OK</button><br>   
                    <div class="container sideDataContainer">
                        <div class="row record justify-centre full  top2" style="height:40px">
                            <b><p style="height:40px" class="vertical-centre">{{this.dossier}}</p></b>
                            <button class=" left2 " v-on:click='removeDossier(0)'><i class="far fa-trash-alt"></i></button>
                        </div>   

                    </div>

                        
            </div>

             <div v-if='this.tags!=""' class="container" id="tagsModal">
                        <button v-on:click='closeModal(7)'>OK</button><br>   
                        <div class="container sideDataContainer"  id="tagsContainer">
                            <div v-for="(tag,index) in tags" :key="tag" style="height:40px" class="row  record top1 full justify-centre top2">

                                <b><p style="height:40px" class="vertical-centre">{{tag}}</p>  </b>
                                <button class="left2" v-bind:id='tag' v-on:click='removeTag(index,tag)'>
                                    <i class="far fa-trash-alt"></i>   
                                </button>

                            </div>
                    
                        </div>                                
            </div>

            
            
         </div>




    </div> 
</template>

<script>


import Calendario from './Calendar';

import Clock from './Clock';

export default {
    name:'New',
    components:{ Calendario,Clock},

    

    data:function(){
         return {
             mainText:'click to add some text...',
             title:'click to add title',
             months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],             
             today:new Date(),
             currentTime:(()=>{
                 
                 return this.time();
             })(),
             new_attachments:(()=>{
                 if(this.attachments){

                        // return(
                        //     {attachment_name:this.attachments.attachment_name,
                        //     attachment_data:this.attachments.attachment_data
                        //     } ) ;      
                     return this.attachments;



                }
                 else{
                     return [];
                 }   
             })(),
             new_dossier:(()=>{
                 if(this.dossier){
                     return this.dossier;
                }
                else{
                    return '';
                }
                    
                 })(),

             new_tags:(()=>{
                 if(this.tags){
                     return this.tags;
                 }
                 else{
                     return [];
                 }
             })(),

             
         }   
    },

    props:['attachments','dossier','tags'],

    watch:{
         attachments:function(newVal){
               this.new_attachments=newVal;  
               
               
         }, 
         dossier:function(newVal){
               this.new_dossier=newVal;   
               
         },
         tags:function(newVal){
                 this.new_tags=newVal;                 
         },
        
    },

    mounted:function(){
       
        // this.attachments.forEach(a => {
        //     console.log(a.attachment_data.data);
        //     let att=a.attachment_data.data.map(b => String.fromCharCode(b)).join('');
        //     this.attachments_data.push(att);
            
        // });


        
    },
    methods:{
    
      addListener:function(event){
          
          let classList=event.target.classList;
           if(classList.contains('clockModal') || classList.contains('time-picker-preview')|| classList.contains('preview-container')){
                this.closeModal(4);
                
            }
        
      },

      time:function(){
          
            let today= new Date();
            let hours = today.getHours();
            let minutes = today.getMinutes();
                if(minutes<10)
                    {
                        minutes= '0'+minutes;
                    }
                if(hours<10)
                    {
                        hours='0'+hours;
                    }
            let time = hours +":"+ minutes;
            return time;
                      
          },
    day:function(){
        let today= this.today;
        let day=today.getDate();
        let month=today.getMonth();

        //month names
        let months=this.months;
        // let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Set','Oct','Nov','Dec'];

        month=months[month];
        let year = today.getFullYear();
        return day +' '+ month + ' '+ year;
        },
    
    //sets a new value for this.today
    updateToday:function(day){
        this.today=day;
    },
    

    //opens the calendar (1) or text-area(2) modal
    openModal:function(n){

        

        document.getElementById('New').style.border='none';
        let modal;

        document.getElementById('Footer').style.display='none';
        document.getElementById('Header').style.display='none';
        document.getElementById('mainContentContainer').style.display='none';

        if(n==1)
            {
                modal= document.getElementById('titleModal');
                
            }    
        else if(n==2)
            {
                modal= document.getElementById('calendarModal');
                
            }
        else if(n==3)
            {
                modal= document.getElementById('textAreaModal');                
               
            }
        else if(n==4)
            {
                modal= document.getElementById('clockModal');  
               
                setTimeout(() => {
            
                window.addEventListener('click', this.addListener)    
                }, 500);

            }

        else if (n==5){
            modal= document.getElementById('attachmentsModal');
            
           

        }
        else if (n==6){
            modal= document.getElementById('dossierModal');
        }
        else if (n==7){
            modal= document.getElementById('tagsModal');

           
        }

        modal.style.display='flex';
        
        setTimeout(() => {
            modal.style.opacity='1';
            modal.style.transform='translateY(0px)';

            //when the textAreaModal is displayed
            document.getElementById('textareaMainText').focus();

            //in case the title modal is displayed
            document.getElementById('title').focus();

            //in case the clock modal is displayed
            let picker=document.getElementsByClassName('time-picker-preview');
                picker=picker[0];
                picker.click();
                picker.style.backgroundColor='white';
                picker.style.color='black';
                picker.style.boxShadow='none';
        }, 100);

    },

    //closes the calendar (1) or text-area(2) modal
    closeModal:function(n){
        
        document.getElementById('New').style.border='solid whitesmoke thin';

        //remove event listener for closing the clock modal
         window.removeEventListener('click',this.addListener);   

        //update the main text value (works when textArea modal is displayed)
        this.mainText=document.getElementById('textareaMainText').value; 

        //user entered no text==>reset previous text
        if(this.mainText.trim()=='')
            {
                this.mainText='click to add some text...';
            }

        document.getElementById('div_mainText').style.whiteSpace='pre';
        
        //update the title  value (works when title modal is displayed)
        this.title=document.getElementById('title').value; 

        //user entered no title==>reset previous text
        if(this.title.trim()=='')
            {
                this.title='click to add title';
            }

        let modal;

        if (n==1)
            {
                modal= document.getElementById('titleModal');
            }
        else if(n==2)
            {
                modal= document.getElementById('calendarModal');
            }
        else if (n==3)
            {
                modal= document.getElementById('textAreaModal');    
            }
        else if(n==4)
            {                
                modal= document.getElementById('clockModal');
                //update time

                let timeContainer=document.getElementsByClassName('preview-container');
                let time=timeContainer[0].innerHTML;
                
                time=time.split(':');
                let hours=time[0];
                let minutes=time[1];

                let newTime=hours+':'+minutes;
                
                this.currentTime=newTime;      
            }

        else if (n==5){
            modal= document.getElementById('attachmentsModal');
        }
        else if (n==6){
            modal= document.getElementById('dossierModal');
        }
        else if (n==7){
            modal= document.getElementById('tagsModal');
            
        }
        
        modal.style.opacity='0';
        modal.style.transform='translateY(20px)';
        setTimeout(() => {
            modal.style.display='none';
            document.getElementById('Footer').style.display='flex';
            document.getElementById('Header').style.display='flex';
            document.getElementById('mainContentContainer').style.display='block';            
        }, 200);
    },


    //removes attachments
    removeAttachments:function(n,attachment_id){

        
        
        let container=document.getElementById('attachmentsContainer');
        let children=container.childElementCount;
        let attachment=document.getElementById(attachment_id).parentNode;
            attachment.parentNode.removeChild(attachment);
            this.$emit('detach',1,n);
        if(children==1){
            this.closeModal(5);
        }
    },

    removeDossier:function(n){

        this.$emit('detach',2,n);
        this.closeModal(6);
    },

    removeTag:function(n,id){

        let container=document.getElementById('tagsContainer');
        let children=container.childElementCount;
        let tag=document.getElementById(id).parentNode;
            tag.parentNode.removeChild(tag);
            this.$emit('detach',3,n);         
        if(children==1){
            this.closeModal(7);
        }        
    }

    ,
    submitEntry:function(){


     //validation of user input
     try{
        let title=document.getElementById('title').value;
            title=title.trim();
        let body=document.getElementById('textareaMainText').value;
            body=body.trim();
        let day=document.getElementById('day').innerHTML;
        let time=document.getElementById('time').innerHTML;

        let attachments='';
        let dossier='';
        let tags='';   
        

        if(this.new_attachments!=''){
            attachments = this.new_attachments;
        }

        if(this.new_dossier!=''){
            dossier = this.new_dossier;            
        }
        
        if(this.new_tags!=''){
            tags = this.new_tags;
        }
        
        
         if(title==''){
             throw 'Please add a title'
         }

        if(body==''){
             throw 'Please add some text to your note';
         }
 
        // //create POST request
        let request= new XMLHttpRequest();    
        request.open('POST','http://localhost:8080/api/addNewNote');
        
        //set session_id in the request header
        let session_id=localStorage.getItem('session_id');  
        let user_id=localStorage.getItem('user_id');
        
        request.setRequestHeader('session_id', session_id);
        request.setRequestHeader('user_id',user_id);
        
        let data=JSON.stringify({title:title,body:body,day:day,time:time,attachments:attachments,dossier:dossier,tags:tags});
        console.log(data);

        request.send(data);  

        request.onload =function(){
            
            if(this.status==200){
                alert(this.responseText);
                location.reload();
             
            }
            else{
                alert(this.responseText);
            }
        }
        
     }
     catch (error){
         alert(error);
     }
    },    
  },    
}

</script>


<style>



main {position: relative; }

/* #header {} */

#div_title {   

        margin-top: 2%;     
        border: none;
        background-color: rgb(0, 139, 139,0.1);
        /* background-color: white; */
        
        color: rgb(0, 139, 139);

        text-align: justify;
        font-size: 0.9em;
        font-weight: bold;
        padding-top: 1%;
        padding-bottom: 1%;
        }
#time, #day {                
             font-weight: bold; 
             cursor: pointer;
             color: darkcyan;
             display: flex;
             flex-direction: column;
             justify-content: center;
             text-align: center;  
            }

#mainContentContainer {margin-top: 1%;
                       
                       position: relative; 
                       height: 100%;
                       }

#new_mainTextContainer {
                       position: relative;  
                       margin-top: 1%; 
                       height: 49%;

}

#div_mainText { 
            position: relative;
            
            border: solid rgba(0,0,0,0.1) thin;
            
            cursor: pointer;
            height: 100%;
            background-color: white;
            color: rgba(0,0,0,0.4);
            overflow-y: hidden;
            overflow-x: hidden;
            word-wrap: break-word;
            
}

#new_assignedDataContainer {
                 margin-top: 1%;
                 height: 10%;
                 
          
}





#new_buttonSubmit {
                margin-top: 2%;
                margin-left: auto;
                margin-right: auto;
                
                
                background-color: rgba(0,0,0,0.9);
                color: white;
                /* background-color: white; */
}

#calendarModal, #textAreaModal,#titleModal,#attachmentsModal,#dossierModal,#tagsModal {
    
    position: absolute;  
    z-index: 1;  
    top: 0;
    
    margin-left: auto;
    margin-right:auto;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0);
    display: none;
    opacity: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateY(20px);
    transition: opacity 0.2s,transform 0.2s;
    
}



/* #attachmentsModal,#dossierModal,#tagsModal{
justify-content: center;
} */

#attachmentsModal p,#dossierModal p,#tagsModal p {
    
    text-align: center;
    color: rgba(0,0,0,0.7);
    
    
}

#attachmentsModal button,#dossierModal button,#tagsModal button{
    margin-top: 0;
}



#clockModal {
    position: absolute;
    z-index: 1;
    top: 0%;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    background-color: rgba(0,0,0,0);
    
    display: none;
    opacity: 0;
    flex-direction: column;
    align-items: center;
    transform: translateY(20px);
    transition: opacity 0.2s,transform 0.2s;    
}

#title {
            width: 90%;
            background-color: rgb(0, 139, 139,0.05);
            color: rgba(0,0,0,0.8);
            border: none;
            padding-top: 1%;
            padding-bottom: 1%;
}

#textareaMainText {
            resize: none;
            text-align: justify;
            
            background-color:rgb(0, 139, 139,0.05);
            width: 90%;
            border: none;
            color: rgba(0,0,0,0.8);
            height: 300px;
            overflow-y: scroll;
            padding: 1%;
}



.new_assignedData i{
    color: rgb(0, 139, 139,1);
    /* color: rgba(0,0,0,0.8);     */
}

.empty {
    cursor: default!important;
    
}
.empty i{
    color: rgba(0,0,0,0.3)!important;
    font-size: 1.2em!important;    
}








</style>