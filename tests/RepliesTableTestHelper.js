/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentId = 'comment-123', content = 'balasan komentar netijen', owner = 'user-123', isDelete = 0,
  }) {
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, content, owner, isDelete, date],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async findReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM replies WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies');
  },
};

module.exports = RepliesTableTestHelper;
