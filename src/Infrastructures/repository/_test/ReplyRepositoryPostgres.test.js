const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('findReplyById function', () => {
    it('should throw NotFoundError when reply not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.findReplyById('reply-232')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply exist', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.findReplyById('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addReply function', () => {
    it('should return added comment correctly', async () => {
      const addReply = new AddReply({
        commentId: 'comment-123',
        content: 'balasan komentar',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'balasan komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReplyById('reply-232')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply exist', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReplyById('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-232')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when wrong reply owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-232' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-232', 'user-3212')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when correct reply owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-321' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-321')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('findReplyByCommentId function', () => {
    it('should not throw NotFoundError when comment exist', async () => {
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.findReplyByCommentId('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
