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
    it('create saved post',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .post('/api/v1/savedPost/createSavedPost')
    .send({SavedPostImg:'dhjdhjhj',SavedPostAuthor:'jack',SavedPostTitle:'spost',SavedPostBody:'spostsbody'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('saved succesfully')
    })

    it('get saved posts',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/savedPost/getSavedPosts')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
   })

   it('search a user',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .send({username:'fikayo'})
    .delete('/api/v1/savedPost/deleteSavedPost/838873873780')
    expect(res.statusCode).toBe(200)
    expect(res.body.username).toBe('deleted')
    })  

})