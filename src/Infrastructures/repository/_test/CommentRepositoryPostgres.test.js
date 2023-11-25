const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should create new comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const createComment = new CreateComment({
        content: 'sebuah komentar',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        createComment,
        'thread-123',
        'user-123',
      );

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: `comment-${fakeIdGenerator()}`,
          content: 'sebuah komentar',
          owner: 'user-123',
        }),
      );
      expect(comment).toBeDefined();
    });
  });
});