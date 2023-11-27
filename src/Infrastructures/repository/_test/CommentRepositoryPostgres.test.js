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
  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: 'comment-234' });
      await CommentsTableTestHelper.addComment({ id: 'comment-345' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123',
      );

      // Assert
      expect(comments).toHaveLength(3);
    });
  });
  describe('checkCommentOwner', () => {
    it('should throw AuthorizationError when user is not the one that post the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkCommentOwner(
          'comment-123',
          'user-xxx',
        ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should resolve when user is the one that post the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkCommentOwner(
          'comment-123',
          'user-123',
        ),
      ).resolves.not.toThrowError();
    });
  });
  describe('checkExistingComment method', () => {
    it('should throw NotFoundError when the comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkExistingComment('comment-xxx'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should resolve if the comment is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkExistingComment('comment-123'),
      ).resolves.not.toThrowError();
    });
  });
  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when the comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.deleteCommentById('comment-xxx'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.deleteCommentById('comment-123'),
      ).resolves.not.toThrowError();
    });
  });
});