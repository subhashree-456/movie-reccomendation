import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genres: [
      {
        type: String,
        required: true,
      },
    ],
    poster: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    ratingAvg: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
export default Movie;
