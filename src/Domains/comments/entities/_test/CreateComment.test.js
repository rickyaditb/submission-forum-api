const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
  it('should throw an error when payload not contain needed properties', () => {
    // Arrange
    const payload = {
      
    }

    // Action dan Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw an error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 69420
    }

    // Action dan Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create CreateComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Content Comment',
    }

    // Action
    const createComment = new CreateComment(payload);

    // Assert
    expect(createComment).toEqual(payload)
  })
})