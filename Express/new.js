import express from 'express'

const app=express();

const PORT=3000

app.get('/',(req,res)=>{
    res.send("HELLO FROM SERVER");
})
//dynamic route
app.get('/user/:i',(req,res)=>{
    res.send(`the user ID is ${req.params.i}`)
})
// multiple dynamic route
app.get('/user/:username/:userid',(req,res)=>{
    res.send(`${req.params.username}-${req.params.userid}`)
})
//query parameter
app.get('/search',(req,res)=>{
    const ite=req.query.item;
    const colour=req.query.colour;
    res.send(`item-${ite} and colour-${colour}`);
    res.end();
})
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})