/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'Content Comment',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, owner, content) VALUES($1, $2, $3, $4)',
      values: [id, threadId, owner, content],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, comments.is_deleted, users.username
      FROM comments
      INNER JOIN users ON comments.owner = users.id
      WHERE comments.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;