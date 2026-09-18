import Request from "../models/Request.js";


// ===============================
// CREATE REQUEST - VICTIM
// ===============================

export const createRequest = async (
  req,
  res
) => {
  try {
    const {
      type,
      items,
      quantity,
      urgency,
      location,
      contact,
      notes,
    } = req.body;

    if (
      !type ||
      !items ||
      !location ||
      !contact
    ) {
      return res.status(400).json({
        error:
          "Type, items, location and contact are required",
      });
    }

    const request =
      await Request.create({
        userId:
          req.user.id,

        type,

        items:
          items.trim(),

        quantity:
          quantity || "",

        urgency:
          urgency || "Medium",

        location:
          location.trim(),

        contact:
          contact.trim(),

        notes:
          notes || "",

        status:
          "Pending",
      });

    return res.status(201).json({
      message:
        "Request submitted successfully",

      request,
    });

  } catch (err) {
    console.log(
      "Create request error:",
      err
    );

    return res.status(500).json({
      error:
        "Failed to create request",
    });
  }
};


// ===============================
// GET MY REQUESTS - VICTIM
// ===============================

export const getMyRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await Request.find({
        userId:
          req.user.id,
      }).sort({
        createdAt: -1,
      });

    return res.json(
      requests
    );

  } catch (err) {
    console.log(
      "Get my requests error:",
      err
    );

    return res.status(500).json({
      error:
        "Failed to load requests",
    });
  }
};


// ===============================
// GET ALL REQUESTS - ADMIN
// ===============================

export const getAllRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await Request.find()
        .populate(
          "userId",
          "fullName email phone location"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(
      requests
    );

  } catch (err) {
    console.log(
      "Get all requests error:",
      err
    );

    return res.status(500).json({
      error:
        "Failed to load requests",
    });
  }
};


// ===============================
// APPROVE REQUEST - ADMIN
// ===============================

export const approveRequest = async (
  req,
  res
) => {
  try {
    const request =
      await Request.findByIdAndUpdate(
        req.params.id,

        {
          status:
            "Approved",
        },

        {
          new: true,
        }
      );

    if (!request) {
      return res.status(404).json({
        error:
          "Request not found",
      });
    }

    return res.json({
      message:
        "Request approved successfully",

      request,
    });

  } catch (err) {
    console.log(
      "Approve request error:",
      err
    );

    return res.status(500).json({
      error:
        "Failed to approve request",
    });
  }
};


// ===============================
// REJECT REQUEST - ADMIN
// ===============================

export const rejectRequest = async (
  req,
  res
) => {
  try {
    const request =
      await Request.findByIdAndUpdate(
        req.params.id,

        {
          status:
            "Rejected",
        },

        {
          new: true,
        }
      );

    if (!request) {
      return res.status(404).json({
        error:
          "Request not found",
      });
    }

    return res.json({
      message:
        "Request rejected successfully",

      request,
    });

  } catch (err) {
    console.log(
      "Reject request error:",
      err
    );

    return res.status(500).json({
      error:
        "Failed to reject request",
    });
  }
};