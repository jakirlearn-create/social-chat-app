// Simple in-memory database (development only)
const users = new Map();
const posts = new Map();

class Database {
  // Users
  async findUserByEmail(email) {
    for (let user of users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findUserByPhone(phone) {
    for (let user of users.values()) {
      if (user.phone === phone) return user;
    }
    return null;
  }

  async findUserById(id) {
    return users.get(id) || null;
  }

  async createUser(userData) {
    const id = Date.now().toString();
    const user = { _id: id, ...userData };
    users.set(id, user);
    return user;
  }

  async updateUser(id, updates) {
    const user = users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date() };
    users.set(id, updated);
    return updated;
  }

  // Posts
  async createPost(postData) {
    const id = Date.now().toString();
    const post = { _id: id, ...postData, createdAt: new Date() };
    posts.set(id, post);
    return post;
  }

  async getAllPosts() {
    return Array.from(posts.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPostsByUserId(userId) {
    return Array.from(posts.values())
      .filter(post => post.author === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPostById(id) {
    return posts.get(id) || null;
  }

  async updatePost(id, updates) {
    const post = posts.get(id);
    if (!post) return null;
    const updated = { ...post, ...updates };
    posts.set(id, updated);
    return updated;
  }

  async deletePost(id) {
    return posts.delete(id);
  }

  // Stats
  getStats() {
    return {
      totalUsers: users.size,
      totalPosts: posts.size,
      users: Array.from(users.keys()),
      posts: Array.from(posts.keys())
    };
  }
}

module.exports = new Database();
