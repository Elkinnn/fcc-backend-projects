import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});