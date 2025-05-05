


import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js"; 

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  if (userId === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot chat with yourself");
  }
  
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") 
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    
    const chatData = {
      chatName: "sender", 
      isGroupChat: false, 
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});



export const fetchChats = asyncHandler(async (req,res) =>{
  try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id }} })
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage") 
        .sort({updatedAt: -1})
        .then(async(results)=>{
           results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
           res.status(200).send(results);
        });

  }
   catch (error)

   { 
    res.status(500).json({ message: error.message });
   }
}) ;



export const createGroupchat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let parsedUsers;
  try {
    parsedUsers = JSON.parse(users); // Safely parse stringified array
  } catch (error) {
    return res.status(400).send({ message: "Invalid users format" });
  }

  if (parsedUsers.length < 2) {
    return res.status(400).send("More than two users are required to form a group chat");
  }

  // Add the current user to the group
  parsedUsers.push(req.user);

  try {
    const groupchat = await Chat.create({
      chatname: name,             // ✅ Corrected field name to match schema
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupchat = await Chat.findOne({ _id: groupchat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    console.log("Created Group Chat:", fullGroupchat); // ✅ Logs full details
    res.status(200).json(fullGroupchat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



























export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatname } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatname },
    { new: true }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


export const addtoGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate
    (chatId, {
      $push: { users: userId },
    }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  }
  else {
    res.json(added);
  }
}
);

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});
