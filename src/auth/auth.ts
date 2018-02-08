import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';

import { UserData as users } from '../models/users';
import { JWTConfig } from '../config/config';

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const StrategyOptions: passportJWT.StrategyOptions = {
  secretOrKey: JWTConfig.jwtSecret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt'),
  // jwtFromRequest: ExtractJWT.fromBodyField('token'),
};

function auth() {
  var strategy = new Strategy(StrategyOptions, function(payload, done) {
    const user = users[payload.id] || null;
    if (user) {
      return done(null, {
        id: user.id,
        email: user.email,
      });
    } else {
      return done(new Error('User Not Found'), null);
    }
  });

  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },

    authenticate: function() {
      return passport.authenticate('jwt', JWTConfig.jwtSession);
    }
  }
}

export default auth;
