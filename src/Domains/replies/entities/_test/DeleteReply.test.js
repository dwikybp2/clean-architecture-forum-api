const DeleteReply = require('../DeleteReply');

describe('DeleteReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      commentId: {},
      userId: 123,
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment entities correctly', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const deleteReply = new DeleteReply(payload);

    expect(deleteReply).toBeInstanceOf(DeleteReply);
    expect(deleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReply.userId).toEqual(payload.userId);
  });
});
