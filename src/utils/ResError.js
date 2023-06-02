export class ResError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
    }
}