import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLastActive(lastActiveString: string) {
  // Parse the lastActive string into a Date object
  const lastActiveDate = new Date(lastActiveString)

  // Get the current date and time
  const currentDate = new Date()

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate.valueOf() - lastActiveDate.valueOf()

  // Convert the time difference to seconds
  const secondsDifference = Math.floor(timeDifference / 1000)

  // Define time intervals in seconds
  const minute = 60
  const hour = 60 * minute
  const day = 24 * hour

  // Determine the appropriate time unit and value
  if (secondsDifference < minute) {
    return `${secondsDifference} seconds ago`
  } else if (secondsDifference < hour) {
    const minutes = Math.floor(secondsDifference / minute)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (secondsDifference < day) {
    const hours = Math.floor(secondsDifference / hour)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    // You can add more detailed handling for longer time spans if needed
    return lastActiveDate.toLocaleDateString() // Fallback to full date if it's a longer duration
  }
}

export function generateCompanyLogoUrl(logo: string) {
  return `${process.env.NEXT_PUBLIC_SERVER_HOST}/company-logos/${logo}`
}

export function generatePhotoProfileUrl(photo: string) {
  return `${process.env.NEXT_PUBLIC_SERVER_HOST}/photo-profiles/${photo}`
}

export function showModal(elementId: string) {
  ;(document.getElementById(elementId) as HTMLDialogElement).showModal()
}
