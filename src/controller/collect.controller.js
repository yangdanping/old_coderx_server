const collectService = require('../service/collect.service.js');
const userService = require('../service/user.service.js');
const Result = require('../app/Result');

class collectController {
  async addCollect(ctx, next) {
    const userId = ctx.user.id;
    console.log(userId);
    const { name } = ctx.request.body;
    const result = await collectService.addCollect(userId, name);
    ctx.body = result ? Result.success(result) : Result.fail('增加收藏夹失败!');
  }
  async getList(ctx, next) {
    const userId = ctx.user.id;
    console.log(userId);
    const { offset, limit } = ctx.query;
    const result = await collectService.getCollectList(userId, offset, limit);
    ctx.body = result ? Result.success(result) : Result.fail('获取收藏夹列表失败!');
  }
}

module.exports = new collectController();
