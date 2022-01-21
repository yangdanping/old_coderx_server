const Router = require('koa-router');
const collectRouter = new Router({ prefix: '/collect' });
const collectController = require('../controller/collect.controller.js');
const { verifyAuth } = require('../middleware/auth.middleware');
const { verifycollectExists } = require('../middleware/collect.middleware.js');

/* ★<用户增加收藏夹>的实现---------------------------------- */
collectRouter.post('/', verifyAuth, verifycollectExists, collectController.addCollect);

/* ★<用户收藏夹列表>的实现---------------------------------- */
collectRouter.get('/', verifyAuth, collectController.getList);

/* ★<用户修改收藏夹>的实现---------------------------------- */
collectRouter.put('/:collectId', verifyAuth, collectController.getList);

/* ★<用户删除收藏夹>的实现---------------------------------- */
collectRouter.delete('/:collectId', verifyAuth, collectController.getList);

module.exports = collectRouter;
