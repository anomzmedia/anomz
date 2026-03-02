const auth = (req,res,next) => {
    if(!req.user) return res.status(401).json({success:false,message:"Unauthorized!"});
    next();
};

module.exports = auth;
