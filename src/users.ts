import { v4 } from 'uuid';

import { IUser } from "./usersInterface.js";


const users: IUser[] = [];


export const getAll = () => {
    return users;
}

export const getById = (id: string) => {
    return users.filter(elem => elem.id === id);
}

export const add = (content: IUser) => {
    const user = {id: v4(), ...content}
    users.push(user);
    return user;
}

export const update = (id: string, content: IUser) => {
    const index = users.findIndex(user => user.id === id);
    users[index] = { id, ...content };
    return users[index];
  }