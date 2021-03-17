<template>

    <div class="container footer">
        <div class="container">

            <div class="row" v-if='menuNumber==2'>
                <!-- <button><i class="fab fa-whmcs"></i></button> -->
                <button id="footer_button_openActions" v-on:click='openActions'><i class="fas fa-plus-circle"></i></button>
            </div>

            <div class="row" v-if='menuNumber!=2'>                
                <button id="footer_button_whiteSpace"><i class="fas fa-plus-circle"></i></button>
            </div>

            <div class="row" id="actionsContainer">   
                
                <button class="col-12" id="footer_button_closeActions" v-on:click='closeActions'>                        
                        <i class="fas fa-caret-down"></i>
                </button>

                

                <button class="footer_button_actions" id="footer_buttonAttachment"  v-on:click='openAttachment'>                                
                        <img src="../assets/attachment.png"  alt="attachment icon">                                
                </button>
                 
                 <button class="footer_buttonClear"  id="footer_buttonClearAttachment"  v-on:click='detachFile(1)'>                                
                        <i class="far fa-trash-alt"></i>
                </button>
                
                <button class="footer_button_actions" id="footer_buttonDossier" v-on:click='openDossierTags(1)'>                                                        
                        <img src="../assets/dossier2.png" alt="add to dossier icon">
                </button>

                 <button class="footer_buttonClear"  id="footer_buttonClearDossier"  v-on:click='detachFile(2)'>                                
                        <i class="far fa-trash-alt"></i>
                </button>

                <button class="footer_button_actions" id="footer_buttonTags" v-on:click='openDossierTags(2)' >
                        <img src="../assets/tag.png" alt="tag icon">
                </button>

                 <button class="footer_buttonClear"  id="footer_buttonClearTags"  v-on:click='detachFile(3)'>                                
                        <i class="far fa-trash-alt"></i>
                </button>

                
                

                <input type="file"  id="attachment" style="display:none;" v-on:change='attachFile' accept=".png,.jpeg,.jpg,.pdf">
                
            </div>

            <div class="row" id="footerMenuContainer">

                   <button class="footer_button_main" v-on:click='navigate(1,"Scripta")' > 
                           <!-- <img    src="../assets/logo.png" alt="logo"> -->
                           <img src="../assets/home.png" alt="home icon">
                   </button>

                    <button class="footer_button_main" v-on:click='navigate(2,"Add new note")'>
                            <img src="../assets/pen.png" alt="pen icon">                        
                    </button>
                
                    <button class="footer_button_main" v-on:click='navigate(3,"My dossiers")'>
                            <img src="../assets/dossier1.png" alt="dossier icon">
                    </button>
                
                        
                    <!-- <button class="footer_button_main" v-on:click='navigate(4,"Calendar")'>
                            <img src="../assets/calendar.png" alt="calendar icon">
                    </button>      -->

                    

            </div>


            <div id="footer_dossierModal">
                <div class="container">
                        <div class="container">        
                            <div class="row">
                                <div class="container" id="footer_dossierResultsContainer">
                                </div>
                            </div>

                            <div class="row" style="margin-top:1%">
                                <div class="col-12 top2" id="footer_addedDossier">
                                        
                                </div>
                            </div>
        
                            <div class="row" style="margin-top:1%">
                                    <input class="col-9" id="footer_inputDossierName" style="height:40px"  v-on:input='toggleSetButton(1)' v-on:keyup='queryRecent(1)' type="text" placeholder="dossier name" maxlength="30">
                                    <button class="col button_secondary" id="buttonAddDossier" style="margin-left:1%" v-on:click='addDossier' disabled>add</button>   
                            </div>
        
                            <div class="row" style="margin-top:1%">
                                    <button class="col-2" id="footer_buttonAssignDossier" v-on:click='setDossier'> <i class="fas fa-caret-down"></i></button>
                                    <button class=" button_cancel" v-on:click='closeDossierTags(1)'>cancel</button>
                            </div>        
                        </div>   
                </div>                         
            </div>

            <div id="footer_tagsModal">
                <div class="container">
                        <div class="container">

                            <div class="row">
                                <div class="container" id="footer_tagsResultsContainer"></div>
                            </div>

                            <div class="row" style="margin-top:1%">
                                <div class="col-12 top2"  id="footer_addedTags">
                                        
                                </div>
                            </div>
        
                            <div class="row" style="margin-top:1%">
                                    <input class="col-9" id="footer_inputTagName"  style="height:40px;" type="text" v-on:input='toggleSetButton(2)' v-on:keyup='queryRecent(2)'  placeholder="tag" maxlength="30">
                                    
                                     <button class="col button_secondary" id="buttonAddTags" style="margin-left:1%" v-on:click='addTag' disabled>add</button>   
                            </div>
        
                            <div class="row" style="margin-top:1%">
                                    <button class="col-2" id="footer_buttonAssignTags" v-on:click='setTags'> <i class="fas fa-caret-down"></i></button>                                    
                                    <button class="button_cancel" v-on:click='closeDossierTags(2)'>cancel</button>
                            </div>
        
        
                        </div>   
                </div> 
                        

            </div>
        
        </div>
    </div>
    


    
