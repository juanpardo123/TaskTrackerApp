let fs = require("fs");
let express = require("express");
let app = express();
let port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));


app.set('view engine', 'ejs');

app.use( express.static( "public" ) );

let rawdata = fs.readFileSync('./data/data.json');

let data = JSON.parse(rawdata);

console.log(data.tasks.length)
app.listen(port, ()=>{

    console.log(`listening on port ${port}`)
})

app.get('/',(req,res)=>{
    rawdata = fs.readFileSync('./data/data.json');
    data = JSON.parse(rawdata);
    
    res.render("index", {tasks: data.tasks});
})

app.get('/new',(req,res)=>{
    res.render("new", {tasks: data.tasks});
})


app.post('/delete/:id', (req,res)=>{
   let localId= req.params.id
   let index = indexFromID(localId,data.tasks)
   console.log(index);
   if(index > -1 && index < data.tasks.length){
    data.tasks.splice(index, 1);
    console.log(data.tasks);

    let dataString = JSON.stringify(data);
    fs.writeFileSync('./data/data.json', dataString)
    res.redirect('/')
   }
   else{
    console.log(data.tasks);
    res.redirect('/error')
   }
});

function indexFromID(localId, arrObjects){
    for(i=0; i < arrObjects.length; i++){
        if(arrObjects[i].id == localId){
            return i;
        }
    }
    return -1;
}

app.post('/edit/:id', (req,res)=>{
    let localId= req.params.id
    let index = indexFromID(localId,data.tasks)
    console.log(index);
    if(index > -1 && index < data.tasks.length){
        app.locals.singledata = data.tasks[index];
        res.render("single", {singledata: data.tasks[index]});
    }
    else{
     console.log(data.tasks);
     res.redirect('/error')
    }
 });

 app.post('/submit/:id', (req,res)=>{
    let localId= req.params.id
    let index = indexFromID(localId,data.tasks)
    console.log(index);
    if(index > -1 && index < data.tasks.length){
        console.log(req.body);
        data.tasks[index].title = req.body.title;
        data.tasks[index].description = req.body.description;
        data.tasks[index].status = req.body.status;
        data.tasks[index].priority = req.body.priority;
        data.tasks[index].due_date = req.body.date;
        
        let dataString = JSON.stringify(data);
        fs.writeFileSync('./data/data.json', dataString)
        try{
            res.redirect('/');
        }
        catch{
            res.render('index');
        }
        
    }
    else{
     console.log(data.tasks);
     res.redirect('/error')
    }
 });

 app.post('/submit', (req,res)=>{
let newItem = {
    id: data.tasks.length,
    title: req.body.title,
    description: req.body.description,
    status: 'pending',
    priority: req.body.priority,
    due_date: req.body.due_date
}
data.tasks.push(newItem);
        let dataString = JSON.stringify(data);
        fs.writeFileSync('./data/data.json', dataString)
        try{
            res.redirect('/');
        }
        catch{
            res.render('index');
        }
        
   
 });
 
 function indexFromID(localId, arrObjects){
     for(i=0; i < arrObjects.length; i++){
         if(arrObjects[i].id == localId){
             return i;
         }
     }
     return -1;
 }

 app.get("*",(req,res,err)=>{
    res.render("error");
 })
app.locals.data = data;
app.locals.tasks = data.tasks;

