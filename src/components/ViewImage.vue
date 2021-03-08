<template>

    <div id="ViewImage" class="container">

        <div class="row">
            <button v-on:click='$emit("back_noteImage")'>
                <i class="fas fa-caret-left back"></i>
            </button>
         </div>

        <div class="container top1">
            
           <div class="row full justify-centre" style="height:300px">
                <div class="vertical-centre">
                    <img class="img-fluid img_fullScreen" v-bind:src="this.attachments" alt="attachment">
                </div>
            </div>           
        </div>

        <div class="container top1">
            <div class="row full justify-centre">
                <div class="vertical-centre">
                    <a download="" v-bind:href="this.attachments"><button style="font-size:1.3em" class="top1"><i class="fas fa-download"></i></button></a>
                </div>
            </div>      
            
        </div>


    </div>    
</template>


<script>
export default {
    name:'ViewImage',

    data:function(){
        return{
           //
        }
    },

    props:['attachments'],

    mounted:function(){
        
    },

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
        
        methodName:function(){},
        

       //

    },
}
</script>


<style>

   

</style>

