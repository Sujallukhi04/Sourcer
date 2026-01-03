"use server";

import { db } from "./db";

/**
 * Generate Employee ID in format: OI + Initials + Year + Serial
 * Example: OI + TO + BD + 2022 + 0001 = OTOBD20220001
 * OI = Company prefix
 * TO = First two letters of first name and last name first letter
 * BD = Last name initials (or additional letters)
 * 2022 = Current year
 * 0001 = Serial number for that year
 */
export async function generateEmployeeId(
  name: string,
  companyName: string = "OI"
): Promise<string> {
  // Extract initials from name (assuming "FirstName LastName" format)
  const nameParts = name.trim().split(/\s+/);
  let initials = "";

  if (nameParts.length >= 2) {
    // Take first letter of first name and first letter of last name
    initials = (
      nameParts[0][0] + nameParts[nameParts.length - 1][0]
    ).toUpperCase();
  } else if (nameParts.length === 1) {
    // If single name, take first two letters
    initials = nameParts[0].substring(0, 2).toUpperCase();
  }

  // Get company prefix (first 2 letters of company name)
  const companyPrefix = companyName.substring(0, 2).toUpperCase();

  // Get current year
  const currentYear = new Date().getFullYear();

  // Get serial number for this year
  const userCountThisYear = await db.user.count({
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
    },
  });

  // Serial number with leading zeros (1 becomes 0001)
  const serialNumber = String(userCountThisYear + 1).padStart(4, "0");

  // Combine: Company + Initials + Year + Serial
  return `${companyPrefix}${initials}${currentYear}${serialNumber}`;
}
