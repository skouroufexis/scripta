<template>

    <main id="Dossier" class="container">
        <transition name="fade">
            <div v-if="!openNotes && !editName">
                <div class="row justify-centre systemMessage" v-if="!hasDossier">You have no recent dossiers</div>
                <div v-if="hasDossier" >
                    
                    <div class="row results_row" v-for="dossier in dossiers" :key="dossier">
    
                        <div class="col-1">
                            <i class="fas fa-folder full right results_label"> </i>                        
                        </div>
    
                        <div class="col-3 results_label">
                            {{dossier.dossier_name}}                       
                        </div>
    
                        <div class="col-2">
                            <i class="fas fa-feather-alt results_label full left"> {{dossier.count}} </i>                          
                        </div>
    
                        <button class="col" v-on:click='showNotes(dossier.dossier_id,dossier.dossier_name)'>open</button>
                        <button class="col" v-on:click='editNameOn(dossier.dossier_id,dossier.dossier_name)' ><i class="far fa-edit"></i></button>
                        <button class="col" v-on:click='deleteDossier(dossier.dossier_id,dossier.dossier_name)'><i class="far fa-trash-alt"></i> </button>
                        
                          
                    </div>
                </div>
            </div>
        </transition>
            
        <transition name="fade">
            <Notes  v-if="openNotes" v-on:back_dossiers='back_dossiers' v-bind:dossier='selectedDossier' 
                   
             />
        </transition>

        <transition name="down">
            <EditDossierName
             v-if='editName'
             v-on:backDossier='back_dossiers2'
             v-bind:dossier='selectedDossier'
            />
        </transition>


    </main>    

</template>

<script>
import Notes from './Notes';
import EditDossierName from './EditDossierName';
export default {
    name:'Dossier',

    components: {
    Notes,EditDossierName
    },

    data:function(){
        return{
           dossiers:[],
           hasDossier:true,
           openNotes:false,
           editName:false,
           selectedDossier:[]
           
        }
    },

     watch:{
         dossiers:function(newVal){
               this.dossiers=newVal;                                
               
         }, 
        //  dossier:function(newVal){
        //        this.dossier=newVal;   
               
        //  },
        //  tags:function(newVal){
        //          this.new_tags=newVal;                 
        //  },
        
    },

    mounted:function(){

        this.getDossiers();
        
    },

    methods:{

        getDossiers:function(){
            this.dossiers=[];
            let self=this;
            let request= new XMLHttpRequest();            
            request.open('GET','/api/get-dossiers-info');
            let session_id=localStorage.getItem('session_id');
            let user_id=localStorage.getItem('user_id');
            request.setRequestHeader('session_id', session_id);               
            request.setRequestHeader('user_id', user_id);               
            //send request
            request.send();  
            request.onload=function(){
                if(this.status==200){
                    if(this.responseText!=''){
                        
                        self.hasDossier=true;
                        let response = JSON.parse(this.responseText);
                        response.forEach(r => {
                            self.dossiers.push(r);                           
                        });
                    }

                } 
                else{
                    console.log(this.responseText);
                }  
            }  
        },
       
       showNotes:function(dossier_fk,dossier_name){
           
           this.selectedDossier=({dossier_fk:dossier_fk,dossier_name:dossier_name});
           
           this.openNotes=true;
       },

       editNameOn:function(dossier_id,dossier_name){
           this.selectedDossier=({dossier_fk:dossier_id,dossier_name:dossier_name})
           this.editName=true;
           console.log(dossier_id + dossier_name);
       },

       back_dossiers:function(){
           
           this.openNotes=false;
           this.dossiers=[];
            this.getDossiers();
            
       },
       back_dossiers2:function(){           
           this.editName=false;
           this.dossiers=[];
           this.getDossiers();            
       },


       deleteDossier:function(dossier_id,dossier_name){
           let self=this;
           let del=confirm(`Are you sure you want to delete ${dossier_name} and all the notes included in it?`);
           
           if(del==true){

              //send delete request
              let session_id=localStorage.getItem('session_id');               
              let request=new XMLHttpRequest();                
              request.open('DELETE','https://scripta-app.herokuapp.com/api/dossier');
              request.setRequestHeader('session_id', session_id);
              request.setRequestHeader('Content-Type','application/json');
              let data=JSON.stringify({dossier_fk:dossier_id});
              request.send(data);                  

              request.onload = function (){        
                if(this.status==200){ //request is valid
                    alert(this.responseText);
                    self.getDossiers();
                }
                else{                        
                    alert(this.responseText);
                }                    
             };
           }
           

       },
      

    },
}
</script>


<style>
   .dossier_row{
       border: solid darkcyan thin;    
    }
</style>