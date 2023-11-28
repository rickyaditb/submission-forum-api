const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the action of delete comment correctly', async () => {
    // Arrange
    const reqUserId = 'user-123';

    const reqParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const expectedStatus = {
      status: 'success',
    };

    /** orchestrating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkExistingThread = jest.fn(() => Promise.resolve(reqParams.threadId));
    mockCommentRepository.checkExistingComment = jest.fn(() => Promise.resolve(reqParams.commentId));
    mockCommentRepository.checkCommentOwner = jest.fn(() => Promise.resolve(reqParams.commentId, reqUserId));
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve({ status: 'success' }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      reqParams,
      reqUserId,
    );

    // Assert
    expect(deletedComment).toStrictEqual(expectedStatus);
    expect(mockThreadRepository.checkExistingThread).toBeCalledWith(
      reqParams.threadId,
    );
    expect(mockCommentRepository.checkExistingComment).toBeCalledWith(
      reqParams.commentId,
    );
    expect(mockCommentRepository.checkCommentOwner).toBeCalledWith(
      reqParams.commentId,
      reqUserId,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      reqParams.commentId,
    );
  });
});