const CreateComment = require('../../Domains/comments/entities/CreateComment');

class AddCommentUseCase {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
  async execute(reqParams, reqPayload, reqUserId) {
    const { threadId } = reqParams;

    await this._threadRepository.checkExistingThread(threadId);

    const createComment = new CreateComment(reqPayload);

    return this._commentRepository.addComment(
      createComment,
      threadId,
      reqUserId,
    );
  };
}

module.exports = AddCommentUseCase;