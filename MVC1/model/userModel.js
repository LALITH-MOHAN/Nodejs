const users=[
    {id:1,name:"lalith"},
    {id:2,name:"jack"},
    {id:3,name:"rose"}
];

export const getallusers=()=>users;
export const getuserbyid=(id)=>users.find((user)=>user.id===id);

