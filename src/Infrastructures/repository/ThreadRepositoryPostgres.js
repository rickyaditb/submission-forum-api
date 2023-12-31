const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super(); // Invoke Parent Class
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async addThread(createThread, owner) {
    const { title, body } = createThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads(id, owner, title, body) VALUES($1, $2, $3, $4) RETURNING id, owner, title',
      values: [id, owner, title, body],
    }

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }
  async checkExistingThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak dapat ditemukan');
    }
  }
  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.owner = users.id
        WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak dapat ditemukan');
    }

    return result.rows;
  }
}


module.exports = ThreadRepositoryPostgres;