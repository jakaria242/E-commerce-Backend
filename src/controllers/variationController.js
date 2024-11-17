import apiResponse from "quick-response";


const variationCreate = async ( req, res )=> {
    try {
      
    } catch (error) {
      console.error("variation create error:", error);
      return res
       .status(500)
       .json(apiResponse(500, "variation create error", { error: error.message }));
    }
  }


  export { variationCreate }