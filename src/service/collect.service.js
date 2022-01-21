const { connection } = require('../app');

class CollectService {
  async addCollect(userId, name) {
    try {
      const statement = `INSERT INTO collect (user_id,name) VALUES (?,?);`;
      const [result] = await connection.execute(statement, [userId, name]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async getCollectByName(userId, name) {
    try {
      const statement = `SELECT * FROM collect WHERE user_id = ? and name = ?;`;
      const [result] = await connection.execute(statement, [userId, name]);
      return result[0]; //直接把查到的记录返回,不存在时返回的是undefined
    } catch (error) {
      console.log(error);
    }
  }

  async getCollectList(userId, offset, limit) {
    try {
      const statement = `SELECT * FROM collect WHERE user_id = ? LIMIT ?,?;`;
      const [result] = await connection.execute(statement, [userId, offset, limit]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CollectService();
