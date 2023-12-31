/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const NotFoundError = require('../src/Commons/exceptions/NotFoundError');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'titlee', body = 'bodyyy', owner = 'user-123',
  }) {
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT threads.*, username FROM threads lEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1 GROUP BY threads.id, users.username',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
