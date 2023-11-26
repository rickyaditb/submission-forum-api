const CreateThread = require('../../Domains/threads/entities/CreateThread');

class ThreadUseCase {
  constructor({threadRepository, commentRepository,}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThread(useCasePayload, userIdFromAccessToken) {
    const createThread = new CreateThread(useCasePayload);
    return this._threadRepository.addThread(createThread, userIdFromAccessToken);
  }
  async getThread(useCaseParam) {
    const { threadId } = useCaseParam;

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

module.exports = ThreadUseCase;