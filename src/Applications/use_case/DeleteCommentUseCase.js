class DeleteCommentUseCase {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
  async execute(reqParams, reqUserId) {
    const { threadId, commentId } = reqParams;

    await this._threadRepository.checkExistingThread(threadId);
    await this._commentRepository.checkExistingComment(commentId);
    await this._commentRepository.checkCommentOwner(
      commentId,
      reqUserId,
    );

    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;