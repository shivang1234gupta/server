var firebase=require('firebase');
const express=require('express');
const Joi=require('joi');
const app=express();
app.use(express.json());
firebase.initializeApp({
serviceAccount:"./smartirrigation-3ef38-cab68389b958.json",
databaseURL:"https://smartirrigation-3ef38.firebaseio.com/"
});

app.put('/register',(req,res)=>{
               const result=Validation(req.body);
               if(result.error){
                              res.status(404).send(result.error.details[0].message);
                              return;
               }
               var ref=firebase.database().ref('Farmers');
               var msgref=ref.child(req.body.id);
               msgref.child("pumpstatus").set(req.body.pump);
               msgref.child("waterdepth").set(req.body.waterdepth);
               res.send(true);
});
app.get('/getDays/:id',(req,res)=>{
                var ref=firebase.database().ref('Farmers');
                console.log(req.params.id);
                              var msgref=ref.child(req.params.id.substring(1)).child('farmerdate');
                              msgref.once('value',function(snap){
                                             console.log(snap.val());
                                             res.send(snap.val());
                              });
               //res.send(course);
               //res.send(req.query);
               //res.send(req.params.id);
               //res.send(req.q);
});
function Validation(course){
               const schema={
                              id: Joi.string().required(),
                              waterdepth: Joi.string().required(),
                              pump: Joi.boolean().required()
                };
                const result=Joi.validate(course,schema);
                return result;
}
const port=process.env.PORT||3000;
app.listen(port,()=>{
               console.log("listening to port ",port," ....");
});

