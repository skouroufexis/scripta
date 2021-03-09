
// var http = require('http');


var mysql=require('mysql');


const bcrypt = require('bcrypt');



let connection=mysql.createConnection(
  {
    //check MAMP to see if these fields are provided for establishing connection
    // host:'localhost',
    // port:'8080',
    // user:'stavros',
    // database:'diary',
    // password:'uei',
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',

    host:'eyw6324oty5fsovx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    port:'3306',
    user:'il35nt2o2zwx9nng',
    database:'itlw9u5bloej7hoh',
    password:'c0anxpcjz3csgtwu',
    
    

  }
);

connection.connect((error)=>{
  
  if(error){
    
    console.log(error);
  }
  else{
    console.log('connected');
  }
})

//setting max upload size to 30 MB
// let queryUpload='set global max_allowed_packet=30000000';
// connection.query(queryUpload,function(error,results){
//   if(error){
//     console.log(error);
//   }  
// })

const express = require('express');
const port = process.env.PORT || 8080;
const app=express();
app.use(express.static(__dirname+'/dist/'));
app.get(/.*/,function(req,res){
  res.sendFile(__dirname+'/dist/index.html');
});
app.listen(port);
console.log("SSSERRVERRRR");

var cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


const serveStatic = require("serve-static");
const path = require('path');

// app.use('/', serveStatic(path.join(__dirname, '/dist')));




app.post('/api/login', function(req,res){

  let email=req.body.email;
  let password=req.body.password;
  let query= 'SELECT * FROM users WHERE user_email=?';
    connection.query(query,[email],function(error,results){
      if(error){
        console.log('Query error:'+error);
        res.writeHead(500);        
        res.end('Query error:'+error);
      }
      else{
        if(results!=''){
          console.log('account found');
          let user_id=results[0].user_id;
          let hash=results[0].user_password;
          
          //check password
          bcrypt.compare(password, hash, function(error, result) {
            if(error){
              console.log('Password validation error:'+error);
              res.writeHead(500);                    
              res.end('Password validation error:'+error);
            }
            if(result==true){//hashed password matches the one stored in the database

              //SESSION ID  
              //create session id
              const { v4: uuidv4 } = require('uuid');
              let session_id=uuidv4(); 

              //write session_id to database
              let query='INSERT INTO sessions (session_id,user_fk) VALUES (?,?)';
              connection.query(query,[session_id,results[0].user_id], function(error,results,fields){

                if(error){
                  console.log('Query error: '+error);
                  res.writeHead(500);                        
                  res.end('Query error:'+error);
                }
                else{
                  //send headers to client
                  res.writeHead(200);
                  let response={message:'Login successfull',session_id:session_id,user_id:user_id};
                  response=JSON.stringify(response);                        
                  console.log('Login successfull');
                  res.end(response);  
                }
              })

            }
            else{

              console.log('Invalid credentials');
              res.writeHead(400);      
              let response={message:'Invalid credentials'};  
                  response=JSON.stringify(response);      
              res.end(response);
              
            }
          });
          
        }
        else{
          console.log('invalid credentials');  
          res.writeHead(400);     
          let response={message:'Invalid credentials'};  
              response=JSON.stringify(response);      
          res.end(response);         
          
        }
          
      }
    });  

});

app.post('/api/addNewUser',function(req,res){
  let user_name=req.body.user_name;
  let user_email=req.body.user_email;
  let temp_password=req.body.user_password;

  let query= 'INSERT INTO users (user_name, user_email, user_password) VALUES (?,?,?)';
  let query2= 'SELECT * FROM users WHERE user_email=?';

  //control that email does not exist
  connection.query(query2,[user_email],function(error,results){
    if(error){
      console.log('Query error: '+error);
      res.writeHead(500);                  
      res.end('Query error:'+error);
    }
    else{    
        if(results!=''){
          res.writeHead(400);
          console.log('email already in use');
          res.end('Email already in use'); 
        }   
        else{
          console.log('email can be used');
          //hash password && enter data
            bcrypt.hash(temp_password, 10, function(err, hashedPassword) {
              if(err){
                console.log('Password hashing error: '+err);
                res.writeHead(500);
                
                res.end('Password hashing error: '+err);
              }
              else{
                connection.query(query,[user_name,user_email,hashedPassword],function(error,results,fields){
                  if(error){
                    console.log('Query error: '+error);
                    res.writeHead(500);                                
                    res.end('Query error: '+error);
                  }
                  else{
                    res.writeHead(200);
                    res.end('Account successfully created');    
                  }
                });   
              }         
          });
        }               
    }    
  });

});

