import apiResponse from "quick-response";
import { Variation } from "../models/variationSchema.js";

const variationCreate = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if name already exists
    const existingVariation = await Variation.findOne({ name });
    if (existingVariation) {
      return res
        .status(400)
        .json(apiResponse(400, "Variation name already exists"));
    }

    // Create a new variation
    const variation = await Variation.create({ name });
    return res
      .status(201) // Correct status code for creation
      .json(apiResponse(201, "Variation created successfully", { variation }));
  } catch (error) {
    console.error("Variation create error:", error);
    return res
      .status(500)
      .json(apiResponse(500, "Variation create error", { error: error.message }));
  }
};

export { variationCreate };
