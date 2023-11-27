const CreateComment = require('../../Domains/comments/entities/CreateComment');

class CommentUseCase {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
  async addComment(useCaseParameter, useCasePayload, userIdFromAccessToken) {
    const { threadId } = useCaseParameter;

    await this._threadRepository.checkExistingThread(threadId);

    const createComment = new CreateComment(useCasePayload);

    return this._commentRepository.addComment(
      createComment,
      threadId,
      userIdFromAccessToken,
    );
  };
  async deleteComment(useCaseParam, userIdFromAccessToken) {
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.checkExistingThread(threadId);
    await this._commentRepository.checkExistingComment(commentId);
    await this._commentRepository.checkCommentOwner(
      commentId,
      userIdFromAccessToken,
    );

    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = CommentUseCase;