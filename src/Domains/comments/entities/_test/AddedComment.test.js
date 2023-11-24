const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw an error when payload not contain needed properties', () => {
    // Arrange
    const payload = { // missing 'content'
      id: 'comment-123',
      owner: 'user-123',
    }

    // Action dan Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: 'Content Comment',
    }

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toEqual(payload)
  })
})