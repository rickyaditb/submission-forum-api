const CreateThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(reqPayload, reqUserId) {
    const createThread = new CreateThread(reqPayload);
    return this._threadRepository.addThread(createThread, reqUserId);
  }
}

module.exports = AddThreadUseCase;