app.post('/api/validate_password',function(req,res){
  if(authenticate()){
    let query= 'SELECT * FROM users WHERE user_id=?';
    let oldPassword=req.body.oldPassword;
    let user_id=req.body.user_id;

    connection.query(query,[user_id],function(error,results){
      if(error){
        console.log('Query error:'+error);
        res.writeHead(500);
        res.end('Query error:'+error);
      }
      else{
        if(results!=''){
          console.log('account found');
          
          let hash=results[0].user_password;
          
          //check password
          bcrypt.compare(oldPassword, hash, function(error, result) {                  
            if(error){
              console.log('Password validation error: '+error);
              res.writeHead(500);
              
              res.end('Password validation error: '+error);
            }
            else{
              
              if(result==true){//hashed password matches the one stored in the database                  
                res.writeHead(200);
                res.end('password validated');  
              }
              else{
                res.writeHead(400); 
                console.log('password validation failed');                                                  
                res.end('password validation failed');                    
              }
            }
            
          });
          
        }                            
      }
    });  

  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.post('/api/addNewNote',function(req,res){
  if(authenticate())
  {let query;  

  let user_id=req.headers.user_id;              
  let title=req.body.title;
  let body=req.body.body;   

  //flags will turn true when all the processes are completed successfully
  //then a response will be sent to the client  

  let notesOK=false;
  let dossierOK=false;
  let tagsOK=false;
  let attachmentsOK=false;  

                            
  //array of months to be used to convert the received month in numerical value

  let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];   
   //reformat date & time
   let formattedDate=data.day;
   formattedDate=formattedDate.split(' ');

    //give numeric value to month
    months.forEach((m,index)=>{
      if(m==formattedDate[1]){
        formattedDate[1]=index+1; //add 1 because index of months starts at 0

        if(formattedDate[1]<10){
          formattedDate[1]='0'+formattedDate[1]; //add 0 before months 1-9 (ex Jan= 01)
        }
      }
    });
    //add 0 before days 1-9
    if(formattedDate[0]<10){
      formattedDate[0]='0'+formattedDate[0];
    }
    //format date according to mysql format
    formattedDate=formattedDate[2]+':'+formattedDate[1]+':'+formattedDate[0];

    //format time according to mysql format
    let formattedTime=data.time;
    formattedTime=formattedTime+':00';       

    //add record to note with or without dossier values

    addNote();              
    addDossier();                        
    addTags();
    addAttachments();  

    function addNote(){                
      query='INSERT INTO notes (title,body,date,time,user_fk) VALUES (?,?,?,?,?)';
      connection.query(query, [title,body,formattedDate,formattedTime,user_id],function(error,results){
        if(error){
          res.writeHead(500);
          res.end('Query error '+error);
        }
        else{
          console.log('added note to notes');
        }
      });
      notesOK=true;                                  
  }

  function addDossier(){
    let noteDossier;
    if(req.body.dossier==''){
      noteDossier='Untitled';
    }
    else{
      noteDossier=req.body.dossier;
    }
    
      retrieveDossier_fk(noteDossier,function(dossier_fk){

        retrieveNote_fk(function(note_fk){
          
          //add dossier to the last inserted record  
         query='UPDATE notes SET dossier_fk =? WHERE note_id=?';
         connection.query(query,[dossier_fk,note_fk],function(error,results){
           if(error){
             console.log(error);
             res.writeHead(500);
             res.end(error);
           }
           else{
             console.log('added dossier_fk to notes table');
           }
         });

        })
         
      });
      dossierOK=true;

    }

    function addTags(){

      //add tags if they exist
      if(req.body.tags!=''){                
        req.body.tags.forEach(t=>{
          query='SELECT userTag_id FROM userTags WHERE user_fk=? AND tag_name=?';
          connection.query(query,[user_id,t],function(error,results){
            if(error){
              console.log('Error: '+error);
              res.writeHead(500);
              res.end('Error: '+error);
            }
            else{
              if(results==''){
                              
                retrieveNote_fk(function(note_fk){                            
                    //add new tag
                    addNewUserTags(t);
                    retrieveTag_fk(function(tag_fk){
                      addNotesTags(note_fk,tag_fk); 
                    })                            
                });                       
              }
              else{
                retrieveNote_fk(function(note_fk){                            
                  //add the existing tag to the notesTags                        
                  addNotesTags(note_fk,results[0].userTag_id);
                })                          
              }                      
            }
          });
         });    
         tagsOK=true;   
       }
       else{
         tagsOK=true;
       }                
     }

     function addAttachments(){
      //add attachments if present
      if(req.body.attachments!=''){                
        retrieveNote_fk(function(note_fk){
          req.body.attachments.forEach(a=>{
            query='INSERT INTO attachments (attachment_name,note_fk) VALUES (?,?)';
            connection.query(query,[a.attachment_data,note_fk],function(error,results){
                if(error){
                  console.log(error);
                  res.writeHead(500);
                  res.end(error);
                }
                else{
                  console.log('added attachment to attachments');
                }
              })
            
            })                                        
          });

        attachmentsOK=true;

      }
      else{
        attachmentsOK=true;
      }
    }
    function retrieveDossier_fk(dossier,callback){
      //see if dossier already exists
      query='SELECT userDossier_id FROM userDossier WHERE user_fk=? AND dossier_name=?';
      connection.query(query,[user_id,dossier],function(error,results){
        if(error){
          console.log('Query error '+error);
          res.writeHead(500);
          res.end('Query error '+error);
        }
        else{
          if(results==''){
            //dossier does not exist, must be added
            query='INSERT INTO userDossier (user_fk,dossier_name) VALUES(?,?)';
            connection.query(query,[user_id,dossier],function(error,results){
              if(error){
                console.log('Query error '+error);
                res.writeHead(500);
                res.end('Query error '+error);
              }
              else{
                console.log('new dossier added to userDossier');

                //retrieve ID of newly added dossier
                query='SELECT userDossier_id FROM userDossier WHERE user_fk=? AND dossier_name=?';
                connection.query(query,[user_id,dossier],function(error,results){
                    if(error){
                      console.log('Query error '+error);
                      res.writeHead(500);
                      res.end('Query error '+error);
                    }
                    else{
                      console.log('dossier id retrieved');
                      callback(results[0].userDossier_id);
                    }
                });
              }
            })
          }
          else{
            console.log('dossier id retrieved');
            callback(results[0].userDossier_id);
          }
          
        }
      })
    }
    function retrieveNote_fk(callback){
      //retrieve and return the id of the newly added note
      query='SELECT note_id FROM notes WHERE user_fk=? ORDER BY note_id DESC LIMIT 1';
      connection.query(query,[user_id],function(error,results){
        if(error){
          console.log('Query error '+error);
          res.writeHead(500);
          res.end('Query error '+error);
        }
        else{
          console.log('retrieved note_id');
          callback(results[0].note_id);
        }
      })
    }

    function addNewUserTags(tag){
      query='INSERT INTO userTags (user_fk,tag_name) VALUES (?,?)';
      connection.query(query,[user_id,tag],function(error,results){
        if(error){
          console.log(error);
          res.writeHead(500);
          res.end(error);
        }
        else{
          console.log('added new tag to userTags');                   
        }
      });
    }

    function retrieveTag_fk(callback){

       //return the id of the newly added tag
       query='SELECT userTag_id FROM userTags WHERE user_fk=? ORDER BY userTag_id DESC LIMIT 1';
       connection.query(query,[user_id],function(error,results){
         if(error){
           console.log(error);
           res.writeHead(500);
           res.end(error);
         }
         else{
           console.log('retrieved id of latest tag added to userTags');  
           callback(results[0].userTag_id);                                              
         }
       })                 
    }

    function addNotesTags(note_fk,tag_fk){
      query='INSERT INTO notesTags (note_fk,tag_fk) VALUES (?,?)';
      connection.query(query,[note_fk,tag_fk],function(error,results){
        if(error){
          console.log(error);
          res.writeHead(500);
          res.end(error);
        }
        else{
          console.log('added new tag to notesTags'+ tag_fk);
        }
      })
      tagsOK=true;
    }

    if(notesOK==true && dossierOK==true && tagsOK==true && attachmentsOK==true){
      res.writeHead(200);
      res.end('New note successfully added');
    }
    else{
      res.end('There was a problem in adding the new note');
    }}
    else{
      console.log('authentication failed');
      res.writeHead(400);          
      res.end('unauthorized');
    }
});


app.post('/api/attachment',function(req,res){
  if(authenticate()){
    let query='INSERT INTO attachments (attachment_name,note_fk) VALUES(?,?)';
    req.body.forEach(d=>{
      let attachment_name=d.attachment_name;
      let note_fk=d.note_fk;
      addAttachments(query,attachment_name,note_fk);
    });

    res.writeHead(200);
    res.end('New attachments successfully added');


    function addAttachments(query,attachment_name,note_fk){
                
      connection.query(query,[attachment_name,note_fk],function(error,result){
        if(error){
          console.log(error);
          res.writeHead(500);
          res.end(error);
        }
        
      });
    }
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.post('/api/notesTags',function(req,res){
  if(authenticate()){
    let user_fk=req.body.user_fk;
    let tag_name=req.body.tag_name;
    let note_fk=req.body.note_fk;
    let query='SELECT * FROM userTags WHERE user_fk=? AND tag_name=?';
    connection.query(query,[user_fk,tag_name],function(error,results){
      if(error){
        console.log(error);
        res.writeHead(500);
        res.end(error);
      }
      else{
        
        
        //tag already exists in userTags
        if(results!=''){                       
           query='INSERT INTO notesTags (note_fk,tag_fk) VALUES (?,?)';
           console.log(query);
           
          connection.query(query,[note_fk, results[0].userTag_id],function(error,results){
            if(error){
              console.log(error);
              res.writeHead(500);
              res.end(error);
            }
            else{
              
              res.writeHead(200);
              res.end('New tag successfully added');
            }
          })
        }

        else{
          query='INSERT INTO userTags (user_fk,tag_name) VALUES(?,?)';
          connection.query(query,[user_fk,tag_name],function(error,results){
            if(error){
              console.log(error);
              res.writeHead(500);
              res.end(error);
            }
            else{

              query='SELECT * FROM userTags WHERE user_fk=? AND tag_name=?';
              connection.query(query,[user_fk,tag_name],function(error,results){
                if(error){
                  console.log(error);
                  res.writeHead(500);
                  res.end(error);
                }
                else{
                  query='INSERT INTO notesTags (note_fk,tag_fk) VALUES (?,?)';
                  connection.query(query,[note_fk, results[0].userTag_id],function(error,results){
                    if(error){
                      console.log(error);
                      res.writeHead(500);
                      res.end(error);
                    }
                    else{
                      res.writeHead(200);
                      res.end('New tag successfully added');
                    }
                  })
                }
              })

            }
          })
        }
      }
  })    
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});



app.put('/api/update_password',function(req,res){
  
  if(authenticate()){
    
    let user_id=req.body.user_id;
    let user_password=req.body.user_password;         
    let query='UPDATE users SET user_password=? WHERE user_id=?';    

     //hash password && enter data
     bcrypt.hash(user_password, 10, function(err, hashedPassword) {
      if(err){
        console.log('Password hashing error: '+err);
        res.writeHead(500);                
        res.end('Password hashing error: '+err);
      }
      else{
        connection.query(query,[hashedPassword,user_id],function(error,results,fields){
          if(error){
            console.log('Query error: '+error);
            res.writeHead(500);                    
            res.end('Query error: '+error);
          }
          else{
            res.writeHead(200);
            res.end('Password successfully modified');    
          }
        });   
      }         
    });    
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
  
})

app.put('/api/update-info',function(req,res){
  if(authenticate()){
    let user_id=req.body.user_id;
    let user_name=req.body.user_name;
    let user_email=req.body.user_email;         
    let query='UPDATE users SET user_name=?,user_email=? WHERE user_id=?';

    connection.query(query,[user_name,user_email,user_id],function(error,results){
      if(error){
        console.log('Query error: '+error);
        res.writeHead(500);                
        res.end('Query error: '+error);
      }
      else{
        
        res.writeHead(200);
        res.end('Information successfully modified');    
      }
    }); 
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

 //assigns a single note to a new dossier
app.put('/api/assign-new-dossier',function(req,res){
  if(authenticate()){
    let user_fk=req.body.user_fk;
    let note_id=req.body.note_id;
    let dossier_name=req.body.dossier_name;
    let query;
    query='SELECT * FROM userDossier WHERE user_fk=? AND dossier_name=?';
    connection.query(query,[user_fk,dossier_name],function(error,results){
        if(error){
          console.log('Query error: '+error);
          res.writeHead(500);                
          res.end('Query error: '+error);
        }
        else{
          if(results!=''){
            
            let dossier_fk=results[0].userDossier_id;
            let dossier_name=results[0].dossier_name;
            
            query='UPDATE notes SET dossier_fk=? WHERE note_id=?';
            connection.query(query,[results[0].userDossier_id,note_id],function(error,results){
              if(error){
                console.log('Query error: '+error);
                res.writeHead(500);
                res.end('Query error: '+error);
              }
              else{
                res.writeHead(200);
                
                res.end(JSON.stringify({dossier_fk:dossier_fk,dossier_name:dossier_name}));
              }
            })
          }
        }
    })
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.put('/api/dossier-name',function(req,res){
  if(authenticate()){
    let user_id=req.body.user_id;
    let dossier_fk=req.body.dossier_fk;
    let dossier_name=req.body.dossier_name;
    //check if proposed new name already exists
    let query='SELECT * FROM userDossier WHERE user_fk=? AND dossier_name=?';
    connection.query(query,[user_id,dossier_name],function(error,results){
      if(error){
        console.log('Query error: '+ error);
        res.writeHead(500);
        res.end('Query error: '+ error);
      }
      else{
        if(results!=''){
          res.writeHead(200);
          res.end('Dossier name already exists');
        }
        else{
          query='UPDATE userDossier set dossier_name=? WHERE userDossier_id=?';
          connection.query(query,[dossier_name,dossier_fk],function(error,results){
            if(error){
              console.log('Query error: '+ error);
              res.writeHead(500);
              res.end('Query error: '+ error);
            }
            else{
              res.writeHead(200);
              res.end('Dossier name successfully modified');
            }
          })
        }
      }
    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.put('/api/note',function(req,res){
  if(authenticate()){
    let note_id=req.body.note_id;
    let title=req.body.title;
    let body=req.body.body;
    let query='UPDATE notes set title=?, body=? WHERE note_id=?';
    connection.query(query,[title,body,note_id],function(error,results){
      if(error){
        console.log('Query error: '+ error);
        res.writeHead(500);
        res.end('Query error: '+ error);
      }
      else{
        res.writeHead(200);
        res.end('Note successfully modified');
      }
    })
    
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});



app.delete('/api/delete-user',function(req,res){
  if(authenticate()){
    let user_id=req.body.user_id;
    let user_password=req.body.user_password;  
     //check if user-provided password matches the one in the
            //database, then proceed to delete account
            checkPassword(user_id,user_password,(result)=>{
              if(result==true){
                 let query='DELETE FROM users WHERE user_id=?'; 
                 
                 connection.query(query,[user_id],function(error,results){
                   if(error){
                    console.log('Query error: '+error);
                     res.writeHead(500);
                     res.end('Query error: '+error);                     
                   }
                   else{
                     res.writeHead(200);
                     res.end('Account successfully deleted');
                   }
                 })
                                 
              }
              else{
                res.writeHead(400);
                console.log('wrong password');
                res.end('Wrong password');
              }
            });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.delete('/api/update-info',function(req,res){
  if(authenticate()){
    let user_id=req.body.user_id;
    let user_name=req.body.user_name;
    let user_email=req.body.user_email;         
    let query='UPDATE users SET user_name=?,user_email=? WHERE user_id=?';
    connection.query(query,[user_name,user_email,user_id],function(error,results){
      if(error){
        console.log('Query error: '+error);
        res.writeHead(500);                
        res.end('Query error: '+error);
      }
      else{        
        res.writeHead(200);
        res.end('Information successfully modified');    
      }
    }); 
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.delete('/api/attachment',function(req,res){
  if(authenticate()){
    let attachment_id=req.body.attachment_id;
    let query = 'DELETE FROM attachments WHERE attachment_id=?';
    
    connection.query(query,[attachment_id],function(error,results){
      if(error){
        console.log('Query error: '+error);
        res.writeHead(500);                
        res.end('Query error: '+error);
      }
      else{        
        res.writeHead(200);
        res.end('Attachment successfully deleted');    
      }
    })
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.delete('/api/note-tag',function(req,res){
  if(authenticate())
  {
    let note_fk=req.body.note_fk;
    let tag_fk=req.body.tag_fk;  
    let query='DELETE FROM notesTags WHERE note_fk=? AND tag_fk=?';
    connection.query(query,[note_fk,tag_fk],function(error,results){

      if(error){
        console.log('Query error: '+error);
        res.writeHead(500);                
        res.end('Query error: '+error);
      }
      else{
      
        res.writeHead(200);
        res.end('Tag successfully deleted');    
      }

    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})
app.delete('/api/dossier',function(req,res){
  if(authenticate()){
    let dossier_fk=data.dossier_fk;
            query='DELETE FROM notes WHERE dossier_fk=?';
            connection.query(query,[dossier_fk],function(error,results){
              if(error){
                console.log('Query error: '+error);
                res.writeHead(500);
                res.end('Query error: '+error);
              }
              else{
                let query='DELETE FROM userDossier WHERE userDossier_id=?';                
                connection.query(query,[dossier_fk],function(error,results){
                  if(error){
                    console.log('Query error: '+error);
                    res.writeHead(500);
                    res.end('Query error: '+error);
                  }
                  else{
                    res.writeHead(200);
                    res.end('Dossier successfully deleted');
                  }
                })
              }
            })
    }
  else{
      console.log('authentication failed');
      res.writeHead(400);          
      res.end('unauthorized');
  }
});

app.get('/api/expiry',function(req,res){
  if(authenticate()){
     //returns the time difference between current time and the timestamp of the stored session_id
     let query='SELECT TIMEDIFF((SELECT time FROM sessions where session_id =?),now())';
     connection.query(query,[req.headers.session_id],function(error,results){
       if(error){
         console.log(error);
       }
       else{                  
         //get the value of the object returned by the query (the are are no fields in the result)
         let result =Object.values(results[0]);
         result=result[0];
         
         //retrieve number of days (counted in hours)
       
         let hours=result.split(':');
             hours=hours[0]; //sql returns negative number (==the difference)                    
             hours=parseInt(hours);

         
         //if more than 7 days have passed (168 hours), flag session as expired
         if(hours<(-168)){                                    
           console.log('session expired');
           res.end('session expired');                                    
         }
         else{
           console.log('session valid');
           res.writeHead(200);
           res.end('session valid');
         }
       }
     }) 
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.get('/api/initials',function(req,res){
  let user_id=req.headers.user_id;
            query='SELECT user_name from users where user_id=?';
            connection.query(query,[user_id],function(error,results){
              if(error){
                console.log('Query error: '+error);
                res.writeHead(500);
                res.end('Query error: '+error);
              }
              else{
                res.end(JSON.stringify({user_name:results[0].user_name}));
              }
  })
})

app.get('/api/logout',function(req,res){
  let session_id=req.headers.session_id;            
            
  let query='DELETE FROM sessions WHERE session_id=?';

  connection.query(query,[session_id],function(error,results){
    if(error){
      console.log('Query error: '+error);
      res.writeHead(500)
      res.end('Query error: '+error);
    }
    else{
      
      res.writeHead(200);
      res.end('Session successfully deleted');
    }
  })
})

app.get('/api/account',function(req,res){
  if(authenticate()){
    let user_id=req.headers.user_id;
    let query='SELECT * FROM users WHERE user_id=?';
    connection.query(query,[user_id],function(error,results){
      if(error){
        console.log('Query error: '+error);
        res.writeHead(500)
        res.end('Query error: '+error);
      }
      else{
        let user_name=results[0].user_name;
        let user_email=results[0].user_email;
        let user_password=results[0].user_password;
        let response=JSON.stringify({user_name:user_name,
                                      user_email:user_email,
                                      user_password:user_password
                                    });
        
        res.writeHead(200);
        res.end(response);

      }
    })
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.get('/api/get-user-dossiers',function(req,res){
  if(authenticate()){
    let query;
    let user_id=req.headers.user_id;
    let inputValue=req.headers.input_value;
        inputValue=decodeURI(inputValue);
    //user queries a dossier name
    if(inputValue){
      inputValue=inputValue.trim();             
      query='SELECT dossier_name FROM userDossier WHERE userDossier.user_fk=? AND userDossier.dossier_name LIKE ? ORDER BY userDossier.userDossier_id DESC LIMIT 3';              
      inputValue='%'+inputValue+'%';
      
      connection.query(query,[user_id,inputValue],function(error,results){
        if(error){
          console.log('Query error: '+error);
          res.writeHead(500);
          res.end('Query error: '+error);
        }
        else{
          
          let tags=[];
          results.forEach((r)=>{
            tags.push({dossier_id:r.dossier_id, dossier_name:r.dossier_name})
          })
          results=JSON.stringify(results);
          
          res.writeHead(200);
          res.end(results);
        }
      });
    }
    else{
      query='SELECT dossier_name FROM userDossier WHERE userDossier.user_fk=? ORDER BY userDossier.userDossier_id DESC LIMIT 3';
      
      connection.query(query,[user_id],function(error,results){
        if(error){
          console.log('Query error: '+error);
          res.writeHead(500);
          res.end('Query error: '+error);
        }
        else{
          
          let dossier=[];                  
          results.forEach((r)=>{
            dossier.push({dossier_name:r.dossier_name})
          })
          results=JSON.stringify(results);
          
          res.end(results);
        }
      })
    }
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});


app.get('/api/get-user-tags',function(req,res){
  if(authenticate()){
    let query;
            let user_id=req.headers.user_id;
            let inputValue=req.headers.input_value;
                inputValue=decodeURI(inputValue);
            
                //user queries a tag name
                if(inputValue){
                  inputValue=inputValue.trim();
                  query='SELECT * FROM userTags WHERE userTags.user_fk=? AND userTags.tag_name LIKE ? ORDER BY userTags.userTag_id DESC LIMIT 3';
                        
                  inputValue='%'+inputValue+'%';
                  
                  connection.query(query,[user_id,inputValue],function(error,results){
                    if(error){
                      console.log('Query error: '+error);
                      res.writeHead(500);
                      res.end('Query error: '+error);
                    }
                    else{
                      
                      
                      let tags=[];
                      results.forEach((r)=>{
                        tags.push({userTag_id:r.userTag_id,tag_name:r.tag_name})
                      })
                      results=JSON.stringify(results);
                      
                      res.writeHead(200);
                      res.end(results);
                    }
                  });
                }
                else{
                  inputValue=inputValue.trim();
                  query='SELECT tag_name FROM userTags WHERE userTags.user_fk=? ORDER BY userTags.userTag_id DESC LIMIT 3';
                  res.writeHead(200);
                  connection.query(query,[user_id],function(error,results){
                    if(error){
                      console.log('Query error: '+error);
                      res.writeHead(500);
                      res.end('Query error: '+error);
                    }
                    else{
                      
                      let tags=[];
                      results.forEach((r)=>{
                        tags.push({tag_name:r.tag_name})
                      })
                      results=JSON.stringify(results);
                      
                      res.writeHead(200);
                      res.end(results);
                    }
                  })
                }
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});


app.get('/api/get-dossiers-info',function(req,res){
  if(authenticate()){
    let query;
    let user_id=req.headers.user_id;
    let userDossiers=[];
    let dossierContents=[];
    query='SELECT dossier_name, userDossier_id FROM userDossier WHERE user_fk =?';
    connection.query(query,[user_id],function(error,results){
      if(error){
        console.log(error);
        res.writeHead(500);
        res.end(error);
      }
      else{
        
        
        results.forEach(r=>{
          
          userDossiers.push({'dossier_id':r.userDossier_id,'dossier_name':r.dossier_name});
          
        });
        
        
        let c=0;
        userDossiers.forEach(d=>{                  
          
          let c2=0;
          query='SELECT note_id FROM notes WHERE dossier_fk=?';
          connection.query(query,[d.dossier_id],function(error,results){
            if(error){
              console.log(error);
              res.writeHead(500);
              res.end(error);                      
            }else{
              
              results.forEach(r=>{
                c2++;                        
              });
              dossierContents.push({dossier_name:d.dossier_name,dossier_id:d.dossier_id, count:c2});
              sendResponse(dossierContents);
            }                    
          })
          
        });


        function sendResponse(dossierContents){
          c++;
          console.log(c);
          if(c==userDossiers.length){
            console.log('retrieved user dossiers with their contents');
                                        
            res.writeHead(200);
            res.end(JSON.stringify(dossierContents));
          }                  
        }                            
      }
    })
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.get('/api/user-notes',function(req,res){
  if(authenticate())
  {
    let user_id=req.headers.user_id;
    let dossier_id=req.headers.dossier_id;
    let query='SELECT * FROM notes WHERE dossier_fk=? AND user_fk=?';

    connection.query(query,[dossier_id,user_id],function(error,results){
      if(error){
        console.log('Query Error: '+error);
        res.writeHead(500);
        res.end('Query Error: '+error);
      }
      else{
        let notes=[];
        results.forEach(r=>{
          notes.push({note_id:r.note_id,title:r.title,
                      body:r.body,
                      date:r.date,
                      time:r.time,
                      dossier_fk:r.dossier_fk,
                      user_fk:r.user_fk});
        });
        
        res.writeHead(200);
        res.end(JSON.stringify(notes));
      }
    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.get('/api/note-dossier',function(req,res){
  if(authenticate()){
    let dossier_fk=req.headers.dossier_fk;
    let query='SELECT * FROM userDossier WHERE userDossier_id=?';
    connection.query(query,[dossier_fk],function(error,results){
      if(error){
        console.log('Query Error: '+error);
        res.writeHead(500);
        res.end('Query Error: '+error);
      }
      else{
        res.writeHead(200);
        
        res.end(JSON.stringify({userDossier_id:results[0].userDossier_id,dossier_name:results[0].dossier_name}));
      }        
    })
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.get('/api/note-attachments',function(req,res){
  if(authenticate())
  {
    let note_fk=req.headers.note_fk;            
    let query='SELECT * FROM attachments WHERE note_fk=?';

    connection.query(query,[note_fk],function(error,results){
      if(error){
        console.log('Query Error: '+error);
        res.writeHead(500);
        res.end('Query Error: '+error);
      }
      else{
                      
        let attachments=[];
        results.forEach(r=>{
          attachments.push({attachment_id:r.attachment_id,attachment_name:r.attachment_name,note_fk:r.note_fk})
        })
        res.writeHead(200);   
        res.end(JSON.stringify(attachments));
      } 
    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.get('/api/note-tags',function(req,res){
  if(authenticate()){
    let note_fk=req.headers.note_fk;
    let query='SELECT * FROM notesTags WHERE note_fk=?';     

    connection.query(query,[note_fk],function(error,results){
      if(error){
        console.log('Query Error: '+error);
        res.writeHead(500);
        res.end('Query Error: '+error);
      }
      else{
        res.writeHead(200);                
        let tags=[];
        results.forEach(r=>{
          tags.push({notesTags_id:r.notesTags_id,note_fk:r.note_fk,tag_fk:r.tag_fk});
        })
        
        res.end(JSON.stringify(tags));
      } 
    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.get('/api/user-tags',function(req,res){
  if(authenticate()){
    let userTag_id=req.headers.usertag_id;            
    let query='SELECT * FROM userTags WHERE userTag_id=?';     
    connection.query(query,[userTag_id],function(error,results){
      if(error){
        console.log('Query Error: '+error);
        res.writeHead(500);
        res.end('Query Error: '+error);
      }
      else{
        res.writeHead(200);                
        
          res.end(JSON.stringify({userTag_id:results[0].userTag_id,
                                  user_fk:results[0].user_fk,
                                  tag_name:results[0].tag_name                                          
                                  })
                  );                
      } 
    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});

app.get('/api/recent-notes',function(req,res){
  if(authenticate()){
    let user_id=req.headers.user_id;
    let query='SELECT * FROM notes WHERE user_fk=? ORDER BY note_id DESC LIMIT 3';
    connection.query(query,[user_id],function(error,results){
      if(error){
        console.log(error);
        res.writeHead(500);
        res.end('Query error: '+error);
      }
      else{
        let response = [];
        results.forEach(r=>{
          response.push({note_id:r.note_id,
                          title:r.title,
                          body:r.body,
                          date:r.date,
                          time:r.time,
                          dossier_fk:r.dossier_fk,
                          user_fk:r.user_fk  
                        });
        })
        res.writeHead(200);
        res.end(JSON.stringify(response));
      }
    });
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
})

app.get('/api/query-note',function(req,res){
  if(authenticate()){
    let user_id=req.headers.user_id;
    let query_input=req.headers.query_input;
        query_input='%'+query_input+'%';
    let query='SELECT * FROM notes WHERE user_fk=? AND title LIKE ? ORDER BY TITLE';
    connection.query(query,[user_id,query_input],function(error,results){
      if(error){
        console.log(error);
        res.writeHead(500);
        res.end('Query error: '+error);
      }
      else{
        let response = [];
        results.forEach(r=>{
          response.push({note_id:r.note_id,
                          title:r.title,
                          body:r.body,
                          date:r.date,
                          time:r.time,
                          dossier_fk:r.dossier_fk,
                          user_fk:r.user_fk  
                        });
        })
        res.writeHead(200);
        res.end(JSON.stringify(response));
      }
    })
  }
  else{
    console.log('authentication failed');
    res.writeHead(400);          
    res.end('unauthorized');
  }
});




// http.createServer(function (req, res) {


    


    
//     //end database connection
//     // connection.end(error=>{  
//     //   if(error){
//     //     console.log('Error terminating database connection'+error)
//     //   }
//     //   else{
//     //     console.log('database connection successfully terminated');
//     //   }
//     // });
   
    
  
 
  
  
// }).listen(port);
//check if user_session token exists in headers
function authenticate(){

  if(req.headers.session_id){     
    
    return true;
    
  }
  else{        
    return false;
  }          
}

//Compares the user inputted password with the one stored in the database
function checkPassword(user_id,password,callback){
  let query='SELECT user_password FROM users WHERE user_id=?';
  

  

  connection.query(query,[user_id],function(error,results){
    if(error){
      res.writeHead(400);
      res.end('Query error: '+error);

    }
    else{
      let hash=results[0].user_password;                
      //check password
      bcrypt.compare(password, hash, function(error, result) {
        if(error){
          console.log('Password validation error: '+error);
          res.writeHead(500);              
          res.end('Password validation error:'+error);
        }
        else
        {
          
          if(result==true){//hashed password matches the one stored in the database                
            callback(true)
          }
          else{              
          callback(false);
            
          }
        } 
      });
    }
  })
}

