/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const NotFoundError = require('../src/Commons/exceptions/NotFoundError');

const CommentLikesTableTestHelper = {
  async addCommentLike(addCommentLike) {
    const { id = 'commentLike-123', commentId = 'comment-123', owner = 'user-123' } = addCommentLike;
    const query = {
      text: 'INSERT INTO comment_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    const result = await pool.query(query);

    return result.rows[0].id;
  },

  async deleteCommentLike(commentId = 'comment-123', owner = 'user-123') {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await pool.query(query);
  },

  async verifyCommentLikesOwner(commentId = 'comment-123', owner = 'user-123') {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  },

  async findCommentLikeById(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Likes komentar tidak ditemukan');
    }

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
