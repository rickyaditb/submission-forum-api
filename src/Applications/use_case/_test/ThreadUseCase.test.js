const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

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
});