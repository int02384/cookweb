const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user:    { type: String,   required: true },
  text:    { type: String,   required: true },
  rating:  { type: Number,   min: 0, max: 5, required: true },
  date:    { type: Date,     default: Date.now }
});

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true                            
  },

  preparationTime: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  
  cookingTime: { 
    type: Number, 
    required: true, 
    default: 0 
  },

  title: {
    type: String,
    required: true,
    index: true                            
  },

  ingredients: { type: [String], required: true },
  steps:       { type: [String], required: true },

  category: {
    type: String,
    index: true                           
  },

  servings: { type: Number, default: 1 },
  unit: {
    type: String,
    enum: ['grams','pieces','ml','cups','tbsp','tsp'],
    default: 'pieces'
  },

  image:   String,
  rating:  { type: Number, min: 0, max: 5, default: 0 },
  comments:{
    type: [CommentSchema],
    default: []
  }

}, { timestamps: true });

RecipeSchema.index({ title: 'text', category: 'text' });


module.exports = mongoose.model('Recipe', RecipeSchema);
