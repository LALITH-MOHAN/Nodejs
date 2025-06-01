const fs=require('fs');

fs.writeFileSync('test.txt',"HELLO FROM NODE JS"); //write

const data=fs.readFileSync('test.txt','utf-8'); //read file
console.log(data);
fs.appendFileSync('test.txt',"\n APPENDED MESSAGE"); //append content
const data2=fs.readFileSync('test.txt','utf-8'); //read file
console.log(data2);
console.log(__filename);
fs.unlinkSync('test.txt'); //delete file