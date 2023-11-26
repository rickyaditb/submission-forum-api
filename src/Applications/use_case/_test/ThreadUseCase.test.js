const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  describe('addThread', () => {
    it('should orchestrating the create thread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const userIdFromAccessToken = 'user-123';

      const mockCreatedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: userIdFromAccessToken,
      });

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: useCasePayload.title,
          owner: userIdFromAccessToken,
        }),
      ));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository
      });

      // Action
      const addedThread = await threadUseCase.addThread(
        useCasePayload,
        userIdFromAccessToken,
      );

      // Assert
      expect(addedThread).toStrictEqual(mockCreatedThread);
      expect(mockThreadRepository.addThread).toBeCalledWith(
        new CreateThread(useCasePayload),
        userIdFromAccessToken,
      );
    });
  });
  describe('getThread', () => {
    it('should orchestrating the get thread action correctly', async () => {
      // Arrange
      const useCaseParam = {
        threadId: 'thread-123',
      };

      const retrievedThread = [
        new DetailThread({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2022',
          username: 'dicoding',
          comments: [],
        }),
      ];

      const retrievedComments = [
        new DetailComment({
          id: 'comment-123',
          username: 'user A',
          date: '2022',
          content: 'sebuah comment A',
          is_deleted: true,
        }),
        new DetailComment({
          id: 'comment-234',
          username: 'user B',
          date: '2022',
          content: 'sebuah comment B',
          is_deleted: false,
        }),
      ];

      const detailComments = [
        {
          ...retrievedComments[0],
          content: retrievedComments[0].is_deleted
            ? '**komentar telah dihapus**'
            : retrievedComments[0].content,
        },
        {
          ...retrievedComments[1],
          content: retrievedComments[1].is_deleted
            ? '**komentar telah dihapus**'
            : retrievedComments[1].content,
        },
      ];

      // Sembunyikan Property is_deleted
      const { is_deleted: isDeleteCommentA, ...filteredDetailCommentA } = detailComments[0];
      const { is_deleted: isDeleteCommentB, ...filteredDetailCommentB } = detailComments[1];

      const expectedDetailThread = {
        ...retrievedThread[0],
        comments: [
          { ...filteredDetailCommentA },
          { ...filteredDetailCommentB },
        ],
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(retrievedThread));
      mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(detailComments));

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const useCaseResult = await threadUseCase.getThread(useCaseParam);

      // Assert
      expect(useCaseResult).toStrictEqual(expectedDetailThread);
      expect(mockThreadRepository.getThreadById).toBeCalledWith(
        useCaseParam.threadId,
      );
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
        useCaseParam.threadId,
      );
    });
  });
  
});