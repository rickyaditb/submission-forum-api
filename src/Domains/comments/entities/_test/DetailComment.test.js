const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      content: 'sebuah comment',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      date: 2022,
      content: {},
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2022-04-14T00:41:09.775Z',
      content: 'sebuah comment',
      is_deleted: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.is_deleted).toEqual(payload.is_deleted);
  });
});