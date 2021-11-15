const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const config = require('../app/config');

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像数据,注意@koa/multer库也是把文件放到ctx的request对象中的,所以上传的文件在ctx.file中找到
    const userId = ctx.user.id; //由于来到这里,说明用户已验证登陆(授权),所以可以拿到id
    const { filename, mimetype, size } = ctx.file;
    console.log(userId);
    // 2.将图像数据保存到数据库中
    const result = await fileService.addAvatar(userId, filename, mimetype, size);
    // 3.保存成功后,则需要把用户头像的地址保存到profile表中的avatar_url中
    if (result) {
      console.log('上传用户头像成功');
      const avatarUrl = `${config.APP_HOST}:${config.APP_PORT}/user/${userId}/avatar`; //注意,把专门获取头像的接口写好
      const savedAvatarUrl = await userService.updateAvatarUrl(avatarUrl, userId);
      console.log(savedAvatarUrl);
      ctx.body = savedAvatarUrl ? { statusCode: 1, data: result } : { statusCode: 0 };
    } else {
      console.log('上传用户头像失败');
      ctx.body = { statusCode: 0 };
    }
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图像数据,由于那边是multer({ ... }).array('picture', 9),所以这里是返回数组,是files
    const userId = ctx.user.id;
    const files = ctx.files;
    const { articleId } = ctx.query;
    // 2.将所有的文件信息报尺寸到数据库中
    /* 注意为了能够知道图像是属于哪条动态的,必须在前端那边定义个query拿到articleId */
    const savedPictures = [];
    for (const file of files) {
      const { filename, mimetype, size } = file;
      const result = await fileService.addFile(userId, articleId, filename, mimetype, size);
      result ? savedPictures.push(result) : null;
    }
    const count = savedPictures.length;
    ctx.body = count ? { statusCode: 1, data: `上传${count}张图片成功` } : { statusCode: 0 };
  }
}

module.exports = new FileController();
