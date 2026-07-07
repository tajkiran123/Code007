import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplace extends Document {
  title: string;
  description: string;
  cost: number;
  stock: number;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true, default: 'Gadgets' }
  },
  { timestamps: true }
);

export default mongoose.models.Marketplace || mongoose.model<IMarketplace>('Marketplace', MarketplaceSchema);
