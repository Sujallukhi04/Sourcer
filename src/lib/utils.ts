import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a secure auto password
 * Format: CompanyPrefix + RandomNumber + SpecialChar
 * Example: OI#Secure2025$
 */
export function generateAutoPassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const specialChars = "@#$%&*!"

  let password = ""

  // Add at least one from each category for password strength
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += specialChars[Math.floor(Math.random() * specialChars.length)]

  // Add more random characters to reach 12 characters minimum
  const allChars = uppercase + lowercase + numbers + specialChars
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("")
}
