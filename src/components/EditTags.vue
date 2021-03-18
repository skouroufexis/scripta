<template>

    <div id="EditTags"  class="container">

        <div class="row">
            <button v-on:click='$emit("back_noteTags")'>
                <i class="fas fa-caret-left back"></i>
            </button>
        </div>

        <div class="container">
            <h5 class="row darkcyan">Add or remove tags</h5>
        </div>

        <div class="container sideDataContainer" >                
            
            <div class="row top1 record justify_centre" v-for="tagName in this.tagNames" :key="tagName.userTag_id">                                          
                <button class="col left vertical_centre" >    
                    <i class="fas fa-tag"> {{tagName.tag_name}} </i>                    
                </button>      
                <button class="col left vertical_centre"  v-on:click='deleteTag(tagName.userTag_id)'>                
                    <i class="far fa-trash-alt"></i>    
                </button>  

                <!-- <div class="row" v-if="this.noteAttachments=='' &&!this.noAttachments">
                <div class="row" ><img style="height:40px;width:auto;" class="col" src="../assets/loading.gif" alt="loading"> </div>             
                </div> -->
                                                
            </div>   
                             
            <!-- <div class="row" v-if="this.noteAttachments==''">
                <div class="row" ><img style="height:40px;width:auto;" class="col" src="../assets/loading.gif" alt="loading"> </div>             
            </div> -->
        </div>
        
        <div v-if="this.userTags!=''" class="top1 container systemMessage">Scroll down to see saved tags</div>
        <div class="container top1" id="newTagsContainer" style="height:90px; overflow-y:scroll;">
                
                <div class="row  background_darkcyan" v-for="userTag in this.userTags" :key="userTag.tag_name">
                    <button v-on:click='updateInput(userTag.userTag_id,userTag.tag_name)' class="left col-12"><i class="fas fa-tag  darkcyan"> <span class="black"> {{userTag.tag_name}} </span></i></button>
                </div>   
        </div>
        <div class="container">
                <div class="row">    

                    <input class="col-12 top1" id="input_tag" type="text" placeholder="New tag" v-on:keyup='getUserTags'>    
                    
                    <button class="col-12 top1 left" id="button_add" v-on:click='addTag' disabled>Add tag</button>
                </div>  
        </div>  


    </div>    
</template>


<script>
export default {
    name:'EditTags',

    data:function(){
        return{
        tagNames:[],
        userTags:[],
        tagId:''
        }
    },

    props:['tags','noteData'],


    watch:{
         tagNames:function(newVal){
               this.tagNames=newVal;                 
         }, 
           tags:function(newVal){
                 this.tags=newVal;    
                 this.getTagNames();             
         },

         userTags:function(newVal){
                 this.userTags=newVal;    
                 
         }
        //  dossier:function(newVal){
        //        this.dossier=newVal;   
               
        //  },
       
        
    },

    //retrieve tag names
    mounted:function(){
        this.getTagNames();
    },
    methods:{
        
        getTagNames:function(){
            
            let self=this;
            
            let tags=this.tags;     
            
            console.log(tags);
            tags.forEach(t => {
                
                let request= new XMLHttpRequest();            
                request.open('GET','https://scripta-app.herokuapp.com/api/user-tags');        

                let session_id=localStorage.getItem('session_id');
                let user_fk=localStorage.getItem('user_id');

                let tag_fk=t.tag_fk;
                request.setRequestHeader('session_id', session_id);               
                request.setRequestHeader('user_fk', user_fk);
                request.setRequestHeader('userTag_id',tag_fk);

                    //send request
                request.send();  

                request.onload=function(){
                    if(this.status==200){
                        let response=JSON.parse(this.responseText); 
                        console.log(self);

                        self.tagNames.push(response);
                        
                    } 
                    else{
                       alert(this.responseText)     
                    }  
                };        

            });       
        },

        deleteTag:function(tag_fk){
            let self=this;
            let note_fk=this.tags[0].note_fk;
            
            let session_id=localStorage.getItem('session_id');
            let request=new XMLHttpRequest();
                
            request.open('DELETE','https://scripta-app.herokuapp.com/api/note-tag');

            request.setRequestHeader('session_id', session_id);
            request.setRequestHeader('Content-Type','application/json');

            let data=JSON.stringify({note_fk:note_fk,tag_fk:tag_fk});
            request.send(data);                  

            request.onload = function (){        
                if(this.status==200){ //request is valid

                    alert(this.responseText);
                    self.tagNames=[];
                    self.$emit('getTags');

                }
                else{
                    alert(this.responseText);
                }                    
            };


        },
        getUserTags:function(){   
            this.tagId='';
            
            
            let inputValue=document.getElementById('input_tag').value.trim();
            if(inputValue!=''){
                
                document.getElementById('button_add').disabled=false;    
                let self=this;
                this.userTags=[];
                inputValue=encodeURI(inputValue);
                let request= new XMLHttpRequest();            
                request.open('GET','https://scripta-app.herokuapp.com/api/get-user-tags');        

                let session_id=localStorage.getItem('session_id');
                let user_id=localStorage.getItem('user_id');
            

                
                request.setRequestHeader('session_id', session_id);               
                request.setRequestHeader('user_id', user_id);
                request.setRequestHeader('input_value', inputValue);  
                

                //send request
                request.send();  

                request.onload=function(){
                    if(this.status==200){
                        let response=JSON.parse(this.responseText);
                    
                        response.forEach(r=>{
                            self.userTags.push({userTag_id:r.userTag_id, tag_name:r.tag_name});
                            // document.getElementById('newAttachmentsContainer').scrollTop=300;
                            // document.getElementById('Dossier').scrollTop=300;
                        })
                    } 
                     
                }  
            }
            else{
                this.userTags=[];
                document.getElementById('button_add').disabled=true;
            }

        },

        addTag:function(){      
            
            let self=this;

            let note_fk=this.noteData[0].note_id;                
            let tagName=document.getElementById('input_tag').value.trim();
            let session_id=localStorage.getItem('session_id');
            let user_fk=localStorage.getItem('user_id');



           //check if tag is already included 
           let included=false;
           this.tags.forEach(t=>{
               if(t.tag_fk==this.tagId){
                   included=true
               }
           });

        console.log(this.tagNames)
           this.tagNames.forEach(t=>{
               if(t.tag_name==tagName){
                   included=true;
               }
               
           })

           if(included==true){
               alert('tag already included');
           }
           else{  
            
                
            let request=new XMLHttpRequest();
                            
            request.open('POST','https://scripta-app.herokuapp.com/api/notesTags');

            request.setRequestHeader('session_id', session_id);
            request.setRequestHeader('Content-Type','application/json');

            let data=JSON.stringify({tag_name:tagName,
                                     user_fk:user_fk,
                                     note_fk:note_fk   
                                    });
            request.send(data);                  

            request.onload = function (){        
                                                    
                    if(this.status==200){ //request is valid
                        alert(this.responseText);
                        self.tagNames=[];                        
                        self.$emit('getTags');
                        document.getElementById('button_add').disabled=true;
                        document.getElementById('input_tag').value='';
                        self.userTags=[];
                    
                    }
                    else{
                        alert(this.responseText);
                    }                    
            };

                
           }
            
        },
        updateInput:function(tag_fk,tag_name){
            
            // document.getElementById('button_add').disabled=true;
            document.getElementById('input_tag').value=tag_name;
            this.tagId=tag_fk;
            console.log(tag_fk)
        },
        

       //

    },
}
</script>


<style>

   

</style>

