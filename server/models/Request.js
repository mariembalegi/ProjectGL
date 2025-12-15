// Request Model for storing teacher paper requests
class Request {
  constructor(id, title, type, description, teacherId, documents, status = 'In Progress', createdAt = new Date()) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.description = description;
    this.teacherId = teacherId;
    this.documents = documents; // Array of file paths or file objects
    this.status = status; // 'In Progress', 'Approved', 'Rejected'
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }

  static fromJSON(data) {
    return new Request(
      data.id,
      data.title,
      data.type,
      data.description,
      data.teacherId,
      data.documents,
      data.status,
      new Date(data.createdAt)
    );
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      description: this.description,
      teacherId: this.teacherId,
      documents: this.documents,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Request;
