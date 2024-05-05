import { Icon } from '@iconify-icon/react'
import React from 'react'
import axios from '@/lib/axios'

const FormAcceptEmployerRequests: React.FC<{
  id: number
  email: string
  onSuccess: () => void
}> = ({ id, email, onSuccess }) => {
  async function submit(e: any) {
    e.preventDefault()
    if (confirm(`Are you sure want to accept ${email}?`)) {
      try {
        await axios.put(`/employers/verification-requests/${id}/accept`)

        onSuccess()
      } catch (error) {
        console.error()
      }
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="tooltip" data-tip="Accept">
        <button
          className="btn btn-xs btn-outline btn-success"
          type="submit"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon icon="heroicons:check-20-solid" />
        </button>
      </div>
    </form>
  )
}

export default FormAcceptEmployerRequests
