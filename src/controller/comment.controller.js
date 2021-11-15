const commentService = require('../service/comment.service.js');

class CommentCocntroller {
  async addComment(ctx, next) {
    // 1.获取数据(包括用户id,评论的文章id,评论内容content)
    const userId = ctx.user.id; // 不需要再从前端获取用户id,因为我授权的这个人,已携带了用户信息了
    const { articleId, content } = ctx.request.body;
    // 2.将获取到的数据插入到数据库中
    const result = await commentService.addComment(userId, articleId, content);
    // 3.将插入数据库的结果处理,给用户(前端/客户端)返回真正的数据
    if (result) {
      console.log('发表评论成功!');
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log('发表评论失败!');
      ctx.body = { statusCode: 0, data: result };
    }
  }
  async reply(ctx, next) {
    // 1.获取数据(在上面基础上多个commentId,也就是说我需要知道我是对那条评论进行回复了)
    const userId = ctx.user.id;
    const { commentId } = ctx.params;
    const { articleId, content } = ctx.request.body;
    // 2.将获取到的数据插入到数据库中
    const result = await commentService.reply(userId, articleId, commentId, content);
    // 3.将插入数据的结果处理,给用户(前端/客户端)返回真正的数据
    if (result) {
      console.log('回复评论成功!');
      ctx.body = { statusCode: 1, data: result };
    } else {
      ctx.body = { statusCode: 0, data: result };
    }
  }
  async update(ctx, next) {
    // // 1.获取数据(在上面基础上多个commentId,也就是说我需要知道我是对那条评论进行修改)
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;
    // 2.根据获取到的数据取数据库进行更新操作
    const result = await commentService.update(content, commentId);
    // 3.将查询数据库的结果处理,给用户(前端/客户端)返回真正的数据
    if (result) {
      console.log('修改评论成功!');
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log('修改评论失败!');
      ctx.body = { statusCode: 0, data: result };
    }
  }
  async delete(ctx, next) {
    // 1.获取数据(只需评论的id即可删除)
    const { commentId } = ctx.params;
    // 2.根据获取到的数据去数据库进行删除操作
    const result = await commentService.delete(commentId);
    // 3.将删除结果处理,给用户(前端/客户端)返回真正的数据
    if (result) {
      console.log('删除评论成功!');
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log('删除评论失败!');
      ctx.body = { statusCode: 0, data: result };
    }
  }

  async getList(ctx, next) {
    // 1.获取数据(由于是get请求,所以通过query的方式把其传过来,当然可以判断一些别人有没有传,没传的话最好在这里发送错误信息)
    const { articleId } = ctx.query;
    console.log(articleId);
    // 2.根据获取到的数据去查询出列表
    const result = await commentService.getCommentList(articleId);
    if (result) {
      console.log(`获取动态${articleId}的评论列表成功!`);
      ctx.body = { statusCode: 1, data: result };
    } else {
      console.log('获取评论列表失败!');
      ctx.body = { statusCode: 0, data: result };
    }
  }
}

module.exports = new CommentCocntroller();
