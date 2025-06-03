import {getallusers,getuserbyid} from '../model/userModel.js'

export const fetchusers=(req,res)=>{
    res.json(getallusers());
}

export const fetchuserbyid=(req,res)=>{
    const id=parseInt(req.params.id);
    const user=getuserbyid(id);
    if(!user) return res.status(404).send("USER NOT FOUND");
    res.json(user);
}