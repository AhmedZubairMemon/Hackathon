export const sendSuccess = ({status, message, token})=>{
    return{
        status,
        message,
        token
    }

}

export const sendError = ({status, message})=>{
    return{
        status,
        message
    }
}
