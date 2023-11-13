const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

beforeEach(async()=>{
   await mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
})

afterEach(async()=>{
  await mongoose.connection.close()  
})

describe('register endpoint',()=>{
    it('create notification',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .post('/api/v1/notification')
    .send({profilePic:'hwbjebwjeh',username:'jhswjw',body:'jdkbdjhbjdbhdg'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('saved succesfully')
    })

    it('get all notifications',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/notification/getAll')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

})