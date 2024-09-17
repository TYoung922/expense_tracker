import prisma from "../constats/config.js";
import bcrypt from "bcrypt";
import { z } from "zod";

const auth_login = async (req, res) => {
  let user;
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Fields Missing" });
    return;
  }

  try {
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //check pw
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      //Add user id to the session
      req.session.userId = user.id;
      res.status(200).send("Authed");
    } else {
      res.status(400).json({ message: "Invalid Creditantials" });
    }
  } catch (e) {
    if (!user) res.status(400).json({ message: "Invalid Creditantials" });
    else res.status(400).json({ message: "Something went Wrong" });
  }
};

// const auth_register = async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;

//   const schema = z.object({
//     email: z.string().email({ message: "Invalid Email" }),
//     password: z
//       .string()
//       .min(3, { message: "password must be at least 3 characters" }),
//     firstName: z
//       .string()
//       .min(2, { message: "First Name must be at least 2 characters" }),
//     lastName: z
//       .string()
//       .min(2, { message: "Last Name must be at least 2 characters" }),
//   });

//   const isValid = schema.safeParse(req.body);
//   if (isValid?.error) {
//     // resizeTo.status(400).json({ errors: isValid?.error?.errors });
//     res.status(400).json({ errors: isValid.error.errors });
//     return;
//   }

//   let emailCheck;
//   try {
//     emailCheck = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });
//   } catch {
//     resizeTo.status(500).json({ message: "Something went wrong" });
//   }

//   if (emailCheck) res.status(409).json({ message: "Email already exists" });
//   else {
//     const saltRounds = 10;
//     let salted_password = await bcrypt.hash(password, saltRounds);
//     let newUser;
//     try {
//       newUser = await prisma.user.create({
//         data: {
//           email: email,
//           password: salted_password,
//           firstName: firstName,
//           lastName: lastName,
//         },
//       });

//       await prisma.transactionCategory.createMany({
//         data: [
//           {
//             name: "Products",
//             userId: newUser.id,
//           },
//           {
//             name: "entertainment",
//             userId: newUser.id,
//           },
//           {
//             name: "Bills",
//             userId: newUser.id,
//           },
//         ],
//       });

//       res.status(200).json({ userId: newUser.id });
//     } catch (e) {
//       console.log(e);
//       res.status(500).json({ message: "Something Went Wrong" });
//       return;
//     }
//   }
// };

// const auth_register = async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;

//   const schema = z.object({
//     email: z.string().email({ message: "Invalid Email" }),
//     password: z
//       .string()
//       .min(3, { message: "Password must be at least 3 characters" }),
//     firstName: z
//       .string()
//       .min(2, { message: "First Name must be at least 2 characters" }),
//     lastName: z
//       .string()
//       .min(2, { message: "Last Name must be at least 2 characters" }),
//   });

//   const validation = schema.safeParse(req.body);
//   if (!validation.success) {
//     return res.status(400).json({ errors: validation.error.errors });
//   }

//   try {
//     const emailCheck = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (emailCheck) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const saltRounds = 10;
//     const saltedPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: saltedPassword,
//         firstName,
//         lastName,
//       },
//     });

//     const existingCategories = await prisma.transactionCategory.findMany({
//       where: { userId: newUser.id },
//     });

//     const existingCategoryNames = existingCategories.map((cat) => cat.name);

//     const categoriesToCreate = [
//       { name: "Products", userId: newUser.id },
//       { name: "Entertainment", userId: newUser.id },
//       { name: "Bills", userId: newUser.id },
//     ].filter((cat) => !existingCategoryNames.includes(cat.name));

//     if (categoriesToCreate.length > 0) {
//       await prisma.transactionCategory.createMany({
//         data: categoriesToCreate,
//       });
//     }

//     // await prisma.transactionCategory.createMany({
//     //   data: [
//     //     { name: "Products", userId: newUser.id },
//     //     { name: "Entertainment", userId: newUser.id },
//     //     { name: "Bills", userId: newUser.id },
//     //   ],
//     // });

//     res.status(200).json({ userId: newUser.id });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Something Went Wrong" });
//   }
// };

const auth_register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const schema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters" }),
    firstName: z
      .string()
      .min(2, { message: "First Name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last Name must be at least 2 characters" }),
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  try {
    const emailCheck = await prisma.user.findUnique({
      where: { email },
    });

    if (emailCheck) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const saltRounds = 10;
    const saltedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: saltedPassword,
        firstName,
        lastName,
      },
    });

    // Check if categories already exist
    const existingCategories = await prisma.transactionCategory.findMany({
      where: {
        // userId: newUser.id,
        name: { in: ["Products", "Entertainment", "Bills"] },
      },
    });

    // Determine categories to create
    const existingCategoryNames = existingCategories.map((c) => c.name);
    const categoriesToCreate = ["Products", "Entertainment", "Bills"]
      .filter((name) => !existingCategoryNames.includes(name))
      .map((name) => ({ name, userId: newUser.id }));

    // Create only the missing categories
    if (categoriesToCreate.length > 0) {
      await prisma.transactionCategory.createMany({
        data: categoriesToCreate,
      });
    }

    res.status(200).json({ userId: newUser.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const auth_logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send("Cannot destroy session");
    else res.status(200).send("Logged Out");
  });
};

const auth_user = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (!user) res.status(401).json("User Not Found");
    const data = {
      email: user.email,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    res.status(200).json(data);
  } catch {
    res.status(500).json("Something Went Wrong {auth}");
  }
};

export { auth_register, auth_login, auth_logout, auth_user };
