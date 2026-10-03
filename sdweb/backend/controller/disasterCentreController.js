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

    res.status(200).json(data);

  } catch (error) {
    console.log("GET DISASTER CENTRE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateDisasterCentre = async (req, res) => {
  try {
    console.log("UPDATE BODY:");
    console.log(JSON.stringify(req.body, null, 2));

    let data = await DisasterCentre.findOne();

    if (!data) {
      data = new DisasterCentre({
        disasters: [],
        shelters: [],
        news: [],
      });
    }

    if (Array.isArray(req.body.disasters)) {
      data.disasters = req.body.disasters;
    }

    if (Array.isArray(req.body.shelters)) {
      data.shelters = req.body.shelters;
    }

    if (Array.isArray(req.body.news)) {
      data.news = req.body.news;
    }

    await data.save();

    console.log("DISASTER CENTRE SAVED SUCCESSFULLY");

    res.status(200).json({
      message: "Disaster Centre updated successfully",
      data,
    });

  } catch (error) {
    console.log("UPDATE DISASTER CENTRE ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};