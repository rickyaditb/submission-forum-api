class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.content;
    this.is_deleted = payload.is_deleted;
  }
  _verifyPayload({ id, username, date, content, is_deleted }) {
    // Yang ini tidak saya revisi menjadi '!is_deleted' karena jika value is_deleted adalah false, maka error akan dibangkitkan (false positive error)
    if (!id || !username || !date || !content || is_deleted === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;