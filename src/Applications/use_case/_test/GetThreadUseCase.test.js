const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the action of get thread correctly', async () => {
    // Arrange
    const reqParams = {
      threadId: 'thread-123',
    };

    const timestamp = new Date().toISOString();

    const mockThread = [
      new DetailThread({
        id: 'thread-123',
        title: 'Judul Thread',
        body: 'Body Thread',
        date: timestamp,
        username: 'dicoding',
        comments: [],
      }),
    ];

    const mockComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'userA',
        date: timestamp,
        content: 'Content Comment That Will Be Deleted',
        is_deleted: true,
      }),
      new DetailComment({
        id: 'comment-456',
        username: 'userB',
        date: timestamp,
        content: 'Content Comment That Will not Be Deleted',
        is_deleted: false,
      }),
    ];

    const mockDetailComments = [
      {
        ...mockComments[0],
        content: mockComments[0].is_deleted
          ? '**komentar telah dihapus**'
          : mockComments[0].content,
      },
      {
        ...mockComments[1],
        content: mockComments[1].is_deleted
          ? '**komentar telah dihapus**'
          : mockComments[1].content,
      },
    ];

    const cleanDetailCommentA = Object.keys(mockDetailComments[0])
      .filter(key => key !== 'is_deleted')
      .reduce((acc, key) => {
        acc[key] = mockDetailComments[0][key];
        return acc;
      }, {});

    const cleanDetailCommentB = Object.keys(mockDetailComments[1])
      .filter(key => key !== 'is_deleted')
      .reduce((acc, key) => {
        acc[key] = mockDetailComments[1][key];
        return acc;
      }, {});

    const mockDetailThread = {
      ...mockThread[0],
      comments: [
        { ...cleanDetailCommentA },
        { ...cleanDetailCommentB },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockDetailComments));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const useCaseResult = await getThreadUseCase.execute(reqParams);

    // Assert
    expect(useCaseResult).toStrictEqual(mockDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      reqParams.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      reqParams.threadId,
    );
  });
});