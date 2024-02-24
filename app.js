const express=require("express");
const methodOverride=require("method-override");
const app=express();
const port=8000;
const mysql=require("mysql2");
const path=require("path");
const {faker}=require('@faker-js/faker');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "db",
    password : "pranaymachhi12"
});


app.listen(port,()=>{
    console.log("Server Started");
});

app.get("/",(req,res)=>{
    let q=`SELECT count(*) FROM data`;
    
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let cnt=result[0]["count(*)"];
            res.render("home.ejs",{cnt});
        });
    }catch(err){
        res.send("Error Occured");
    }
});

app.get("/user",(req,res)=>{
    let q=`SELECT * FROM data`;
    
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            res.render("user.ejs",{result});
        });
    }catch(err){
        res.send("Error Occured");
    }
});

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM data WHERE id='${id}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let curr=result[0];
            res.render("edit.ejs",{curr});
        });
    }catch(err){
        res.send("Error Occured");
    }
});

app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {username,password}=req.body;
    let q=`SELECT password FROM data WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let curr=result[0];
            if(curr.password==password){
                changeUsername(username,id);
                res.redirect("/user");
            }
            else{
                res.redirect(`/user/${id}/edit`);
            }
        });
    }catch(err){
        res.send("Error Occured");
    }
});

app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM data WHERE id='${id}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let curr=result[0];
            res.render("delete.ejs",{curr});
        });
    }catch(err){
        res.send("Error Occured");
    }
});

app.post("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    let {password}=req.body;
    
    let q=`SELECT password FROM data WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let curr=result[0];
            if(curr.password==password){
                deleteUser(id);
            }
            res.redirect("/user");
        });
    }catch(err){
        res.send("Error Occured");
    }

});


let deleteUser =(id)=>{
    let q=`DELETE FROM data WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
        });
    }catch(err){
        res.send("Error Occured");
    }
}

let changeUsername = (username,id)=>{
    let q=`UPDATE data SET username='${username}' WHERE id='${id}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
        });
    }catch(err){
        res.send("Error Occured");
    }
}



