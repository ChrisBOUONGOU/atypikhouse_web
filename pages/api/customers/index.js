import { createUser } from "../../../lib/back/UserService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let queryBody = { ...req.body, roles: ["ROLE_USER"] };
    let user = await createUser(queryBody);

    if (user && user.id) {
      return res.status(200).json({ data: user });
    }

    console.error(user);
    if (user && Array.isArray(user.violations)) {
      const emailViolations = user.violations.filter(
        (v) =>
          v.propertyPath == "email" &&
          v.message == "This value is already used."
      );

      if (Array.isArray(emailViolations) && emailViolations.length > 0) {
        return res.status(400).json({
          error: {
            email: "Adresse email déjà utilisée.",
          },
        });
      }
    }
    return res.status(400).json({ error: "Error occured" });
  }
}
