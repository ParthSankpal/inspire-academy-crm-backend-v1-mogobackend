import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false, unique: false },
    role: {
      type: String,
      enum: [
        "super_admin",       // MD / Super Admin → Full access
        "counselor",         // Manage enquiries/admissions
        "fee_manager",       // Handle fees, dues, receipts
        "academic_coord",    // Upload timetable, test excel sheets, attendance
        "faculty",           // Add performance notes, complaints
        "data_entry",        // Upload excels only
      ],
      required: true,
    },
    passwordHashed: { type: String, required: true },
    scope: { type: [String], default: [] }, // permissions array, extra granularity
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// 🔑 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHashed")) return next();
  this.passwordHashed = await bcrypt.hash(this.passwordHashed, 10);
  next();
});

// 🔑 Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHashed);
};

export default mongoose.model("User", userSchema);
