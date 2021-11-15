const { connection } = require('../app');

class UserService {
  async getUserByName(name) {
    try {
      const statement = 'SELECT * FROM user WHERE name = ?;';
      const [result] = await connection.execute(statement, [name]); //拿到的元数据是数组,解构取得查询数据库结果,也是个数组
      return result[0]; //result就是我们真实查询结果,由于查询单个取第一个结果即可
    } catch (error) {
      console.log(error);
    }
  }

  async addUser(user) {
    try {
      const { name, password } = user;
      const statement = 'INSERT INTO user (name,password) VALUES (?,?);';
      const [result] = await connection.execute(statement, [name, password]);
      if (result.affectedRows) {
        try {
          const statement = 'INSERT INTO profile (user_id) VALUES (?);';
          await connection.execute(statement, [result.insertId]);
          return result; //把插入用户表成功的结果返回,而非用户信息表
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateAvatarUrl(avatarUrl, userId) {
    try {
      const statement = `UPDATE profile SET avatar_url = ? WHERE user_id = ?;`;
      const [result] = await connection.execute(statement, [avatarUrl, userId]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getProfileById(userId) {
    try {
      const statement = `
      SELECT u.id id,u.name name,p.avatar_url avatar_url, p.age age,p.gender gender,p.email email,p.career career,p.province province,p.city city
      FROM user u
      LEFT JOIN profile p
      ON u.id = p.user_id
      WHERE u.id = ?;`;
      const [result] = await connection.execute(statement, [userId]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
  async getLikedById(userId) {
    try {
      const statement = `
      SELECT u.id id,u.name name,JSON_ARRAYAGG(al.article_id) liked FROM user u
      LEFT JOIN article_like al
      ON u.id = al.user_id
      WHERE u.id = ?
      GROUP BY u.id;`;
      const [result] = await connection.execute(statement, [userId]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserService();
