import apiResponse from "quick-response";


const reviewCreate = async ( req, res )=> {
    try {
      
    } catch (error) {
      console.error("review create error:", error);
      return res
       .status(500)
       .json(apiResponse(500, "review create error", { error: error.message }));
    }
  }


  export { reviewCreate }