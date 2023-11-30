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

    const thread = [
      new DetailThread({
        id: 'thread-123',
        title: 'Judul Thread',
        body: 'Body Thread',
        date: timestamp,
        username: 'dicoding',
        comments: [],
      }),
    ];

    const comments = [
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

    const DetailComments = [
      {
        ...comments[0],
        content: comments[0].is_deleted
          ? '**komentar telah dihapus**'
          : comments[0].content,
      },
      {
        ...comments[1],
        content: comments[1].is_deleted
          ? '**komentar telah dihapus**'
          : comments[1].content,
      },
    ];

    const cleanDetailCommentA = Object.keys(DetailComments[0])
      .filter(key => key !== 'is_deleted')
      .reduce((acc, key) => {
        acc[key] = DetailComments[0][key];
        return acc;
      }, {});

    const cleanDetailCommentB = Object.keys(DetailComments[1])
      .filter(key => key !== 'is_deleted')
      .reduce((acc, key) => {
        acc[key] = DetailComments[1][key];
        return acc;
      }, {});

    const expectedDetailThread = {
      ...thread[0],
      comments: [
        { ...cleanDetailCommentA },
        { ...cleanDetailCommentB },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(DetailComments));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const useCaseResult = await getThreadUseCase.execute(reqParams);

    // Assert
    expect(useCaseResult).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      reqParams.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      reqParams.threadId,
    );
  });
});