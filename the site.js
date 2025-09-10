const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// In-memory data
let users = [];
let posts = [];
let comments = [];
let friendships = [];
let likes = [];

app.use(bodyParser.json());

// Sign up
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'User exists' });
    }
    users.push({ username, password });
    res.json({ message: 'Signup successful' });
});

// Add friend
app.post('/add-friend', (req, res) => {
    const { user, friend } = req.body;
    if (!users.find(u => u.username === friend)) {
        return res.status(404).json({ error: 'Friend not found' });
    }
    friendships.push({ user, friend });
    res.json({ message: 'Friend added' });
});

// Create post
app.post('/post', (req, res) => {
    const { user, content } = req.body;
    const post = { id: posts.length + 1, user, content };
    posts.push(post);
    res.json(post);
});

// Comment
app.post('/comment', (req, res) => {
    const { user, postId, content } = req.body;
    const comment = { id: comments.length + 1, user, postId, content };
    comments.push(comment);
    res.json(comment);
});

// Like
app.post('/like', (req, res) => {
    const { user, postId } = req.body;
    likes.push({ user, postId });
    res.json({ message: 'Liked' });
});

// Get feed
app.get('/feed', (req, res) => {
    res.json(posts.map(post => ({
        ...post,
        comments: comments.filter(c => c.postId === post.id),
        likes: likes.filter(l => l.postId === post.id).length
    })));
});

app.listen(PORT, () => {
    console.log(`School Snap backend running on http://localhost:${PORT}`);
});