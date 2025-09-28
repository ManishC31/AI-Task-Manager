import Organization from "@/models/organization.model";
import User from "@/models/user.model";
import { StandardSentence } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { firstname, lastname, orgname, email, password } = await req.json();
  console.log("data:", firstname, lastname, orgname, email, password);
  // TODO: validate body data
  try {
    await ConnectDB();

    const extension = email.toLowerCase().split("@")[1];
    const existingOrganization = await Organization.findOne({ extension: extension });

    if (extension !== "gmail.com" && existingOrganization) {
      return NextResponse.json({
        success: false,
        message: "Organization is already present",
      });
    }

    const organization = await Organization.create({
      name: orgname,
      extension: extension,
    });

    const encPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      firstname: StandardSentence(firstname),
      lastname: lastname ? StandardSentence(lastname) : null,
      email: email.toLowerCase(),
      password: encPassword,
      role: "ADMIN",
      organization: organization._id,
    });

    adminUser.password = undefined;

    return NextResponse.json({
      success: true,
      user: adminUser,
    });
  } catch (error) {
    console.log("Err in register user:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to register user",
    });
  }
}
