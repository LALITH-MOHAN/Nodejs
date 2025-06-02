export const userlogin = (req, res) => {
    res.send("LOGIN PAGE");
  };
  
  export const usersignup = (req, res) => {
    res.send("SIGNUP PAGE");
  };
  
  export const createUser = (req, res) => {
    const { name, email } = req.body;
    res.json({ message: `Created user ${name} with email ${email}` });
  };
  
  export const updateUser = (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;
    res.send(`Updated user ${id} with name ${name} and email ${email}`);
  };
  
  export const deleteUser = (req, res) => {
    const { id } = req.params;
    res.send(`Deleted user with ID: ${id}`);
  };
  