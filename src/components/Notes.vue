<template>

    <div id="Notes" class="container">
        <transition name="fade">

            

            <div v-if="!openNote" class="container">

                <div class="row">
                    <button v-on:click='$emit("back_dossiers")'>
                        <i class="fas fa-caret-left back"> </i> 
                    </button></div>
                
                <div class="row"><b> <i class="fas fa-folder"> {{this.dossier.dossier_name}} </i></b></div>
    
                <div style="height:auto; max-height: 300px; overflow-y: scroll;">
                    <div class="row" v-for="note in notes" :key="note.note_id">
                        <div class="col record">
                            <i class="fas fa-feather-alt"> {{note.title}} </i>   
                        </div>
        
                        <button class="col record" v-on:click='showNote(note.note_id,note.title,note.body,
                                                               note.date,note.time,note.dossier_fk,note.user_fk)'>
                            open
                        </button>

                        <button class="col record" v-on:click='deleteNote(note.note_id)'>
                            <i class="far fa-trash-alt"></i>    
                        </button>
        
                    </div>
                </div>
    
                
    
            </div>
        </transition>

        <transition name="fade">
            <Note v-if="openNote" v-bind:noteData='selectedNote'
            v-on:back_notes='back_notes'
            
            />
        </transition>

    </div>    
</template>


<script>


import Note from './Note';


export default {
    name:'Notes',

    components:{
        Note
    },

    data:function(){
        return{
           notes:[],
           openNote:false,
           selectedNote:[]
        }
    },

    props:['dossier'],

    mounted:function(){
        this,this.getNotes();
    },

    methods:{

        getNotes:function(){

            //retrieve notes for this dossier
            let self=this;
            let request= new XMLHttpRequest();            
            request.open('GET','https://scripta-app.herokuapp.com/api/user-notes');        

            let session_id=localStorage.getItem('session_id');
            let user_id=localStorage.getItem('user_id');
            let dossier_id=this.dossier.dossier_fk;
        

            request.setRequestHeader('session_id', session_id);               
            request.setRequestHeader('user_id', user_id);               
            request.setRequestHeader('dossier_id', dossier_id);               

            //send request
            request.send();  

            request.onload=function(){
                if(this.status==200){

                    let response=JSON.parse(this.responseText);
                    self.notes=response;
            
                } 
                else{
                alert(this.responseText);
                }  
            }  

        },
        
        showNote:function(note_id,title,body,date,time,dossier_fk,user_fk){
     
        console.log(note_id,title,body,date,time,dossier_fk,user_fk)
         
        
        this.selectedNote=[{note_id:note_id,title:title,body:body,date:date,
                    time:time,dossier_fk:dossier_fk,user_fk:user_fk}];

            
        this.openNote=true;
            
        },
        deleteNote:function(note_id){
            let self=this;
            //confirm
            let del=confirm('Are you sure you want to delete this note?');
            if(del==true){                
                //send request
                let session_id=localStorage.getItem('session_id');            
                let request=new XMLHttpRequest();
                                
                request.open('DELETE','https://scripta-app.herokuapp.com/api/note');

                request.setRequestHeader('session_id', session_id);
                request.setRequestHeader('Content-Type','application/json');
                let data=JSON.stringify({note_id:note_id});
                request.send(data);                  

                request.onload = function (){                                                            
                    if(this.status==200){ //request is valid                    
                        alert(this.responseText);
                        self.getNotes();
                    }
                    else{
                        alert(this.responseText);
                    }                    
                };
            }
            

        },

        back_notes:function(){
            
            this.openNote=false;
            this.getNotes();
            
        },
       
        

       //

    },
}
</script>


<style>
    .record {margin-top: 1%;}
   .record i {
    font-size: 1em;
}

</style>

