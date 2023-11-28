const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');

const AddCommentUseCase = require('../AddCommentUseCase');


describe('AddCommentUseCase', () => {
  it('should orchestrating the action of add comment correctly', async () => {
    // Arrange
    const reqUserId = 'user-123';

    const reqParams = {
      threadId: 'thread-123',
    };

    const reqPayload = {
      content: 'Content Comment',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: reqPayload.content,
      owner: reqUserId,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkExistingThread = jest.fn(() => Promise.resolve(reqParams.threadId));
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: reqPayload.content,
        owner: reqUserId,
      }),
    ));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      reqParams,
      reqPayload,
      reqUserId,
    );

    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockThreadRepository.checkExistingThread).toBeCalledWith(
      reqParams.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new CreateComment(reqPayload),
      reqParams.threadId,
      reqUserId,
    );
  });
});