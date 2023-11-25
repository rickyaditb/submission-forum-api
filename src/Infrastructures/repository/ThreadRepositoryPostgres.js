const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

const { mapThreadDbToModel } = require('../../Commons/utils');

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
      text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    }

    const result = await this._pool.query(query);

    return new AddedThread(result.rows.map(mapThreadDbToModel)[0]);
  }
  async checkExistingThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }
}


module.exports = ThreadRepositoryPostgres;