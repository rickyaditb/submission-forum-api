const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');

describe('CommentUseCase', () => {
  describe('addComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const userIdFromAccessToken = 'user-123';

      const useCaseParameter = {
        threadId: 'thread-123',
      };

      const useCasePayload = {
        content: 'Content Comment',
      };

      const mockAddedComment = new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: userIdFromAccessToken,
      });

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.checkExistingThread = jest.fn(() => Promise.resolve(useCaseParameter.threadId));
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          owner: userIdFromAccessToken,
        }),
      ));

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedComment = await commentUseCase.addComment(
        useCaseParameter,
        useCasePayload,
        userIdFromAccessToken,
      );

      // Assert
      expect(addedComment).toStrictEqual(mockAddedComment);
      expect(mockThreadRepository.checkExistingThread).toBeCalledWith(
        useCaseParameter.threadId,
      );
      expect(mockCommentRepository.addComment).toBeCalledWith(
        new CreateComment(useCasePayload),
        useCaseParameter.threadId,
        userIdFromAccessToken,
      );
    });
  });

  describe('deleteComment', () => {
    it('should orchestrating the delete comment action correctly', async () => {
      // Arrange
      const userIdFromAccessToken = 'user-123';

      const useCaseParam = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const expectedDeletedComment = {
        status: 'success',
      };

      /** orchestrating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.checkExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
      mockCommentRepository.checkExistingComment = jest.fn(() => Promise.resolve(useCaseParam.commentId));
      mockCommentRepository.checkCommentOwner = jest.fn(() => Promise.resolve(useCaseParam.commentId, userIdFromAccessToken));
      mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve({ status: 'success' }));

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const deletedComment = await commentUseCase.deleteComment(
        useCaseParam,
        userIdFromAccessToken,
      );

      // Assert
      expect(deletedComment).toStrictEqual(expectedDeletedComment);
      expect(mockThreadRepository.checkExistingThread).toBeCalledWith(
        useCaseParam.threadId,
      );
      expect(mockCommentRepository.checkExistingComment).toBeCalledWith(
        useCaseParam.commentId,
      );
      expect(mockCommentRepository.checkCommentOwner).toBeCalledWith(
        useCaseParam.commentId,
        userIdFromAccessToken,
      );
      expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
        useCaseParam.commentId,
      );
    });
  });
});