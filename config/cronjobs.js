const CronJob=require("cron").CronJob;

var job=new CronJob("0 * * * *",function(){
	User.updateMany({isConUser:true},{$inc:{"data.used":0.5}},function(err,updated){
		if(err){
			console.log(err);
		}else{
			console.log("cron working");
		}
	})
},null,true,"Asia/Kolkata");
job.start();

var jobone=new CronJob("01 00 1 * *",function(){
	User.updateMany({isConUser:true}, [{ "$set": { "rental.due": "$rental.total" }}],function(err,updated){
		if(err){
			console.log(err);
		}else{
			console.log("tried to update");
			User.updateMany({isConUser:true},{'data.used':0},function(err,updated){
				if(err){
					console.log(err);
				}
			})
		}
	})
},null,true,"Asia/Kolkata");
jobone.start();

module.exports=job;
module.exports=jobone;