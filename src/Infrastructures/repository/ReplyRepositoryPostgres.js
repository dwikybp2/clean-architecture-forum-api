const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {
      content, owner, commentId, isDelete = 0,
    } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, content, owner, isDelete, date],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan komentar tidak ditemukan');
    }

    return result.rows;
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING id',
      values: [1, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan komentar gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balsan komentar tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async findReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.id, content, date, username, is_delete AS "isDelete" FROM replies LEFT JOIN users ON users.id = replies.owner WHERE comment_id = $1 GROUP BY replies.id, users.username ORDER BY replies.date',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
