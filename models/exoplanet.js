var mongoose=require("mongoose");

var exoplanetSchema = new mongoose.Schema({
    name: String,
    year: String,
    image: String,
    detectionmethod:String,
    eccentricity:String,
    perioddays:String,
    description: String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});

module.exports=mongoose.model("Exoplanet",exoplanetSchema);