


//GET
//send GET request with session_id

let session_id=localStorage.getItem('session_id');
let user_id=localStorage.getItem('user_id');

let request= new XMLHttpRequest();            
request.open('GET','url');        

request.setRequestHeader('session_id', session_id);               
request.setRequestHeader('user_id', user_id);               

//send request
request.send();  

request.onload=function(){
    if(this.status==200){
           
    } 
    else{
            
    }  
}  


//POST

let session_id=localStorage.getItem('session_id');
let user_id=localStorage.getItem('user_id');

let request=new XMLHttpRequest();
                
request.open('POST','url');

request.setRequestHeader('session_id', session_id);

let data=JSON.stringify({key:'value'});
request.send(data);                  

request.onload = function (){        
                                               
    let response=JSON.parse(this.responseText);

        if(this.status==200){ //request is valid
            
        
        }
        else{
        
        }                    
};




