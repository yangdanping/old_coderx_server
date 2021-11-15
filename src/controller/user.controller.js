// controller层一般处理路由中具体的逻辑--------------------
const fs = require('fs'); //fs模块用于读取文件信息,如获取到用户头像信息后找到图像资源返回给前端
const jwt = require('jsonwebtoken');
const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const { PRIVATE_KEY } = require('../app/config');
const { AVATAR_PATH } = require('../constants/file-path');

class UserContoller {
  async addUser(ctx, next) {
    // 1.获取用户请求传递的参数
    const user = ctx.request.body; //注意!request是koa自定义的重新封装后的对象
    // 2.根据传递过来参数在数据库中创建用户(要对JSON数据进行解析,要用koa-bodyparser,在app/config.js中注册)
    const result = await userService.addUser(user);
    // 3.将查询数据库的结果处理,给用户(前端/客户端)返回真正的数据
    if (result) {
      console.log(`创建用户成功!${JSON.stringify(result)}`);
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log('创建用户失败');
      ctx.body = { statusCode: 0, data: result };
    }
  }

  async userLogin(ctx, next) {
    // 1.拿到验证中间件设置的user(仅取出id, name作为token的payload,为了安全性不取出密码,id非常重要,各种一对一,一对多,多对多需要用)
    const { id, name } = ctx.user;
    console.log(id, name);
    // // 2.生成密钥和公钥,生成token,并传入携带的用户数据,授权中间件verifyAuth通过ctx.user = verifyResult获得这边传来的id,name
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24, //设置24小时后过期
      algorithm: 'RS256' //设置RS256加密算法
    });
    // 3.向客户端返回id,name,token
    if (token) {
      console.log(`授权成功,成功颁发token`);
      ctx.body = { id, name, token };
      console.log(ctx.body);
    } else {
      console.log(`授权失败`);
      ctx.body = '授权失败';
    }
  }

  async getProfile(ctx, next) {
    // 1.拿到路径中拼接的用户id
    const { userId } = ctx.params;
    // 2.根据id将用户表左连接用户信息表查找用户
    const userInfo = await userService.getProfileById(userId);
    // 3.将查询数据库的结果处理,给用户(前端/客户端)返回真正的数据
    if (userInfo) {
      console.log('获取用户信息成功');
      ctx.body = { statusCode: 1, data: userInfo };
    } else {
      console.log('获取用户信息失败');
      ctx.body = { statusCode: 0, data: userInfo };
    }
  }

  async getLiked(ctx, next) {
    // 1.拿到路径中拼接的用户id
    const { userId } = ctx.params;
    // 2.根据id将用户表左连接用户信息表查找用户
    const likedInfo = await userService.getLikedById(userId);
    // 3.将查询数据库的结果处理,给用户(前端/客户端)返回真正的数据
    if (likedInfo) {
      ctx.body = { statusCode: 1, data: likedInfo };
    } else {
      ctx.body = { statusCode: 0, data: likedInfo };
    }
  }

  async getAvatar(ctx, next) {
    // 1.拿到路径中拼接的用户id(注意!用户上传图片的服务器地址要保存到用户信息表中)
    const { userId } = ctx.params;
    // 2.根据拿到的用户id在avatar表中查看是否有该用户id的头像信息,
    const avatarInfo = await fileService.getAvatarById(userId);
    // 3.将查询数据库的结果处理,给用户(前端/客户端)返回真正的数据
    /* cxt.body可以放各种类型的数据,所以我们这里完全可以放个Stream类型的数据
      到时候它会读取我们的Stream流,然后直接把我们对应的数据返回
      当然直接返回,那边请求后浏览器是直接下载了,但我们不想下载,
      则必须先设置该图片的类型,请求后即可将图片直接展示 */
    if (avatarInfo) {
      console.log('获取用户头像信息成功');
      // ctx.body = avatarInfo; // 注意,此时返回的只是个json数据格式
      ctx.response.set('content-type', avatarInfo.mimetype);
      ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`); //拼接上我们对应图片的路径
    } else {
      console.log('获取用户头像信息失败');
    }
  }
}

module.exports = new UserContoller();
