let users = require("./users.json");

// поиск пользователя по имени из всего списка
function findUserByName(name){
    for(i=0; i<users.length; i++){
        if(users[i].username === name){
            return users[i];
        }
    }
    return;
}

module.exports = {
    findUserByName
};