const DetailComment = require('../DetailComment');

describe('DetailThread entities', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = { // Missing Content
      id: 'comment-123',
      username: 'Username',
      date: '2023',
    };

    // Action Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw an error when payload not meet data type specification', () => {
    // Arrange
    const payload = { // should be string
      id: 'comment-123',
      username: true,
      date: 2023,
      content: {}
    }

    // Action dan Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = { 
      id: 'comment-123',
      username: 'user-123',
      date: '2023',
      content: 'Content Comment'
    }

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toEqual(payload)
  })
})