const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');

const authUser = async (req, res, next) => {
  
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json("no token! access denied")
  }
  console.log(authHeader);
  const tokendata = authHeader.split(' ')
  const token = tokendata[1]
  console.log(token)
  try {
    const { username, userId } = isTokenValid(token);
    req.user = {username,userId}
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(400).json('Token expired');
    } else{
    throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
  }  
};



module.exports = {authUser}
