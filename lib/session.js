var serviceAccount = require('fs-service-account');

exports.login = function(req, res, next) {
  var username = process.env.PINGDOM_USERNAME,
      password = process.env.PINGDOM_PASSWORD,
      userIPAddress = req.connection.remoteAddress;

  serviceAccount.userLogin(username, password, userIPAddress, function (err, data) {
    if(err){return next(err)}

    req.user = {profile: data.users[0]};
    req.user.sessionId = data.session.id;

    next();
  });

}
