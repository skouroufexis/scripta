
<template>

    <div id="EditDossier" class="container">

        <div class="row">
            <button v-on:click='$emit("back_noteDossier",currentDossier)'>
                <i class="fas fa-caret-left back"></i>
            </button>
        </div>



        <div class="container">
            <h5 class="row darkcyan">Edit or remove dossier</h5>
        </div>
        
        <div class="container" style="height:200px">               

                <div v-if="this.userDossiers!=''">
                    <div class="sideDataContainer row record" v-for="(userDossier,index) in userDossiers" :key="index" >                                            
                        <button v-on:click='updateInput(userDossier.dossier_name)' class="col-12  left"><i  class="fas fa-folder darkcyan"> <span class="black"> <p>{{userDossier.dossier_name}}</p></span>  </i></button>                                                                 
                    </div>    
                </div>     

        </div>

        <div class="container">
            <div class="row darkcyan">
                <b><p class="vertical-centre " style="height:40px;"> {{this.currentDossier}} </p></b>
                <button class="left1" v-if='this.currentDossier!=""' v-on:click='deleteDossier'><b><i class="far fa-trash-alt"></i></b></button>
            </div>

            <div class="row top1" id="editDossier_inputContainer">
                <input class="col-12 " v-on:keyup='getDossiers' type="text" id="input_newDossier">
                <button id="editDossier_update" class="top1 col-12 button_secondary" disabled v-on:click='updateCurrentDossier'>Update</button>                
            </div>

        </div>


    </div>    
</template>


<script>
export default {
    name:'EditDossier',

    data:function(){
        return{
        //    dossier:[],
           userDossiers:[],
           currentDossier:'',
           
        }
    },

    props:['dossier'],

    mounted:function(){

        // document.getElementById('input_newDossier').value=this.dossier.dossier_name;

        this.currentDossier=this.dossier.dossier_name;


        // this.getDossiers();
        
    },


    watch:{
         userDossiers:function(newVal){
               this.userDossiers=newVal;                                
         }, 
    },

    methods:{
        
        getDossiers:function(){
            let input=document.getElementById('input_newDossier');
            let input_value;    
                       
            let self=this;
            let request= new XMLHttpRequest();            
            request.open('GET','https://scripta-app.herokuapp.com/api/get-user-dossiers'); 
            
             if(input.value!=this.dossier.dossier_name && input.value.trim()    !=''){
                input_value=input.value;
                input_value=encodeURI(input_value);
                request.setRequestHeader('input_value',input_value);
            }

            let session_id=localStorage.getItem('session_id');
            let user_id=localStorage.getItem('user_id');

            request.setRequestHeader('session_id', session_id);               
            request.setRequestHeader('user_id', user_id);               

            //send request
            request.send();  

            request.onload=function(){
                if(this.status==200){
                    let response=JSON.parse(this.responseText);


                    if(response!=''){
                        self.userDossiers=response;                        
                        
                    }
                    else{
                        self.userDossiers="";
                    }
                                
                } 
                else{
                    alert(this.responseText);
                }  
            }  


            if(document.getElementById('input_newDossier').value!=''){
                document.getElementById('editDossier_update').disabled=false;

            }
            else{
                document.getElementById('editDossier_update').disabled=true;
            }



        },

        deleteDossier:function(){
            this.currentDossier='';
            document.getElementById('input_newDossier').value='';
            
            
        },

        updateInput:function(name){
            
            document.getElementById('editDossier_update').disabled=false;
            document.getElementById('input_newDossier').value=name;
        },
        updateCurrentDossier:function(){
           this.currentDossier=document.getElementById('input_newDossier').value.trim();
            document.getElementById('editDossier_update').disabled=true;
        }
        

       //

    },
}
</script>


<style>



</style>

