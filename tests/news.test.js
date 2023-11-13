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

    it('get all notifications',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/news/getTopStories')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

    it('get all notifications by category',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/news/getNewsCategory/:business')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

})