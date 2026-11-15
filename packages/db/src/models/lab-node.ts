import mongoose, { Schema, type Model } from 'mongoose';

export const LAB_NODE_TYPES = ['atl', 'fablab', 'college', 'incubator'] as const;
export type LabNodeType = (typeof LAB_NODE_TYPES)[number];

export interface ILabEquipment {
  name: string;
  model?: string;
  count: number;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface ILabNode {
  slug: string;
  name: string;
  type: LabNodeType;
  institution: string;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  tools: string[];
  equipmentList: ILabEquipment[];
  isVerified: boolean;
  contact: {
    name: string;
    role: string;
    email: string;
  };
  benchServiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabEquipmentSchema = new Schema<ILabEquipment>(
  {
    name: { type: String, required: true },
    model: { type: String },
    count: { type: Number, required: true, min: 1, default: 1 },
    status: {
      type: String,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
  },
  { _id: false },
);

const LabNodeSchema = new Schema<ILabNode>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: LAB_NODE_TYPES, required: true },
    institution: { type: String, required: true, trim: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    tools: [{ type: String }],
    equipmentList: [LabEquipmentSchema],
    isVerified: { type: Boolean, default: false },
    contact: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      email: { type: String, required: true },
    },
    benchServiceUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

LabNodeSchema.index({ type: 1, 'location.state': 1 });
LabNodeSchema.index({ tools: 1 });

export const LabNodeModel: Model<ILabNode> =
  (mongoose.models.LabNode as Model<ILabNode>) ??
  mongoose.model<ILabNode>('LabNode', LabNodeSchema);
