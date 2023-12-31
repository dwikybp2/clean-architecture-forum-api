const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('findCommentById function', () => {
    it('should throw NotFoundError when comment not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.findCommentById('comment-232')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exist', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.findCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);

      const comment = await commentRepositoryPostgres.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toBe('comment-123');
    });
  });

  describe('addComment function', () => {
    it('should return added comment correctly', async () => {
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'komentarrrr',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'komentarrrr',
        owner: 'user-123',
      }));

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      expect(comment).toHaveLength(1);
      expect(comment[0].id).toBe(addedComment.id);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteCommentById('comment-232')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exist', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toBe(1);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-232')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when wrong comment owner', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-232' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-232', 'user-3212')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when correct comment owner', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('findCommentByThreadId function', () => {
    it('should not throw NotFoundError when comment exist', async () => {
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.findCommentByThreadId('thread-123')).resolves.not.toThrowError(NotFoundError);

      const comment = await commentRepositoryPostgres.findCommentByThreadId('thread-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toBe('comment-123');
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'komentarrrr',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment(addComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
