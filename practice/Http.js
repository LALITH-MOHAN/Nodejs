const http=require('http');

const server=http.createServer((req,res)=>{
    res.write('HELLO FROM SERVER');
    res.end();
}); //created server

//listen on port 3000
server.listen(3000,()=>{
    console.log("LISTENING ON PORT 3000...");
})