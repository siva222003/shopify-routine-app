import mongoose from "mongoose";

export interface ITestModel extends mongoose.Document {
  name: string;
}

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model<ITestModel>("Test", TestSchema);
