class ApiResponse {
    constructor(statusCode, message = "success", data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse


// classs die korle multipol method use kore call kora jai================================================================
// class ApiResponse {
//     constructor(statusCode = 200, message = "success", data = null) {
//         this.statusCode = statusCode;
//         this.message = message;
//         this.data = data;
//     }
//     apiLoginResponse(data) {
//         return new ApiResponse(201, "login successfull", data);
//     }
//     apiLogoutResponse(data) {
//         return new ApiResponse(202, "logout successfull", data);
//     }
// }

// export default ApiResponse


// ata call korar niom====
// return res.json(new ApiResponse().apiLoginResponse( akhane data thakbe))
// ata call korar niom====

// classs die korle multipol method use kore call kora jai================================================================