</template>

<script>





export default {
    name:'Footer',

    data:function(){return {
      menuNumber:(()=>{
              return (this.menu);
      })() ,
      attachment:[],
      attachments:(()=>{
              if(this.attachmentsF!=''){                      
                      return this.attachmentsF;                      
              }
              else{
                      return [];
              }
      })(),

      totalSize:0,
      dossier:(()=>{
              if(this.dossierF!=''){
                      return this.dossierF;
              }
              else{
                      return '';
              }
      })(),        
      tags:(()=>{
              if(this.tagsF!=''){
                return this.tagsF;
              }else{
                return [];
              }
      })(),
      temptags:[],            
    }
  
  },

  watch:{
         attachmentsF:function(newVal){
               this.attachments=newVal;  
               
               
         }, 
         dossierF:function(newVal){
               this.dossier=newVal;   
               
         },
         tagsF:function(newVal){
                 this.tags=newVal;
                 
                 
         },
        
  },      

  methods:{
       
       openAttachment:function(){
        document.getElementById('attachment').click();        
       }   ,

      //navigation between the different screens of the app
      //n=1=>index.vue, n=2=>new.vue,n=3=>dossier.vue,n=4=>calendar.vue
      navigate:function(n,title){
         
         //will be used by the 'go back' buttons
         localStorage.setItem('previousSection',n);
         localStorage.setItem('previousSectionTitle',title);
        
         //set the selected section in local storage
         localStorage.setItem('section',n);
         localStorage.setItem('sectionTitle',title);

        //get the with session_id
        let session_id=localStorage.getItem('session_id');

        //send GET request with session_id
        let request= new XMLHttpRequest();    
        
        request.open('GET','https://scripta-app.herokuapp.com/api/navigate');        
       
        //set session_id header        
        if(session_id){
                request.setRequestHeader('session_id', session_id);               
        }

        //send request
        request.send();  
        let self=this;
        request.onload=function(){
            if(this.status==200){
                    self.$emit('navigation',n,title);
                    self.menuNumber=n;
            } 
            else{
                    console.log(this.responseText);                    
                    //redirect to login page
                    if(this.responseText=='unauthorized'){
                      self.$emit('navigation',0,'','login');      
                      self.menuNumber=0;      
                    }
            }  
        }  
 
      },
      
      //displays the actions menu
      openActions:function(){
        
        let actionsContainer= document.getElementById('actionsContainer');
        let openActions=document.getElementById('footer_button_openActions');
        let footerMenu=document.getElementById('footerMenuContainer');

         //hide submit button
         document.getElementById('new_buttonSubmit').style.display='none';
         
         //hide attachments/dossier/tags buttons         
         let assignedData=document.getElementsByClassName('new_assignedData');

         if(assignedData){
             assignedData.forEach(d=>{
             d.style.display='none';
            })
         }       
         

         

        //display actions menu
        openActions.style.display='none'; //hide open-actions button
        footerMenu.style.display='none'; //hide footer button

        actionsContainer.style.display='flex';
        setTimeout(() => {
            actionsContainer.style.opacity='1';
            actionsContainer.style.transform='translateY(-10px)';

        }, 200);  
          
      },

    //   hides  the actions menu
      closeActions:function(){
        console.log(this.tags);
        let actionsContainer= document.getElementById('actionsContainer');
        let openActions=document.getElementById('footer_button_openActions');
        let footerMenu=document.getElementById('footerMenuContainer');

        //show submit button        
         document.getElementById('new_buttonSubmit').style.display='block';
         

         //show assigned data buttons
         let assignedData=document.getElementsByClassName('new_assignedData');
         if(assignedData){
             assignedData.forEach(d=>{
             d.style.display='block';
            })
         }    
         
        //hide actions menu
        actionsContainer.style.opacity='0';
        actionsContainer.style.transform='translateY(0px)';

        
        //update attachmets array (this.attachments)
        
        if(this.attachment!=''){
                           
          //check for duplicates/add values to arrays    
          let isIncluded=false;
          if(this.attachments!=''){
                  this.attachments.forEach(a=>{
                  if(this.attachment[0].attachment_name==a.attachment_name){
                          isIncluded=true;                                             
                  }
                
                });
                
                if(isIncluded==false){
                  this.attachments.push(this.attachment[0]);
                  this.attachment='';
                }

          }else{
                  this.attachments.push(this.attachment[0]);
                  this.attachment='';
          }      
          
        }
        

        //remove highlight from action options
        let buttonActions=document.getElementsByClassName('footer_button_actions');
            buttonActions.forEach(b=>{
                    b.style.backgroundColor='rgba(0,0,0,0)';
            })    
        let trash=document.getElementsByClassName('footer_buttonClear');
            trash.forEach(t=>{
                    t.style.display='none';
            })

        
        
        this.$emit('actionsData',this.attachments,this.dossier,this.tags);
        
        setTimeout(() => {
            actionsContainer.style.display='none';
            openActions.style.display='flex'; //display open-actions button
            footerMenu.style.display='flex'; //display footer menu
        }, 200);  


        this.temptags='';

      },

      attachFile:function(){  
              
              
        let allowedtypes=['mp4','jpeg','png','pdf'];
        let allowed=false;

        let attachment=document.getElementById('attachment').files[0];
            let attachment_name=attachment.name;                    
        //determine the file type
        let type=attachment.type;
            type=type.split('/');
            type=type[1];

        //determine if allowedtypes array included the file type        
        allowedtypes.forEach(a=>{
             if(a==type){
                allowed=true;
             }                
        })
            
        //determine the file size
        let size=attachment.size;
                        
        //validate for type & size
        
        try{
        
            if(allowed==false){
                    
                    throw 'File type not allowed. Try uploading an image, a pdf file or a video';
                    
            }  

            if(size>=10000000){
                    
                    throw 'Uploaded file must not exceed 10MB';
            }

            
            this.totalSize=this.totalSize+size;     


            
           if(this.totalSize>30000000){
                   throw 'Total attachment size must not exceed 30 MB';
           }
               
            


                      
           let reader = new FileReader();
           reader.readAsDataURL(attachment);
           
        
            document.getElementById('footer_buttonAttachment').style.backgroundColor='rgba(0,139,139,0.1)';
            document.getElementById('footer_buttonClearAttachment').style.display='block';    


           //add attachment to the attachments array
           reader.onload=()=>{
                  this.attachment=[{"attachment_name":attachment_name,"attachment_data":reader.result}];
                
           }

        }
        catch(e){
                alert (e);

        }

      },

      //removes the selected attachment, dossier or tag, prior to closing the actions menu
      // (actions menu = the menu for attaching files, assigning dossier or adding tags)
      detachFile:function(n){
       
        let button;      
        let trash;
        // let input; 
        if(n==1){
                button=document.getElementById('footer_buttonAttachment');
                trash=document.getElementById('footer_buttonClearAttachment');                
                this.attachment='';
        }
        else if (n==2){
                button=document.getElementById('footer_buttonDossier');
                trash=document.getElementById('footer_buttonClearDossier');                
                this.dossier='';
        }
        else{
                button=document.getElementById('footer_buttonTags');
                trash=document.getElementById('footer_buttonClearTags');                
                this.tags='';
                
        
        }

        button.style.backgroundColor='rgba(0,0,0,0)';
        trash.style.display='none';
        
                
      },

      openDossierTags:function(n){

        let modal;
        let path;
        let container;
        // let input;
        let inputValue='';

        if(n==1)
        {
                modal= document.getElementById('footer_dossierModal');
                // input=document.getElementById('footer_inputDossierName');    

                //path for requesting user dossiers
                path='https://scripta-app.herokuapp.com/api/get-user-dossiers';
                container=document.getElementById('footer_dossierResultsContainer');
                
                if(this.dossier==''){
                        document.getElementById('footer_addedDossier').innerHTML='';
                }
                
        }    
        else if(n==2)
        {
                modal= document.getElementById('footer_tagsModal');
                // input=document.getElementById('footer_inputTagName');
        
                //path for requesting user tags
                path='https://scripta-app.herokuapp.com/api/get-user-tags';
                container=document.getElementById('footer_tagsResultsContainer');

                
                if(this.tags==''){
                   this.temptags=[];     
                   document.getElementById('footer_addedTags').innerHTML='';     
                }
                else{
                   this.temptags=this.tags;   

                    let string='';
                   this.temptags.forEach(t=>{
                        string=string+ ` &nbsp; &nbsp;`+ `<i class="fas fa-tag">  ${t}</i>`;

                   })
                   document.getElementById('footer_addedTags').innerHTML=string;

                }

                
                // else{
                   
                  
                   
                   
                // }
                
                
                
        }        
        modal.style.display='flex';
        
        setTimeout(() => {
        modal.style.opacity='1';
        modal.style.transform='translateY(0px)';
        }, 100);

        this.displayRecent(n,path,container,inputValue);
         
      },

      
      //displays recent dossiers or tags
      displayRecent:function(n,path,container,inputValue){
        
        let session_id=localStorage.getItem('session_id');
        let user_id=localStorage.getItem('user_id');  
            inputValue=encodeURI(inputValue);        

        let request= new XMLHttpRequest();            
        request.open('GET',path);        
        //set session_id header        
        
        request.setRequestHeader('session_id', session_id); 
        request.setRequestHeader('user_id', user_id);
        request.setRequestHeader('input_value',inputValue);                   

        //send request
        request.send();  

        if(n==1){ //return dossiers

                request.onload=function(){
                        if(this.status==200){
                                if(this.responseText=='' || this.responseText=='[]'){ //no results found
                                
                                //remove previously generated content
                                while (container.hasChildNodes()) {
                                container.removeChild(container.lastChild);
                                }         
                                let divHeader=document.createElement('div');
                                divHeader.classList.add('row');
                                divHeader.classList.add('systemMessage');
                                
                                let text=document.createTextNode('No recent dossiers found');

                                divHeader.appendChild(text);
                                container.appendChild(divHeader);
                                }       
                                    
                                else{      
                                
                                //remove previously generated content         
                                while (container.hasChildNodes()) {
                                container.removeChild(container.lastChild);
                                }         

                                let dossier=JSON.parse(this.responseText);

                                let divHeader=document.createElement('div');
                                divHeader.classList.add('row');
                                let text=document.createTextNode('Recent dossiers');

                                divHeader.appendChild(text);
                                container.appendChild(divHeader);
                                
                                        
                                dossier.forEach((d)=>{
                                        
                                        let div=document.createElement('div');
                                        div.classList.add('row');                                
                                        div.classList.add('footer_tagContainer');  
                                        let button=document.createElement('button');
                                        button.classList.add('col-12');
                                        
                                        button.addEventListener('click',()=>{            
                                                                        
                                        document.getElementById('footer_addedDossier').innerHTML=`<i class="fas fa-folder"> ${span.innerHTML}</i>`;
                                        document.getElementById('footer_buttonAssignDossier').style.display='block'                                                                                       
                                        }); 
                                        
                                        let i=document.createElement('i');
                                        i.classList.add('fas');
                                        i.classList.add('fa-folder');                            
                                        let span=document.createElement('span');
                                        span.classList.add('footer_dossierLabel'); 

                                        let text=document.createTextNode(' '+d.dossier_name);
                                        span.appendChild(text);
                                        i.appendChild(span);
                                        button.appendChild(i);
                                        div.appendChild(button);
                                        container.appendChild(div);
                                })                        
                                }

                        } 
                        else{
                                alert(this.responseText);                
                        }  
                } 

        }

        else{ //returns tags
                let self=this;        
                request.onload=function(){
                        if(this.status==200){
                                if(this.responseText=='' || this.responseText=='[]'){ //no results found
                                
                                  //remove previously generated content
                                  while (container.hasChildNodes()) {
                                  container.removeChild(container.lastChild);
                                  }         
                                  let divHeader=document.createElement('div');
                                  divHeader.classList.add('row');
                                  divHeader.classList.add('systemMessage');
                                  let text=document.createTextNode('No recent tags found');
                                
                                  divHeader.appendChild(text);
                                  container.appendChild(divHeader);
                                }       
                                
                                else{      
                                        
                                  //remove previously generated content         
                                  while (container.hasChildNodes()) {
                                  container.removeChild(container.lastChild);
                                  }         


                                       
                                  let tags=JSON.parse(this.responseText);

                                  let divHeader=document.createElement('div');
                                  divHeader.classList.add('row');
                                  let text=document.createTextNode('Recent tags');

                                  divHeader.appendChild(text);
                                  container.appendChild(divHeader);
                                
                                        
                                  tags.forEach((t)=>{
                                      
                                        
                                      let div=document.createElement('div');
                                      div.classList.add('row');                                
                                      div.classList.add('footer_tagContainer');  
                                      let button=document.createElement('button');
                                      button.classList.add('col-12');


                                      let i=document.createElement('i');
                                      i.classList.add('fas');
                                      i.classList.add('fa-tag');                            
                                      let span=document.createElement('span');
                                      span.classList.add('footer_tagLabel'); 
                                      
                                      let text=document.createTextNode(' '+t.tag_name);
                                      span.appendChild(text);
                                      i.appendChild(span);
                                      button.appendChild(i);
                                      div.appendChild(button);
                                      container.appendChild(div);
                                      
                                      button.addEventListener('click',()=>{            

                                        let input=document.getElementById('footer_inputTagName');
                                        let addedTags=document.getElementById('footer_addedTags');
                                        let string=addedTags.innerHTML;
                                        let button=document.getElementById('buttonAddTags');
                                        
                                        let isIncluded=false;

                                        if(string==''){
                                          
                                          string=string+ `<i class="fas fa-tag"> ${span.innerText.trim()}</i>`;
                                          addedTags.innerHTML=string;      
                                          self.temptags.push(span.innerText.trim());
                                          
                                        }
                                        else{                                                
                                           //check if tag is already included
                                           
                                           self.temptags.forEach(tt=>{
                                                if(tt==span.innerText.trim()){
                                                  isIncluded=true;
                                                }
                                           });
                                                                        
                                           if(isIncluded==false){
                                                   
                                              string=string+` &nbsp; &nbsp;`+ `<i class="fas fa-tag"> ${span.innerText.trim()}</i>`;       
                                              addedTags.innerHTML=string;
                                              self.temptags.push(span.innerText.trim());
                                           }
                                                
                                        }
                                                
                                        //disable add button   
                                        button.disabled=true;

                                        //clear the input field
                                        input.value='';
                                      
                                      });                                                               
                                    })                        
                                }

                        } 
                        else{
                                alert(this.responseText);                
                        }  
                } 


        }
      },



      queryRecent:function(n){
         
         let path;
         let container;
         let input;
         let inputValue;
         
        if(n==1)
        {          
          input=document.getElementById('footer_inputDossierName');    

          //path for requesting user dossiers
           path='https://scripta-app.herokuapp.com/api/get-user-dossiers';
           container=document.getElementById('footer_dossierResultsContainer');                                
        }    
        else
        {
               
            input=document.getElementById('footer_inputTagName');
        
            //path for requesting user tags
            path='https://scripta-app.herokuapp.com/api/get-user-tags';
            container=document.getElementById('footer_tagsResultsContainer');
            
        }     
        
        inputValue=input.value;
        

        this.displayRecent(n,path,container,inputValue);              
      },

      //enables/disables the button that assigns a dossier  
      toggleSetButton:function(n){
              let input;              
              let button;
              if(n==1){
                 input=document.getElementById('footer_inputDossierName');                                    
                 button=document.getElementById('buttonAddDossier');
              }
              else{
                 input=document.getElementById('footer_inputTagName');                 
                 button=document.getElementById('buttonAddTags');
              }
              

              if(input.value.trim()==''){                                      
                      button.disabled=true;                     
              }
              else{
                      button.disabled=false;
              }
              
      },

      //sets the typed dossier name as the dossier to be assigned for the current note
      //the dossier is added to this.dossier when the user clicks the down arrow
      addDossier:function(){
              
          let input=document.getElementById('footer_inputDossierName');
          document.getElementById('footer_addedDossier').innerHTML=`<i class="fas fa-folder"> ${input.value}</i>`;

          //disable the add button
          document.getElementById('buttonAddDossier').disabled=true
          //empty the input field
          input.value='';
          this.queryRecent(1);

          //remove highlight from recent dossiers
        //   let recentDossiers=document.getElementsByClassName('footer_dossierLabel');
        //   recentDossiers.forEach(r=>{
        //           r.style.color='rgba(0,0,0,0.7)';
        //   });

          
      },

      addTag:function(){
              let input=document.getElementById('footer_inputTagName');
              let addedTags=document.getElementById('footer_addedTags');
              let string=addedTags.innerHTML;
              let button=document.getElementById('buttonAddTags');
              
              let isIncluded=false;
              

              if(string==''){
                  string=string+ `<i class="fas fa-tag"> ${input.value.trim()}</i>`;
                  addedTags.innerHTML=string;      

                  this.temptags.push(input.value.trim());
              }

              else{
                  
                  //check if tag is already included
                  this.temptags.forEach(t=>{
                          if(t==input.value.trim()){
                             isIncluded=true
                          }
                  })
                  
                  //if not included, add the tag
                  if(isIncluded==false){
                        string=string+` &nbsp; &nbsp;`+ `<i class="fas fa-tag"> ${input.value.trim()}</i>`;       
                        addedTags.innerHTML=string;
                        this.temptags.push(input.value.trim());

                        // // remove highlight of the tag suggestions
                        // let tagSuggestions=document.getElementsByClassName('footer_tagLabel');
                        // tagSuggestions.forEach(t => {
                        //         t.style.color='rgba(0,0,0,0.7)';
                        // });
                  }
                   
              }
                 
              //disable add button   
              button.disabled=true;

              //clear the input field
              input.value='';

              this.queryRecent(2);
              
      },

      //assigns the selected dossier name to the current note
      setDossier:function(){              
              //upate this.dossier
              let dossier=document.getElementById('footer_addedDossier').innerText.trim();

              if(dossier!=''){
                this.dossier=dossier;      
              }
              
              
              setTimeout(() => {
                this.closeDossierTags(1);

                //show dustbin
                if(this.dossier!=''){
                   document.getElementById('footer_buttonClearDossier').style.display='block';
                   document.getElementById('footer_buttonDossier').style.backgroundColor='rgba(0,139,139,0.1)';        
                }
              }, 100);

              
              

      },

      setTags:function(){
              //upate this.tags              
              let temptags=this.temptags;  
              if(temptags!=''){
                      
                      this.tags=this.temptags;
              }

              setTimeout(() => {
                 this.closeDossierTags(2);

                //show dustbin
                if(this.tags!=''){
                   document.getElementById('footer_buttonClearTags').style.display='block';
                   document.getElementById('footer_buttonTags').style.backgroundColor='rgba(0,139,139,0.1)';     
                }
                
              }, 100);  
              
      },



      closeDossierTags:function(n){
        let modal;

        this.temptags=[];
        
        if(n==1)
        {
                modal= document.getElementById('footer_dossierModal');    
                document.getElementById('footer_inputDossierName').value='';                                            
                

        }    
        else if(n==2)
        {
                modal= document.getElementById('footer_tagsModal');
                document.getElementById('footer_inputTagName').value='';                                
        }
        
        
        
        modal.style.opacity='0';        
        modal.style.transform='translateY(20px)';
        
        setTimeout(() => {                
        modal.style.display='none';            
        }, 100);

      }
  },
  props:['menu','attachmentsF','dossierF','tagsF'],
    

}
</script>


