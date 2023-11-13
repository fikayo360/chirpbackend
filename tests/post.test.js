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
    it('create post',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .post('/api/v1/post/publish')
    .send({postImg:'jhjdhjd',postAuthor:'sndsnms',postTitle:'jhkdkd',postBody:'hknkdjhejh'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('post created')
    })

    it('get posts',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/post/getFriendsPost')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
   })

   it('comment on a post',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .send({PostId:'jkdwd',PostcommentAuthor:'kjsndjdnkd',PostcommentBody:'kjhcndjhnkje',PostcommentProfilePic:'kenkejbhnejhkchjnklj'})
    .post('/api/v1/post/commentPost')
    expect(res.statusCode).toBe(200)
    expect(res.body.username).toBe('comment added succesfully')
    }) 

    it('like a post',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .post('/api/v1/post/LikePost')
    .send({authorName:'kfjfkfhfkj', postId:'ekefkejfe'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('Liked')
    })

    it('get all users posts',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/post/postByUser')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

    it('get all comments of post',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/post/getComments')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

})