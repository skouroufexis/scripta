<template>

    
        <main id="Index" class="container">
            <transition name="fade">
                <div v-if="!openNote">
                    <div class="container">
            
                        <div class="row" id="searchbarContainer">
                            <input class="col-12" type="text" id="searchbar" placeholder="title" v-on:keyup='queryNote'>
                        </div>
                        
                        <div v-if="this.recentNotes==''" class="row" id="lastNoteContainer">
                            <div class="col-12 systemMessage  top2" id="lastNote">
                               No recent notes found
                            </div>
                        </div>      
        
                        <div v-if="this.recentNotes!=''">
                            <div class="col-12 top1  systemMessage">Your recent notes</div>
                            <div v-for="recentNote in this.recentNotes" :key="recentNote.note_id" class="row record full">
                                <button class="col"><i class="fas fa-feather-alt results_label full left"> <span class="left2">{{recentNote.title}} </span></i></button>
                                <button class="col-2" v-on:click="oNote(recentNote)">open</button>
                                <button class="col-2" v-on:click='deleteNote(recentNote)'><i class="far fa-trash-alt"></i> </button>
                               
                            </div>
                        </div>          
                    </div>
                </div>
            </transition>

            <transition name="fade">
                <Note v-if="openNote"
                      v-bind:noteData='selectedNote'
                      v-on:back_notes='back_notes'   
                
                 />
            </transition>

        </main>
    

</template>


<script>

import Note from './Note';
export default {
    name:'Index',

    components: {
    Note
  },

    data:function(){
        return{
           recentNotes:[],
           selectedNote:[],
           openNote:false
        }
    },

    // props:[],

    watch:{
         recentNotes:function(newVal){
               this.recentNotes=newVal;  
               
               
         }, 
        //  dossier:function(newVal){
        //        this.dossier=newVal;   
               
        //  },
        //  tags:function(newVal){
        //          this.new_tags=newVal;                 
        //  },
        
    },

    mounted:function(){
    //get  3 most recent notes
    this.getRecentNotes();
    },

    methods:{        
        getRecentNotes:function(){
            this.recentNotes=[];
            let self= this;
             

            let request= new XMLHttpRequest();            
            request.open('GET','https://scripta-app.herokuapp.com/api/recent-notes');        

            let session_id=localStorage.getItem('session_id');
            let user_id=localStorage.getItem('user_id');

            request.setRequestHeader('session_id', session_id);               
            request.setRequestHeader('user_id', user_id);               

            //send request
            request.send();  

            request.onload=function(){
                if(this.status==200){
                    let response=JSON.parse(this.responseText);
                    self.recentNotes=response;
                } 
                else{
                     alert(this.responseText);
                }  
            }  


        },

        queryNote:function(){
            this.recentNotes=[];
            let self= this;
            let query_input=document.getElementById('searchbar').value.trim();
            
            if(query_input!=''){

                let request= new XMLHttpRequest();            
                request.open('GET','https://scripta-app.herokuapp.com/api/query-note');        

                let session_id=localStorage.getItem('session_id');
                let user_id=localStorage.getItem('user_id');
                


                request.setRequestHeader('session_id', session_id);               
                request.setRequestHeader('user_id', user_id);               
                request.setRequestHeader('query_input', query_input);               
                //send request
                request.send();  

                request.onload=function(){
                    if(this.status==200){
                        let response=JSON.parse(this.responseText);
                        self.recentNotes=response;
                    } 
                    else{
                        alert(this.responseText);
                    }  
                }  

            }
            else{
                this.getRecentNotes();
            }

            
        },
        oNote:function(note){

            this.selectedNote[0]=({note_id:note.note_id,title:note.title,body:note.body,date:note.date,time:note.time,dossier_fk:note.dossier_fk,user_fk:note.user_fk});
            this.openNote=true;
        },
        deleteNote:function(note){
            let self=this;
            let del = confirm('Are you sure you want to delete this note?');
            if(del==true){
                
            let request= new XMLHttpRequest();            
            request.open('DELETE','https://scripta-app.herokuapp.com/api/note');        

            let session_id=localStorage.getItem('session_id');            
            let data=JSON.stringify({note_id:note.note_id});            
            request.setRequestHeader('session_id', session_id);                                           
            //send request
            request.send(data);  

            request.onload=function(){
                if(this.status==200){
                    alert(this.responseText);
                    self.getRecentNotes();
                } 
                else{
                    alert(this.responseText);        
                }  
            }        



            }
            
        },
        back_notes:function(){
            this.openNote=false;
            this.getRecentNotes();
        }

    },
}
</script>


<style>



#searchbarContainer {
                     margin-top: 2%;   
                     justify-content: center;
                     text-align: left;
                    }

#searchbar {
            
            border-radius: 20px;
            border:solid lightgrey thin;
            }






</style>