import User from "../models/User.js";

export const getStaffUsers = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["staff", "admin"] } })
      .select("_id name email department role")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Staff users retrieved successfully",
      data: { staff },
    });
  } catch (error) {
    console.error("Get staff users failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve staff users",
    });
  }
};
