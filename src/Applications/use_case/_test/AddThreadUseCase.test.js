const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the action of create thread correctly', async () => {
    // Arrange
    const reqPayload = {
      title: 'Judul Thread',
      body: 'Body Thread',
    };

    const reqUserId = 'user-123';

    const expectedThread = new AddedThread({
      id: 'thread-123',
      title: reqPayload.title,
      owner: reqUserId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
      new AddedThread({
        id: 'thread-123',
        title: reqPayload.title,
        owner: reqUserId,
      }),
    ));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      reqPayload,
      reqUserId,
    );

    // Assert
    expect(addedThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new CreateThread(reqPayload),
      reqUserId,
    );
  });
});