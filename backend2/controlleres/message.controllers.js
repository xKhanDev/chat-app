import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;

        console.log(message," ",receiverId," ",senderId);
        

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            senderId,
            recieverId: receiverId,
            message
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(),newMessage.save()])

        res.status(200).json(newMessage);

    } catch (error) {
        console.error("ERROR IN MESSAGE CONTROLLER", error.message);
        res.status(401).json({ error: "Something went wrong" });
    }
}


export const getMessage  = async(req,res)=>{
    try {

        const {id:userToChatId} = req.params;
        const senderId = req.user?._id;

        if(!senderId){
            return res.status(401).json({ error: "User not logged in" });
        }

        const conversation = await Conversation.findOne({
            participants:{$all:[userToChatId,senderId]}
        }).populate("messages");
        
        if(!conversation){
            return res.status(404).json({ error: "Conversation not found" });
        }

        const messages = conversation.messages;

        if(!messages){
            return res.status(404).json({ error: "No messages found" });
        }

        res.status(200).json(messages)
        
    } catch (error) {
        console.error("ERROR IN Get Message CONTROLLER", error.message);
        res.status(401).json({ error: "Something went wrong" });
    }
}