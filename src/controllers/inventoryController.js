import apiResponse from "quick-response";


const inventoryCreate = async ( req, res )=> {
    try {
      
    } catch (error) {
      console.error("inventory create error:", error);
      return res
       .status(500)
       .json(apiResponse(500, "inventory create error", { error: error.message }));
    }
  }


  export { inventoryCreate }