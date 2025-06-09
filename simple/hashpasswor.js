import bcrypt from 'bcrypt';
console.log(bcrypt.hashSync('your_admin_password', 10));