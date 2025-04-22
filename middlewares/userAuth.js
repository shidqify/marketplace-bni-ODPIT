const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user.token = token;
        next();
    } catch (error) {
        let response = {
            data: {}
        };
        response.message = 'Auth failed';
        response.status = 401,
        response.ok = false;

        throw response;
    }
}


module.exports.permit = (...allow) => {
  const isAllowed = (status) => allow.indexOf(status) > -1;
  
  

  return (req, res, next) => {
    console.log(req.user);
    if (isAllowed(req.user.id.role)) {
      next();
    } else {
      throw { status: 401, message: "Unauthorized" }
    }
  };
};