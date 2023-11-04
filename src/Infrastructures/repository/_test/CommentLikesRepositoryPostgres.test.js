const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentLikesRepositoryPostgres = require('../CommentLikesRepositoryPostgres');

describe('CommentLikesRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyCommentLikesOwner function', () => {
    it('should return false when comment_like not exist', async () => {
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});

      await expect(commentLikesRepositoryPostgres.verifyCommentLikesOwner('comment-123', 'user-123')).resolves.toEqual(false);
    });

    it('should return true when comment_like exist', async () => {
      await CommentLikesTableTestHelper.addCommentLike({});
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});

      await expect(commentLikesRepositoryPostgres.verifyCommentLikesOwner('comment-123', 'user-123')).resolves.toEqual(true);
    });
  });

  describe('addCommentLike function', () => {
    it('should return added comment_like correctly', async () => {
      const fakeIdGenerator = () => '123';
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedCommentLike = await commentLikesRepositoryPostgres.addCommentLike('comment-123', 'user-123');

      expect(addedCommentLike).toEqual('commentLike-123');
      await expect(commentLikesRepositoryPostgres.verifyCommentLikesOwner('comment-123', 'user-123')).resolves.toEqual(true);

      const commentLike = await commentLikesRepositoryPostgres.findCommentLikeById('commentLike-123');

      expect(commentLike).toStrictEqual({
        id: 'commentLike-123',
        comment_id: 'comment-123',
        owner: 'user-123',
      });
    });
  });

  describe('deleteCommentLike function', () => {
    it('should delete comment_like correctly', async () => {
      await CommentLikesTableTestHelper.addCommentLike('comment-123', 'user-123');
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});

      await commentLikesRepositoryPostgres.deleteCommentLike('comment-123', 'user-123');

      await expect(commentLikesRepositoryPostgres.verifyCommentLikesOwner('comment-123', 'user-123')).resolves.toEqual(false);

      await expect(commentLikesRepositoryPostgres.findCommentLikeById('commentLike-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('findCommentLikeById function', () => {
    it('should not throw NotFoundError when commentLike exist', async () => {
      await CommentLikesTableTestHelper.addCommentLike('comment-123', 'user-123');
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});

      const commentLike = await commentLikesRepositoryPostgres.findCommentLikeById('commentLike-123');

      expect(commentLike).toStrictEqual({
        id: 'commentLike-123',
        comment_id: 'comment-123',
        owner: 'user-123',
      });
    });

    it('should throw NotFoundError when commentLike not exist', async () => {
      const commentLikesRepositoryPostgres = new CommentLikesRepositoryPostgres(pool, {});

      await expect(commentLikesRepositoryPostgres.findCommentLikeById('commentLike-123')).rejects.toThrowError(NotFoundError);
    });
  });
});
