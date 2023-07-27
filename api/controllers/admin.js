import User from "../models/User.js"


const censorUsername = (username) => {
  if (username.length <= 2) {
    return username.charAt(0) + "*".repeat(username.length - 1);
  } else {
    const firstChar = username.charAt(0);
    const lastChar = username.charAt(username.length - 1);
    const middleChars = "*".repeat(username.length - 2);
    return firstChar + middleChars + lastChar;
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    const censoredUsers = users.map((user) => {
      const { username, ...rest } = user._doc;
      const censoredUsername = censorUsername(username);
      return { username: censoredUsername, createdAt: user.createdAt, };
    });

    censoredUsers.sort((a, b) => b.createdAt - a.createdAt);
    const recentUsers = censoredUsers.slice(0, 20)

    res.status(200).send(recentUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};