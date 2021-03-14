<template>
    <div>
        <VueClockPicker id="clock">
        </VueClockPicker>    
    </div>

    
</template>

<script>
  import VueClockPicker from 'vue-clock-picker';
  

//    let buttonPicker=document.getElementsByClassName('time-picker-preview');
//        buttonPicker=buttonPicker[0]; 
       
       
     

  export default {
    name:'Clock',
    components: { VueClockPicker },
  }


</script>


<style>

.time-picker-preview {    
    color: black;
    background-color: white;
    box-shadow: none;
    visibility: visible;
    
}

.time-picker-modal-container{    
    width: 100%;
}

.time-picker-header.active{color: darkcyan!important;}
.time-picker-header:hover {color: darkcyan!important;}
.picker-container{
    background-color: white;
    /* border: solid rgb(0, 139, 139,0.4) thin; */
    box-shadow: 0px 0px 1px darkcyan;

}

.time-picker-preview {
  height:0px;
  
  }
.preview-container {
visibility: hidden;

}

/* .time-picker-preview {border: solid red thin; pointer-events: none;} */
.pointer-wrapper{
    color: darkcyan; 
}


.point-outter.current {
    
   background-color: rgb(0, 139, 139,0.1);    
}

.time-picker-interval.active {color: darkcyan;}
.time-picker-interval:hover{color: darkcyan;}
/* .active {color: darkcyan;} */


</style>