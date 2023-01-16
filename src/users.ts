import { v4 } from 'uuid';

import { IUser } from "./usersInterface.js";


const users: IUser[] = [];


export const getAll = () => {
    return users;
}

export const getById = (id: string) => {
    return users.filter(elem => elem.id === id);
}

export const addUser = (content: IUser) => {
    const user = {id: v4(), ...content}
    users.push(user);
    return user;
}