<style>

.footer {
            
        display: flex;
        flex-direction: column;
        justify-content: center;            
}

.footer .row {
        justify-content: left;
}

.footer_button_main {
        margin-left: 2%;
        height: 70px;
        width: 70px;
        background-color: white;
            
}
   
.footer_button_main img {
        height:  40px;
        color:darkcyan;
              
}




#actionsContainer { 
        transform: translateY(0px);
        transition: opacity 0.2s, transform 0.2s;
        display: none;
        opacity: 0.1;
        
}    

#footer_button_whiteSpace {visibility: hidden;}

#footer_button_openActions,#footer_button_whiteSpace {
        height: 40px;width: 40px;
        border: none;
        margin-bottom: 1%;
        background-color: rgba(0,0,0,0);

        
}
    

#footer_button_openActions i, #footer_button_closeActions i, #footer_button_whiteSpace i {
        color:rgba(0,0,0,0.7);
        font-size: 25px;
        
}

#footer_button_closeActions {
        text-align: left;
        background-color: rgba(0,0,0,0);
}
     
                            
.footer_button_actions {
        background-color: rgba(0,0,0,0);
        margin-left: 5%;
        border-radius: 20px;
}

.footer_buttonClear{
 margin-left: 1%; 
}

#footer_buttonClearAttachment,#footer_buttonClearDossier,#footer_buttonClearTags{
 display: none;    
 


}

.footer_button_actions img { 
        height: 30px;
        color:black;
        
}


#footer_tagsModal,#footer_dossierModal {
    position: absolute;    
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    display: none;
    opacity: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateY(20px);
    transition: opacity 0.2s,transform 0.2s;

}

/* #footer_tagsResultsContainer,#footer_dossierResultsContainer{ */
    /* border: solid red thin; */
    /* justify-content: center; */
/* } */

/* #footer_tagsResultsContainer .row,#footer_dossierResultsContainer .row { */
        /* justify-content: left; */
/* } */


.footer_tagContainer,.footer_dossierContainer{
  background-color: rgb(245, 245, 245,0.6);  
  margin-top: 1%;   
  
}

.footer_tagContainer button,.footer_dossierContainer button{
        text-align: left;
}

.footer_tagContainer i,.footer_dossierContainer i{
    
    color: rgb(0, 139, 139,0.7);  
}

.footer_tagLabel,.footer_dossierLabel {color: rgba(0,0,0,0.7);}

#footer_addedTags,#footer_addedDossier {color: darkcyan;}

#footer_imgTest {height: 40px;}

</style>