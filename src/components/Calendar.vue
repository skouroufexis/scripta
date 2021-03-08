<template>
    <div>
        
        <!-- <DatePicker 
          mode='date'
          v-model="date"
          

        >  -->
        
         <Calendar id="calendar"
           v-bind:attributes='attributes'
           v-bind:calendar='calendar'
           
         /> 
        

    
    </div>    


    
</template>



<script>

import Calendar from 'v-calendar/lib/components/calendar.umd';
// import DatePicker from 'v-calendar/lib/components/date-picker.umd';

// let today = new Date(); 
export default {
    name:'Calendario',
    components:{Calendar},
    
    data:function() {
    return {  
      
      calendarMonth:'',
    }
  },
  
  watch:{

    //sets event listener on calendar days every time the month displayed changes
    calendarMonth:function(){
      
      this.calendarMounts();
    }
  },

  mounted(){

      //set the calendarMonth value for the first time
      this.updateMonth();

      //add event listener on navigation arrows (updates calendarMonth)
      let arrows=document.getElementsByClassName('vc-arrow');
      arrows.forEach((arrow)=>{
        arrow.addEventListener('click',this.updateMonth);    

      });

      //add event listener on the rest of the navigation buttons (updates calendarMonth)
      let gridCells=document.getElementsByClassName('vc-grid-cell');
      gridCells.forEach(gc=>{
      gc.addEventListener('click',this.updateMonth);
      });
   
    //set event listener for the calendar days (will update the selected date)
    this.calendarMounts();
    
    
 },

  props:['months','title'],

  methods:{

    //updates the calendarMonth with the currently showing month
    //When the month changes, a watcher will be used to set an event listener
    //on the days, which will trigger the function to update the selected date

     updateMonth:function(){
      let gridCells=document.getElementsByClassName('vc-grid-cell');
      gridCells.forEach(gc=>{
      gc.addEventListener('click',this.updateMonth);
      });
       
       //check the month row to see if the month changed => update calendarMonth
       setTimeout(() => {
         let title=document.getElementsByClassName('vc-title');
         let month=title[0].innerHTML;
         this.calendarMonth=month;
       }, 800);

     },

    //sets event listeners on each day for calling selectDay() which updates the selected date
    calendarMounts:function(){

    // retrieve today's day
    let fullDate=document.getElementById('day').innerHTML;
    let splitDate=fullDate.split(' ');
    
    let day=splitDate[0];
    let month=splitDate[1];
    let year = splitDate[2];

    //remove 0 from days 01-09 of the month
    let splitDay=day.split('');
        if(splitDate[0]=='0')
          {
            day=splitDay[1];
          }

  
   //retrieve showing Month & Year of calendar
   let monthYear=this.calendarMonth;
       monthYear=monthYear.split(' ');
   let cMonth=monthYear[0];
       cMonth=cMonth.substring(0,3);
   let cYear = monthYear[1];

   //retrieve day container
   let days=document.getElementsByClassName('vc-day'); 
   days.forEach(d=>{
     let child =d.childNodes;
     let dayContainer=child[0];
    
     //add focus to selected day 
     if(dayContainer.innerHTML==day && cMonth==month && cYear==year)
        {
          dayContainer.style.backgroundColor='rgba(0,130,139,0.1)';
        }
     
     //add event listener on calendar days  
     dayContainer.addEventListener('click',()=>{
       this.selectDay(days,dayContainer);
     } )
     
   })


  },

    selectDay:function(days,dayContainer){
      //month names
      let months=this.months;
      
      // remove focus from non-selected days
      days.forEach(d=>{
     let child =d.childNodes;
     let container=child[0];
      container.style.backgroundColor='white';
     } );

     //highlight selected day
       dayContainer.style.backgroundColor='rgba(0,130,139,0.1)';
       

     //change the date if another day was selected
    let monthYear=document.getElementsByClassName('vc-title');
    monthYear=monthYear[0].innerHTML.split(' ');

    //get month name & trim it to 3 characters
    let newMonth=monthYear[0];
        newMonth=newMonth.substring(0,3);

        //get newMonth as number
        months.forEach((m,index)=>{
          if(m==newMonth)
            {
              newMonth=index;
            }
        });
    
    //get year
    let newYear=monthYear[1];
    
    //get day
    let newDay=dayContainer.innerHTML;
    //set new Date
    let newDate=new Date(newYear,newMonth,newDay);

    this.$emit('updateToday',newDate);
    }
  },
    
    
}

  
</script>



<style>

#calendar {color: darkcyan;}

</style>