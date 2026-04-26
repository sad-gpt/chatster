const redis = require("./redis");

async function addUserToQueue(user) {
  // Ensure user is not already in any queue
  await removeUserFromQueue(user.socketId);
  const key = `waiting:${user.gender || "any"}`;
  await redis.rpush(key, JSON.stringify(user));
}

async function findMatch(me) {
  const targetGenders = me.preference ? [me.preference, "any"] : ["male", "female", "any"];
  
  for (const targetGender of targetGenders) {
    const key = `waiting:${targetGender}`;
    const users = await redis.lrange(key, 0, -1);
    
    for (const userStr of users) {
      const u = JSON.parse(userStr);
      if (u.socketId === me.socketId) continue;
      
      const theyMatchMe = !me.preference || u.gender === me.preference || !u.gender;
      const iMatchThem = !u.preference || me.gender === u.preference || !me.gender;
      
      if (theyMatchMe && iMatchThem) {
        const removed = await redis.lrem(key, 1, userStr);
        if (removed > 0) return u;
      }
    }
  }
  return null;
}

async function removeUserFromQueue(socketId) {
  const keys = ["waiting:male", "waiting:female", "waiting:any"];
  for (const key of keys) {
    const users = await redis.lrange(key, 0, -1);
    for (const userStr of users) {
      const u = JSON.parse(userStr);
      if (u.socketId === socketId) {
        await redis.lrem(key, 1, userStr);
      }
    }
  }
}

module.exports = {
  addUserToQueue,
  findMatch,
  removeUserFromQueue
};
