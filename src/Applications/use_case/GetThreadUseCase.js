class GetThreadUseCase {
  constructor({threadRepository, commentRepository,}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(reqParams) {
    const { threadId } = reqParams;

    const threadResult = await this._threadRepository.getThreadById(threadId);
    const commentsResult = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );

    const comments = commentsResult.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
    }));

    const thread = {
      ...threadResult[0],
      comments: [...comments],
    };

    return thread;
  }
}

module.exports = GetThreadUseCase;