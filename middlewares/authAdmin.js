// import { clerkClient } from "@clerk/nextjs/server"

// const authAdmin = async (userId) => {
//     try {
//         if(!userId) return false

//         const client = await clerkClient()
//         const user = await client.users.getUser(userId)

//         return process.env.ADMIN_EMAIL.split(',').includes(user.emailAddresses[0].emailAddress)
//     } catch (error) {
//         console.error(error)
//         return false
//     }
// }

// export default authAdmin
import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  try {
    if (!userId) return false;

    // 1. Initialize Clerk Client
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // 2. SAFETY GUARD: Get the env variable
    const adminEmailsString = process.env.ADMIN_EMAIL || "";

    if (!adminEmailsString) {
      console.error("ADMIN_EMAIL is not defined in your .env file!");
      return false;
    }

    // 3. Extract the primary email
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // 4. Compare (Case-insensitive to be safe)
    const isAdmin = adminEmailsString
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .includes(userEmail?.toLowerCase());

    return isAdmin;
  } catch (error) {
    console.error("AuthAdmin Error:", error);
    return false;
  }
};

export default authAdmin;
