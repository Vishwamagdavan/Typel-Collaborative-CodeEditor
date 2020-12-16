let users = [];

const addUser = ({ id, name, room }) => {
  username = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }
  const userExist = users.find(user => {
    return user.room === room && user.username === username;
  });
  if (userExist) {
    return {
      error: "Username is in use!"
    };
  }
  const user = { id, username, room };
  users.push(user);
  //console.log(users);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => {
    user.id === id;
  });
  if (index !== 1) {
    return users.splice(index, 1);
  }
};


const getUser = (id) => {
  console.log(users);
  users.find((user) => user.id === id)  
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { 
  addUser, 
  removeUser, 
  getUser, 
  getUsersInRoom };