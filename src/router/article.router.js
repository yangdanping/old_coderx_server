const Router = require('koa-router');
const articleRouter = new Router({ prefix: '/article' });
const articleController = require('../controller/article.controller');
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware');
const { verifytagExists } = require('../middleware/tag.middleware.js');

/* ★发布文章接口----------------------------------------------
用户发布文章必须先验证其是否登陆(授权) */
articleRouter.post('/', verifyAuth, articleController.addArticle);

/* ★点赞文章接口---------------------------------- */
articleRouter.post('/:articleId/like', verifyAuth, articleController.likeArticle);

/* ★获取文章接口---------------------------------- */
articleRouter.get('/:articleId', articleController.getDetail);

/* ★获取文章列表接口---------------------------------- */
articleRouter.get('/', articleController.getList);

/* ★修改文章接口---------------------------------- */
articleRouter.put('/:articleId', verifyAuth, verifyPermission, articleController.update);

/* ★删除文章接口---------------------------------- */
articleRouter.delete('/:articleId', verifyAuth, verifyPermission, articleController.delete);

/* ★添加标签接口---------------------------------- */
articleRouter.post('/:articleId/tag', verifyAuth, verifyPermission, verifytagExists, articleController.addTag);

/* ★<获取动态图片>的实现
到时前端是通过返回的数据进行对该接口的请求,<img :src="momentInfo.images">
注意,上传图像那边的接口增加中间件,增加不同尺寸的图片
到时起前端通过拼接上query参数来这里获取对应对应尺寸的图片*/
articleRouter.get('/images/:filename', articleController.getFileInfo);

module.exports = articleRouter;
