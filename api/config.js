module.exports = {
  jwt: {
    secret: process.env.SECRET,
    option:{
      algorithm: 'HS256',
      expiresIn: '10m'
    }
  }
}