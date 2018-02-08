import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as jwter from 'jsonwebtoken';
import * as configs from './config/config';

import auth from './auth/auth';
import { UserData as users } from './models/users';

const app = express();
const auther = auth();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auther.initialize());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res, next) => {
  res.end('ok');
});

app.post('/user',  auther.authenticate(), (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      email: req.user.email,
    });
  } else {
    res.json({

    });
  }
});

app.post('/token', (req, res, next) => {
  if (req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;
    const user = users.find((value) => {
      return value.email === email && value.password === password;
    });

    if (user) {
      const tokenPayload = {
        id: user.id,
      };
      const signOptions: jwter.SignOptions = {
        expiresIn: 60,
      };
      const token = jwter.sign(tokenPayload, configs.JWTConfig.jwtSecret, signOptions);
      res.json({
        token,
      });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// 开发环境下的错误，打印 debug 信息
if (app.get('env') === 'development') {
    app.use((error: any, req, res, next) => {
      res.status(error['status'] || 500);
      res.render('error', {
        message: error.message,
        error
      });
    });
  }

app.use((error: any, req, res, next) => {
  res.status(error['status'] || 500);
  res.render('error', {
    message: error.message,
    error: {}
  });
  return null;
});

export default app;