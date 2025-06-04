let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  
  export const getUsers = () => users;
  
  export const addUser = (name) => {
    const newUser = { id: Date.now(), name };
    users.push(newUser);
    return newUser;
  };
  
  export const updateUser = (id, name) => {
    const user = users.find((u) => u.id === id);
    if (user) user.name = name;
    return user;
  };
  
  export const deleteUser = (id) => {
    users = users.filter((u) => u.id !== id);
  };
  
  export const resetUsers = (newUsers) => {
    users = [...newUsers];
  };
  