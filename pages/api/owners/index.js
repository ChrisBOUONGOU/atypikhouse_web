import { createUser } from "../../../lib/back/UserService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let queryBody = { ...req.body, roles: ["ROLE_OWNER"] };
    let user = await createUser(queryBody);
    if (user) {
      return res.status(200).json({ data: user });
    }

    return res.status(400).json({ error: "Error occured" });
  }
}
