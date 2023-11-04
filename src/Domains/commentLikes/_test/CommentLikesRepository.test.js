const CommentLikesRepository = require('../CommentLikesRepository');

describe('CommentLikesRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentLikesRepository = new CommentLikesRepository();

    await expect(commentLikesRepository.findLikesByCommentId('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.verifyCommentLikesOwner('', '')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.addCommentLike('', '')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikesRepository.deleteCommentLike('', '')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
