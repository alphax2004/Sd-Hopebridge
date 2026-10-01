import DisasterCentre from "../model/disasterCentre.js";

export const getDisasterCentre = async (req, res) => {
  try {
    let data = await DisasterCentre.findOne();

    if (!data) {
      data = await DisasterCentre.create({
        disasters: [],
        shelters: [],
        news: [],
      });
    }

    res.json(data);
  } catch (error) {
    console.log("GET DISASTER CENTRE ERROR:", error);

    res.status(500).json({
      message: "Failed to load disaster centre",
    });
  }
};

export const updateDisasterCentre = async (req, res) => {
  try {
    let data = await DisasterCentre.findOne();

    if (!data) {
      data = new DisasterCentre();
    }

    data.disasters = req.body.disasters || [];
    data.shelters = req.body.shelters || [];
    data.news = req.body.news || [];

    await data.save();

    res.json({
      message: "Disaster Centre updated successfully",
      data,
    });
  } catch (error) {
    console.log("UPDATE DISASTER CENTRE ERROR:", error);

    res.status(500).json({
      message: "Failed to update disaster centre",
    });
  }
};