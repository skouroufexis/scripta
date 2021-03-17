<template>

    <div id="EditDossierName" class="container">

         <div class="row">
            <button v-on:click='$emit("backDossier")'>
                <i class="fas fa-caret-left back"></i>
            </button>
         </div>

        <div class="container">  
            <div class="row black">Enter a new dossier name</div>    
              
            <div class="row top1">
                <input id="dossierName" type="text" v-on:keyup='enableButtons'>
            </div> 
            
            <div class="row top1">
                <button id="update" disabled v-on:click='updateName'>Update</button>
                <button id="cancel" class="button_cancel left2" v-on:click='cancelChanges'>Cancel</button>
            </div> 
            
        </div>


    </div>    
</template>


<script>
export default {
    name:'EditDossierName',

    data:function(){
        return{
           //
        }
    },

    props:['dossier'],

    watch:{
        //  attachments:function(newVal){
        //        this.new_attachments=newVal;  
               
               
        //  }, 
        //  dossier:function(newVal){
        //        this.dossier=newVal;   
               
        //  },
        //  tags:function(newVal){
        //          this.new_tags=newVal;                 
        //  },
        
    },

    methods:{
        
        enableButtons:function(){

            let input=document.getElementById('dossierName');
            if(input.value.trim()!=''){
                document.getElementById('update').disabled=false;
                document.getElementById('cancel').style.display='block';
            }
            else{
                document.getElementById('update').disabled=true;
                document.getElementById('cancel').style.display='none';
            }
            
        },

        cancelChanges:function(){
            let input=document.getElementById('dossierName');
            input.value='';
            document.getElementById('update').disabled=true;
            document.getElementById('cancel').style.display='none';
        },

        updateName:function(){
            
            let input=document.getElementById('dossierName');

            //highlight input text
            input.select();
            document.getElementById('update').disabled=true;
            document.getElementById('cancel').style.display='none';

            //send request to change dossier name
            
            let session_id=localStorage.getItem('session_id');
            let user_id=localStorage.getItem('user_id');
            let dossier_fk=this.dossier.dossier_fk;
            let dossier_name=input.value.trim();  

            let request=new XMLHttpRequest();                            
            request.open('PUT','https://scripta-app.herokuapp.com/api/dossier-name');
            request.setRequestHeader('session_id', session_id);
            request.setRequestHeader('Content-Type','application/json');

            let data=JSON.stringify({user_id:user_id, dossier_fk:dossier_fk,dossier_name:dossier_name});
            request.send(data);                  

            request.onload = function (){                                                                                
                    if(this.status==200){ //request is valid                        
                        alert(this.responseText);                    
                    }
                    else{
                        alert(this.responseText);
                    }                    
            };
        },
        

       //

    },
}
</script>


<style>
#cancel {display: none;}
   

</style>

