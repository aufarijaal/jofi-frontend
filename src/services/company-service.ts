import axios from '@/lib/axios'
import { Company, FilterParams } from '@/types'
import { AxiosError } from 'axios'

// get (include search and pagination)
export const get = async (
  params?: FilterParams
): Promise<{ companies: Company[]; count: number } | undefined> => {
  try {
    const result = await axios.get('/companies/for-admin', {
      params: {
        dataPerPage: params?.pageSize,
        page: params?.pageIndex,
        q: params?.q ?? '',
      },
    })

    return {
      companies: result.data.data.companies,
      count: result.data.data.count,
    }
  } catch (error: any) {
    let msg = error.message

    if (error instanceof AxiosError) {
      console.error(error.response?.data.message)
      msg = error.response?.data.message
    }

    throw new Error(msg)
  }
}

// create
export const create = async (data: Omit<Company, 'slug' | 'id' | 'logo'>) => {
  try {
    await axios.post('/companies', data)
  } catch (error: any) {
    let msg = error.message

    if (error instanceof AxiosError) {
      console.error(error.response?.data.message)
      msg = error.response?.data.message
    }

    throw new Error(msg)
  }
}

// update one
export const updateOne = async (data: Omit<Company, 'slug' | 'logo'>) => {
  try {
    await axios.put(`/companies/${data.id}`, {
      name: data.name,
      about: data.about,
      industry: data.industry,
      location: data.location,
    } as Omit<typeof data, 'id'>)
  } catch (error: any) {
    let msg = error.message

    if (error instanceof AxiosError) {
      console.error(error.response?.data.message)
      msg = error.response?.data.message
    }

    throw new Error(msg)
  }
}

// delete one
export const deleteOne = async (id: number) => {
  try {
    await axios.delete(`/companies/${id}`)
  } catch (error: any) {
    let msg = error.message

    if (error instanceof AxiosError) {
      console.error(error.response?.data.message)
      msg = error.response?.data.message
    }

    throw new Error(msg)
  }
}

// delete many
export const deleteMany = async (ids: number[]) => {
  try {
    await axios.delete(`/companies`, {
      data: {
        ids,
      },
    })
  } catch (error: any) {
    let msg = error.message

    if (error instanceof AxiosError) {
      console.error(error.response?.data.message)
      msg = error.response?.data.message
    }

    throw new Error(msg)
  }
}

// etc.
