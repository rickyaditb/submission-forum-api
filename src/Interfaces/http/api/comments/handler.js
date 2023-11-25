const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
      const { id } = request.auth.credentials;

      const commentUseCase = this._container.getInstance(
        CommentUseCase.name,
      );
  
      const addedComment = await commentUseCase.addComment(
        request.params,
        request.payload,
        id,
      );
  
      const response = h.response({
        status: 'success',
        data: {
          addedComment,
        },
      });
  
      response.code(201);
  
      return response;
  }
}

module.exports = CommentsHandler;