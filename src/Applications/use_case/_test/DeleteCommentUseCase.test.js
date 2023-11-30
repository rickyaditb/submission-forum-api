const CommentRepository = require('../../../Domains/comments/CommentRepository');

const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the action of delete comment correctly', async () => {
    // Arrange
    const reqUserId = 'user-123';

    const reqParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** orchestrating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkExistingComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      reqParams,
      reqUserId,
    );

    // Assert
    expect(mockCommentRepository.checkExistingComment).toBeCalledWith(
      reqParams.commentId, reqParams.threadId,
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