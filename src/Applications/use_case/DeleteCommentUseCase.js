class DeleteCommentUseCase {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }
  async execute(reqParams, reqUserId) {
    const { threadId, commentId } = reqParams;

    await this._commentRepository.checkExistingComment(commentId, threadId);
    await this._commentRepository.checkCommentOwner(
      commentId,
      reqUserId,
    );

    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;