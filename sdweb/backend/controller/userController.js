import User from "../model/user.js";


// ===============================
// CREATE USER PROFILE
// ===============================

export const createUser = async (
  req,
  res
) => {

  try {

    // Firebase user information
    const firebaseUid =
      req.firebaseUser.uid;

    const firebaseEmail =
      req.firebaseUser.email
        ?.toLowerCase()
        .trim();


    // Request body
    const {
      fullName,
      bloodGroup,
      phone,
      location,
      role,
    } = req.body;


    // ===============================
    // Required fields
    // ===============================

    if (
      !fullName?.trim() ||
      !bloodGroup ||
      !phone?.trim() ||
      !location?.trim() ||
      !role
    ) {

      return res.status(400).json({
        message:
          "All fields are required",
      });

    }


    // ===============================
    // Firebase email
    // ===============================

    if (!firebaseEmail) {

      return res.status(400).json({
        message:
          "Firebase email not found",
      });

    }


    // ===============================
    // Role validation
    // ===============================

    if (
      !["user", "ngo", "admin"].includes(
        role
      )
    ) {

      return res.status(400).json({
        message:
          "Invalid role",
      });

    }


    // ===============================
    // Existing email
    // ===============================

    const existingEmail =
      await User.findOne({
        email: firebaseEmail,
      });

    if (existingEmail) {

      return res.status(400).json({
        message:
          "Email already exists",
      });

    }


    // ===============================
    // Existing Firebase UID
    // ===============================

    const existingFirebaseUser =
      await User.findOne({
        firebaseUid,
      });

    if (existingFirebaseUser) {

      return res.status(400).json({
        message:
          "Firebase account already exists",
      });

    }


    // ===============================
    // Create MongoDB profile
    // ===============================

    const user =
      await User.create({

        firebaseUid,

        fullName:
          fullName.trim(),

        email:
          firebaseEmail,

        // Firebase handles password
        password: "",

        bloodGroup,

        phone:
          phone.trim(),

        location:
          location.trim(),

        role,

        // Firebase email is
        // not verified yet
        verified: false,

      });


    // ===============================
    // Success
    // ===============================

    return res.status(201).json({

      message:
        "Registration successful",

      user: {

        id:
          user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        bloodGroup:
          user.bloodGroup,

        phone:
          user.phone,

        location:
          user.location,

        role:
          user.role,

        verified:
          user.verified,

      },

    });

  } catch (error) {

    console.log(
      "REGISTRATION ERROR:",
      error
    );


    // MongoDB duplicate key
    if (
      error.code === 11000
    ) {

      return res.status(400).json({
        message:
          "Email or Firebase account already exists",
      });

    }


    return res.status(500).json({
      message:
        "Registration failed",
    });

  }
};


// ===============================
// GET ALL USERS
// ===============================

export const getAllUsers = async (
  req,
  res
) => {

  try {

    const users =
      await User.find()
        .select(
          "-password -__v"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(
      users
    );

  } catch (error) {

    console.log(
      "GET USERS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load users",
    });

  }
};


// ===============================
// GET PROFILE
// ===============================

export const getProfile = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user.id
      ).select(
        "-password -__v"
      );

    if (!user) {

      return res.status(404).json({
        message:
          "User not found",
      });

    }

    return res.status(200).json(
      user
    );

  } catch (error) {

    console.log(
      "PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load profile",
    });

  }
};


// ===============================
// UPDATE USER
// ===============================

export const updateUser = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {
      fullName,
      bloodGroup,
      phone,
      location,
      role,
    } = req.body;


    const user =
      await User.findById(id);

    if (!user) {

      return res.status(404).json({
        message:
          "User not found",
      });

    }


    if (
      fullName !== undefined
    ) {

      user.fullName =
        fullName.trim();

    }


    if (
      bloodGroup !== undefined
    ) {

      user.bloodGroup =
        bloodGroup;

    }


    if (
      phone !== undefined
    ) {

      user.phone =
        phone.trim();

    }


    if (
      location !== undefined
    ) {

      user.location =
        location.trim();

    }


    if (
      role !== undefined
    ) {

      if (
        ![
          "user",
          "ngo",
          "admin",
        ].includes(role)
      ) {

        return res.status(400).json({
          message:
            "Invalid role",
        });

      }

      user.role = role;

    }


    await user.save();


    return res.status(200).json({

      message:
        "User updated successfully",

      user: {

        id:
          user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        bloodGroup:
          user.bloodGroup,

        phone:
          user.phone,

        location:
          user.location,

        role:
          user.role,

        verified:
          user.verified,

      },

    });

  } catch (error) {

    console.log(
      "UPDATE USER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update user",
    });

  }
};


// ===============================
// DELETE USER
// ===============================

export const deleteUser = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const user =
      await User.findById(id);

    if (!user) {

      return res.status(404).json({
        message:
          "User not found",
      });

    }


    await User.findByIdAndDelete(
      id
    );


    return res.status(200).json({
      message:
        "User deleted successfully",
    });

  } catch (error) {

    console.log(
      "DELETE USER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete user",
    });

  }
};