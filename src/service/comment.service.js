const { connection } = require('../app');

class CommentService {
  async addComment(userId, articleId, content) {
    try {
      const statement = `INSERT INTO comment (user_id,article_id,content) VALUES (?,?,?)`;
      const [result] = await connection.execute(statement, [userId, articleId, content]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async reply(userId, articleId, commentId, content) {
    try {
      const statement = `INSERT INTO comment (user_id,article_id,comment_id,content) VALUES (?,?,?,?)`;
      const [result] = await connection.execute(statement, [userId, articleId, commentId, content]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async update(content, commentId) {
    try {
      const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
      const [result] = await connection.execute(statement, [content, commentId]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async delete(commentId) {
    try {
      const statement = `DELETE FROM comment WHERE id = ?;`;
      const [result] = await connection.execute(statement, [commentId]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getCommentList(articleId) {
    try {
      // 注意!获取了comment_id才能知道你当前这个评论是否是回复了别人的评论,知道这个东西前端在那边展示的时候就知道这条评论展示在什么位置了
      // const statement = `SELECT * FROM comment WHERE article_id = ?;`;
      const statement = `
      SELECT c.id, c.content, c.comment_id commendId, c.updateAt,
      JSON_OBJECT('id', u.id, 'name', u.name,'avatarUrl',p.avatar_url) user
      FROM comment c
      LEFT JOIN user u ON u.id = c.user_id
      LEFT JOIN profile p ON u.id = p.user_id
      WHERE article_id = ?;`;
      const [result] = await connection.execute(statement, [articleId]);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CommentService();
