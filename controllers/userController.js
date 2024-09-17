import prisma from "../constats/config.js";
import bcrupt from "bcrypt";

const user_update_meta = async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    await prisma.user.update({
      where: {
        id: req.session.userId,
      },
      data: {
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      },
    });
    res.status(200).send("Updated");
  } catch (e) {
    res.status(500).send("Error {Update Meta");
  }
};

//Update PW
// const user_update_password = async (req, res) => {
//   const { password, oldPassword } = req.body;
//   let user;

//   //Find User
//   try {
//     user = await prisma.user.findUnique({
//       where: {
//         id: req.session.userId,
//       },
//     });
//   } catch {
//     res.status(500).json({ message: "Something went worng" });
//     return;
//   }

//   // If User is Found
//   if (user) {
//     const isPassCorrect = await bcrupt.compare(oldPassword, user.password);
//     if (isPassCorrect) {
//       //hash and salt new pw
//       const saltRounds = 10;
//       let newPassword = await bcrupt.hash(password, saltRounds);
//       try {
//         await prisma.user.update({
//           where: {
//             id: req.session.userId,
//           },
//           data: {
//             password: newPassword,
//           },
//         });
//       } catch {
//         res.status(500).send("Cannot update pw");
//       }
//     } else {
//       //If pw is not correct
//       res.status(403).send("wrong pw");
//     }
//   }
// };

const user_update_password = async (req, res) => {
  const { password, oldPassword } = req.body;

  try {
    // Find User
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify Old Password
    const isPassCorrect = await bcrupt.compare(oldPassword, user.password);
    if (!isPassCorrect) {
      return res.status(403).json({ message: "Incorrect old password" });
    }

    // Hash and Salt New Password
    const saltRounds = 10;
    const newPassword = await bcrupt.hash(password, saltRounds);

    // Update Password
    await prisma.user.update({
      where: {
        id: req.session.userId,
      },
      data: {
        password: newPassword,
      },
    });

    res.status(200).send("Password updated successfully");
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

const user_delete = async (req, res) => {
  const userId = req.session.userId;
  req.session.destroy((err) => {
    if (err) res.status(500).send("Cannot destroy session");
    else res.status(200).send("Deleted");
  });
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export { user_update_meta, user_update_password, user_delete };
