const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns")
const sendEmail = require("./sendEmail");

cron.schedule("*/1 * * * * ",async()=>{
    // send emails to all people who got requests the previous day
    try{
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmailId =  [...new Set(pendingRequests.map(req=> req.toUserId.emailId))];

        for(const toEmailId of listOfEmailId){
            // Send Emails
            try{
                const res = await sendEmail.run("New Friend Requests pending for "+ toEmailId,
                     "There are so many friend request pending, Please login to Dev tinder and  accept or reject request.")
                console.log("res : ",res);
            }catch(err){
                console.log("")
            }
        }

    }catch(err){
        console.error(err)
    }
});
