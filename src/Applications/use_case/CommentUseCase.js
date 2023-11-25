const NewComment = require('../../Domains/comments/entities/CreateComment');

class CommentUseCase {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
  async addComment(useCaseParameter, useCasePayload, userIdFromAccessToken) {
    const { threadId } = useCaseParameter;

    await this._threadRepository.checkExistingThread(threadId);

    const newComment = new NewComment(useCasePayload);

    return this._commentRepository.addComment(
      newComment,
      threadId,
      userIdFromAccessToken,
    );
  };
}

module.exports = CommentUseCase;