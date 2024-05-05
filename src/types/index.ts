export interface JobCardProps {
  jobData: {
    id: number
    title: string
    description: string
    requirements: string
    location: string
    salary: {
      raw: number
      formatted: string
    }
    createdAt: string
    companyId: number
    employerId: number
    company: {
      name: string
      logo: string
    }
    saved: boolean
  }
  onSaveToggle?: () => void
}

export interface JobCategory {
  id: number
  name: string
  slug: string
}

export interface JobCategoryWithJobsCount extends JobCategory {
  _count: {
    jobs: number
  }
}

export interface CompanyForSelect {
  id: number
  name: string
}

export type Company = {
  id: number
  name: string
  location: string
  about: string
  industry: string
  logo: string
  slug: string
}

export type UserWithName = {
  id: number
  profile?: {
    name: string
  }
  company?: {
    name: string
  }
  email: string
  isEmployer: boolean
  employerVerified: boolean
  companyId?: number
}

export type EmployerRequest = {
  id: number
  profile?: {
    name: string
  }
  email: string
  companyId: number
  company: {
    name: string
  }
}

export type FilterParams = {
  pageSize: number
  q?: string
  pageIndex: number
}

export interface ApplicantDetails {
  id: number
  email: string
  profile: {
    name: string
    photo?: any
    about?: any
  }
  educations: Education[]
  jobExperiences: JobExperience[]
  userSkills: UserSkill[]
}

export interface UserSkill {
  id: number
  userId: number
  skillId: number
  skill: Skill
}

export interface Skill {
  id: number
  name: string
  slug: string
}

export interface JobExperience {
  id: number
  title: string
  companyName: string
  startDate: string
  endDate: string
  isCurrent: boolean
  userId: number
}

export interface Education {
  id: number
  level: string
  institution: string
  major: string
  startDate: string
  endDate: string
  isCurrent: boolean
  userId: number
}

export interface JobPost {
  id: number
  employerId: number
  companyId: number
  jobCategoryId: number
  title: string
  description: string
  requirements: string
  salary: string
  location: string
  createdAt: string
  updatedAt?: any
  deletedAt?: any
}

export interface JobPostForEmployer extends JobPost {
  _count: {
    applications: number
  }
}
