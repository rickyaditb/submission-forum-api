const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment, threadId, owner) {
    const { content } = createComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, thread_id, owner, content) VALUES($1, $2, $3, $4) RETURNING id, owner, content',
      values: [id, threadId, owner, content],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }
  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_deleted, users.username
      FROM comments
      INNER JOIN users ON comments.owner = users.id
      WHERE thread_id = $1
      ORDER BY DATE ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
  async checkCommentOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda bukan user yang membuat komentar ini');
    }
  }
  async checkExistingComment(commentId, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak dapat ditemukan');
    }
  }
  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak dapat dihapus, ID komentar tidak dapat ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;