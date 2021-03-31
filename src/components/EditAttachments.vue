<template>

    <div id="EditAttachments" class="container">

        <transition name="fade">
            <div v-if="!viewImage">
                <div class="row">
                    <button v-on:click='$emit("back_noteAttachments")'>
                        <i class="fas fa-caret-left back"></i>
                    </button>
                </div>
        
                 <div class="container">
                    <h5 class="row darkcyan">Edit or delete note attachments</h5>
                </div>
        
                <div class="container sideDataContainer">                
                    <div class="row  top1 record justify_centre padding1" v-for="noteAttachment in this.noteAttachments" :key="noteAttachment">   
                        <div v-on:click='viewOn(noteAttachment.attachment_name)' ><img class="attachment" v-bind:src='noteAttachment.attachment_name'></div>
                        <a class="left2" download v-bind:href='noteAttachment.attachment_name'>
                            <button class="vertical_centre" style="height:80px;" >
                                <i class="fas fa-download"></i>
                            </button>
                        </a>
                        <button class="left2 vertical_centre" style="height:80px;" v-on:click='deleteAttachment(noteAttachment.attachment_id,noteAttachment.note_fk)'>
                            <i class="far fa-trash-alt"></i
                        ></button>                                
                    </div>   
                    <div class="row" v-if="this.noteAttachments=='' &&!this.noAttachments">
                        <div class="row" ><img style="height:40px;width:auto;" class="col" src="../assets/loading.gif" alt="loading"> </div>             
                    </div>
                </div>
        
                <div class="container top1" id="newAttachmentsContainer" style="height:auto; max-height: 300px; overflow-y: scroll;">
                    <div class="row" v-for="newNoteAttachment in newNoteAttachments" :key="newNoteAttachment.attachment_name">
                        
                        <div><img class="attachment" v-bind:src='newNoteAttachment.attachment_data'></div>
                        
                        <button style="height:80px" class="left1 vertical-centre" v-on:click='removeNewAttachment(newNoteAttachment)'><i class="far fa-times-circle black"></i></button>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <button v-on:click='openFile'><i class="fas fa-plus-circle"></i></button>     
                        <button v-if="this.newNoteAttachments!=''" class="left1" v-on:click='updateAttachments'>save</button>
                    </div>        
                </div>    
        
                <div class="container" style="display:none"> <input type="file" id="input_file" v-on:change='validate' accept=".png,.jpeg,.jpg,.pdf"> </div>
            </div>  
        </transition>

        <transition name="down"  >
            <ViewImage
             v-if="viewImage"
             v-on:back_noteImage='back_noteImage'
             v-bind:attachments='selectedAttachment' 
             />
        </transition >    
    </div>  
</template>


<script>

import ViewImage from './ViewImage';

