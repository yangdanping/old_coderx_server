const Router = require('koa-router');
const userRouter = new Router({ prefix: '/user' });
const userController = require('../controller/user.controller');
const { verifyUserRegister, encryptUserPwd, verifyUserLogin } = require('../middleware/user.middleware');

/* ★用户注册接口-------------------------------------------
大致流程:用户发过来账号(姓名/密码) --> 账号密码验证 --> 密码加密 --> 在数据库中存储起来 --> 注册成功  */
userRouter.post('/register', verifyUserRegister, encryptUserPwd, userController.addUser);

/* ★用户登陆接口-------------------------------------------
大致流程:用户发过来账号(姓名/密码) --> 账号密码验证 --> 进行用户授权 */
userRouter.post('/login', verifyUserLogin, userController.userLogin);

/* ★获取用户信息接口------------------------------------------- */
userRouter.get('/:userId/profile', userController.getProfile);

/* ★获取用户点赞信息接口------------------------------------------- */
userRouter.get('/:userId/like', userController.getLiked);

/* ★获取头像接口------------------------------------------- */
userRouter.get('/:userId/avatar', userController.getAvatar);

module.exports = userRouter;
