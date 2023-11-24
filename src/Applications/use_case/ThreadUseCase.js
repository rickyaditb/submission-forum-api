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
}

module.exports = ThreadUseCase;