export default {
    name:'EditAttachments',

    components:{
        ViewImage
    },

    data:function(){
        return{
           noteAttachments:[],

           newNoteAttachments:[],
           totalSize:0,
           viewImage:false,
           selectedAttachment:[]
        }
    },

    props:['attachments','noteData','noAttachments'],

    

    watch:{
         noteAttachments:function(newVal){

               this.noteAttachments=newVal;                                
               
         }, 

         newNoteAttachments:function(newVal){

               this.newNoteAttachments=newVal;                                
               
         },
         attachments:function(newVal){

               this.attachments=newVal;   
               
               this.showAttachments();
               
         },

    },

    mounted:function(){
        
        this.showAttachments();

    },


    methods:{

        showAttachments:function(){

            //turn attachment data into visible format
            this.noteAttachments=[];
            this.attachments.forEach(a => {
            let att=a.attachment_name.data.map(b => String.fromCharCode(b)).join('');
            this.noteAttachments.push({attachment_id:a.attachment_id,attachment_name:att,note_fk:a.note_fk});
            
            });

        },

        viewOn:function(attachment){
            this.viewImage=true;
            
            this.selectedAttachment=attachment;
            
        },
        back_noteImage:function(){
            this.viewImage=false;
        },

        deleteAttachment:function(attachment_id,note_fk){
            let self=this;
            let session_id=localStorage.getItem('session_id');
            let request=new XMLHttpRequest();                        
            request.open('DELETE','http://scripta.domes-web.net/api/attachment');

            request.setRequestHeader('session_id', session_id);
            request.setRequestHeader('Content-Type','application/json');

            let data=JSON.stringify({attachment_id:attachment_id,note_fk:note_fk});

            request.send(data);                  

            request.onload = function (){        

                    if(this.status==200){ //request is valid                    
                        
                        let newAttachments=[];
                        self.noteAttachments.forEach(a=>{
                            if(a.attachment_id!=attachment_id){                                
                                newAttachments.push({attachment_id:a.attachment_id,
                                                     attachment_name:a.attachment_name,
                                                     note_fk:a.note_fk});
                                }
                         });
                        
                        self.noteAttachments=newAttachments;                                       
                        alert(this.responseText);
                    
                    }
                    else{
                        alert(this.responseText);
                    }                    
            };
        },

        openFile:function(){
            document.getElementById('input_file').click();
        },

        validate:function(){
         
            
            let attachment=document.getElementById('input_file').files[0];

            let size=attachment.size;

            try{
                if(size>=10000000){
                        
                        throw 'Uploaded file must not exceed 10MB';
                }

                this.totalSize=this.totalSize+size;     
                
                if(this.totalSize>30000000){
                    throw 'Total size for new attachments must not exceed 30 MB. Please choose a smaller file';
                }

                if(this.newNoteAttachments!=''){

                    this.newNoteAttachments.forEach(a => {                                
                        if(a.attachment_name==attachment.name){                        
                            throw 'File already attached';                            
                        }                
                    });                
                }                                
                let reader = new FileReader();
                reader.readAsDataURL(attachment);

                

                //add attachment to the attachments array
                reader.onload=()=>{                       
                    //check that new attachment does not already exist                    
                        this.noteAttachments.forEach(a => {                           
                     if(a.attachment_name===reader.result){                            
                        throw 'File already attached'; 
                     }                
                    });                                
                    this.newNoteAttachments.push({attachment_name:attachment.name,attachment_data:reader.result});                
                }

                setTimeout(() => {                
                document.getElementById('newAttachmentsContainer').scrollTop=300;
                document.getElementById('Dossier').scrollTop=300;
                }, 100);
                               
            }
            catch(error){
                alert (error);
            }



        },

        removeNewAttachment:function(attachment){
            
            let newAttachments=[];
            this.newNoteAttachments.forEach(a=>{
                if(a.attachment_name!=attachment.attachment_name){
                    newAttachments.push(a);
                }
            });            
            // this.newNoteAttachments=newAttachments;
            this.newNoteAttachments=newAttachments;  
        },

        updateAttachments:function(){
            let self=this;

            let note_fk=this.noteData[0].note_id;            
            let session_id=localStorage.getItem('session_id');
            let data=[];
            let request=new XMLHttpRequest();
                            
            request.open('POST','http://scripta.domes-web.net/api/attachment');


            request.setRequestHeader('session_id', session_id);
            request.setRequestHeader('Content-Type','application/json');

            console.log(this.newNoteAttachments);
            this.newNoteAttachments.forEach(a=>{
                data.push({attachment_name:a.attachment_data,note_fk:note_fk});
            })

           data=JSON.stringify(data);  
           

            request.send(data);                  

            request.onload = function (){                                                                
                if(this.status==200){ //request is valid

                    alert(this.responseText); 

                    // clear newNoteAttachments
                    self.newNoteAttachments=[];

                    self.$emit('getAttachments');

                }
                else{
                    alert(this.responseText);
                }                    
            };
        }



    

    },
}
</script>


<style>

   
   

</style>

