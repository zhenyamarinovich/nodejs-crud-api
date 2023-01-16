import supertest from 'supertest';

import { server } from '../index';
import { ERRORS, STATUS_CODE } from '../duck/constants';
import { IUser } from '../usersInterface';

const PATH = '/api/users';


describe('check for empty data, create user and change him', () => {
  const user: IUser = {
    username: 'Anton',
    age: 30,
    hobbies: ['running', 'dansing'],
  };

  it('should return empty array', async () => {
    const response = await supertest(server).get(PATH);

    expect(response.statusCode).toBe(STATUS_CODE.OK);
    expect(response.body).toEqual([]);
  });

  it('should create new user and return it', async () => {
    const response = await supertest(server).post(PATH).send(user);

    expect(response.statusCode).toBe(STATUS_CODE.CREATED);
    expect(response.body.id).not.toBe('');
    expect(response.body.username).toBe(user.username);
    expect(response.body.age).toBe(user.age);
    expect(response.body.hobbies.length).toBe(user.hobbies.length)

    user.id = response.body.id;
  });

  it('should update age user', async () => {
    const editUser: IUser = {
        username: 'Anton',
        age: 35,
        hobbies: ['running', 'dansing'],
      };

    const response = await supertest(server).put(`${PATH}/${user.id}`).send(editUser);

    expect(response.statusCode).toBe(STATUS_CODE.OK);
    expect(response.body.age).toBe(editUser.age);
    expect(response.body.age).not.toBe(user.age);
  });

  it('should delete user by id', async () => {
    const response = await supertest(server).delete(`${PATH}/${user.id}`);

    expect(response.statusCode).toBe(STATUS_CODE.DELETED);
  });
});


describe('create user and delete by id, return empty and try to get him again', () => {

  const user: IUser = {
    username: 'Tolya',
    age: 32,
    hobbies: ['dansing'],
  };

  it('should create new user and return it', async () => {
    const response = await supertest(server).post(PATH).send(user);

    expect(response.statusCode).toBe(STATUS_CODE.CREATED);
    expect(response.body.id).not.toBe('');
    expect(response.body.username).toBe(user.username);
    expect(response.body.age).toBe(user.age);
    expect(response.body.hobbies.length).toBe(user.hobbies.length)

    user.id = response.body.id;
  });

  it('should delete user by id', async () => {
    const response = await supertest(server).delete(`${PATH}/${user.id}`);

    expect(response.statusCode).toBe(STATUS_CODE.DELETED);
  });

  it('should return empty array', async () => {
    const response = await supertest(server).get(PATH);

    expect(response.statusCode).toBe(STATUS_CODE.OK);
    expect(response.body).toEqual([]);
  });

  it("should return message that userId doesn't exist", async () => {
    const response = await supertest(server).get(`${PATH}/${user.id}`);

    expect(response.statusCode).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body.message).toBe(ERRORS.NOT_FOUND_USER);
  });
});

describe('some negative cases', () => {

  it('should return empty array', async () => {
    const response = await supertest(server).get(PATH);

    expect(response.statusCode).toBe(STATUS_CODE.OK);
    expect(response.body).toEqual([]);
  });

  it("should return message invalid id, method get", async () => {
    const response = await supertest(server).get(`${PATH}/23`);

    expect(response.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
  });

  it("should return message invalid id, method delete", async () => {
    const response = await supertest(server).delete(`${PATH}/12`);

    expect(response.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
  });
});
