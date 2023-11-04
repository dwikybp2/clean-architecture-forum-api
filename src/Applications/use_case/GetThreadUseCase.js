class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);

    const thread = await this._threadRepository.findThreadById(useCasePayload.threadId);
    const comments = await this._commentRepository.findCommentByThreadId(useCasePayload.threadId);

    const mapComments = comments.map((com) => ({
      ...com,
      likeCount: parseInt(com.likeCount, 10),
      content: com.isDelete === 1 ? '**komentar telah dihapus**' : com.content,
    }));

    let commentReplies = [];
    let replies;
    let mapReplies;
    if (Array.isArray(comments) && comments.length !== 0) {
      commentReplies = await Promise.all(mapComments.map(async (com) => {
        replies = await this._replyRepository.findReplyByCommentId(com.id);
        mapReplies = replies.map((rep) => ({
          ...rep,
          content: rep.isDelete === 1 ? '**balasan telah dihapus**' : rep.content,
        }));

        return {
          ...com,
          replies: mapReplies,
        };
      }));
    }

    return {
      ...thread,
      comments: commentReplies,
    };
  }

  verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
