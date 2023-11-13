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
    it('should register a new user',async()=>{
     const res = await request(app)
    .post('/api/v1/user/signup')
    .send({username:'fikayo',email:'fikayoadele@gmail.com',password:'password'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.user.username).toBe('fikayo')
    })

    it('signs in a user',async()=>{
    const res = await request(app)
    .post('/api/v1/user/login')
    .send({username:'fikayo',password:'password'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.user.username).toBe('fikayo')
   })

   it('search a user',async()=>{
    let authToken = 'jjfnkjfnekjnekjenejkn'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .send({username:'fikayo'})
    .post('/api/v1/user/search')
    expect(res.statusCode).toBe(200)
    expect(res.body.username).toBe('fikayo')
    expect(res.body).toBeDefined()
    })  

    it('forgot password',async()=>{
    const res = await request(app)
    .post('/api/v1/user/forgotPassword')
    .send({emailaddress:'fikayo'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('Reset token sent successfully')
    })

    
    it('change password',async()=>{
    const res = await request(app)
    .post('/api/v1/user/changePassword')
    .send({token:'jhdjhjdhjhjsjhs',emailaddress:'fikayoadele@gmail.com',newPassword:'thompson'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('password updated successfully')
    })

    it('follow',async()=>{
    let authToken = 'ndkjndkjnkdjndkj'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/user/follow/motunrayo')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('motunrayo added succesfully')
    })

    it('unfollow',async()=>{
    let authToken = 'ndkjndkjnkdjndkj'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/user/unfollow/motunrayo')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toBe('motunrayo removed succesfully')
    })

    it('aroundYou',async()=>{
    let authToken = 'ndkjndkjnkdjndkj'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/user/aroundYou')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

    it('following',async()=>{
    let authToken = 'ndkjndkjnkdjndkj'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/user/following')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })
    
    it('followers',async()=>{
    let authToken = 'ndkjndkjnkdjndkj'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .get('/api/v1/user/followers')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    })

    it('complete profile',async()=>{
    let authToken = 'ndkjndkjnkdjndkj'
    const res = await request(app)
    .set('Authorization', `Bearer ${authToken}`)
    .post('/api/v1/user/updateProfile')
    .send({phonenumber:'07056070802',profilepic:'hfjhdlkjdk',Bio:'amazing devs',country:'naija',state:'lagos',zipcode:'100100'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    })

})