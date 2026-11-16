# Database Indexes & Performance Optimization

To maintain sub-20ms queries across high-traffic innovation directories, the following compound and unique indexes are established:

```javascript
// Users
db.users.createIndex({ handle: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Projects
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ status: 1, createdAt: -1 });
db.projects.createIndex({ tags: 1, status: 1 });
db.projects.createIndex({ title: "text", summary: "text", "description": "text" });

// Ideas
db.ideas.createIndex({ slug: 1 }, { unique: true });
db.ideas.createIndex({ authorId: 1, updatedAt: -1 });
db.ideas.createIndex({ status: 1, visibility: 1 });

// Problems
db.problems.createIndex({ slug: 1 }, { unique: true });
db.problems.createIndex({ domain: 1, difficulty: 1 });

// Stories
db.stories.createIndex({ slug: 1 }, { unique: true });
db.stories.createIndex({ category: 1, publishedAt: -1 });

// Passports
db.passports.createIndex({ userId: 1 }, { unique: true });
db.passports.createIndex({ handle: 1 }, { unique: true });

// Opportunities
db.opportunities.createIndex({ status: 1, type: 1, createdAt: -1 });
db.opportunities.createIndex({ projectId: 1, status: 1 });
```
