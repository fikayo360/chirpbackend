const tryCatch = (controller) => async (req,res,next) => {
    try{
        await controller(req,res)
        console.log(controller)
    }catch(error){
        return next(error);
    }
}

module.exports = tryCatch