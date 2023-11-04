const axios = require('axios')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const tryCatch = require('../utils/tryCatch')


const getTopStories = tryCatch(
  async (req,res) => {
        const newsItems = await newsapi.v2.topHeadlines({
            country: 'ng',
            pageSize:40
          })
          if (newsItems.totalResults > 0) { 
           res.status(StatusCodes.OK).json(newsItems.articles);
          }else{
            return res.status(StatusCodes.BAD_REQUEST).json('cant get news items')
          }
          
        }
) 

const getNewsByCategory = tryCatch(
  async (req,res) => {
    const {category} = req.params
        const newsItems = await newsapi.v2.topHeadlines({
            country: 'ng',
            category: category,
            pageSize:40
          })
          if (newsItems.totalResults > 0) { 
           res.status(StatusCodes.OK).json(newsItems.articles);
          }else{
            return res.status(StatusCodes.BAD_REQUEST).json('cant get news items')
          }
}
) 

module.exports = {getTopStories,getNewsByCategory}