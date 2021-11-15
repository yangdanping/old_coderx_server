const tagService = require('../service/tag.service');

class TagController {
  async addTag(ctx, next) {
    const { name } = ctx.request.body;
    const result = await tagService.addTag(name);
    console.log(result);
    if (result) {
      console.log(`创建标签成功!`);
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log(`创建标签失败!`);
      ctx.body = { statusCode: 0, data: result };
    }
  }

  async getList(ctx, next) {
    const { offset, limit } = ctx.query; //暂时先限制展示标签的数量
    const result = await tagService.getTagList(offset, limit);
    console.log(result);
    if (result) {
      console.log(`获取标签列表成功!`);
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log(`获取标签列表失败!`);
      ctx.body = { statusCode: 0, data: result };
    }
  }
}

module.exports = new TagController();
