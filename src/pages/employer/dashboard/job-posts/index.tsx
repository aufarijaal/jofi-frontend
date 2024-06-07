import DataManagementLayout from '@/components/data-management-layout'
import FormAddJobPost from '@/components/forms/form-add-job-post'
import EmployerJobCard from '@/components/job-card/employer-job-card'
import useDialog from '@/hooks/useDialog'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { JobPostForEmployer } from '@/types'
import { useDebounce } from 'use-debounce'
import convertRupiah from '@/lib/convertRupiah'
import dayjs from 'dayjs'
import FormEditJobPost from '@/components/forms/form-edit-job-post'
import useAlert from '@/hooks/useAlert'
import { toast } from 'sonner'
import { Modal, useModal } from '@faceless-ui/modal'

function EmployerDashboardJobPosts() {
  const { toggleModal, isModalOpen } = useModal()

  const addJobPostModalSlug = 'add-job-post-modal'
  const editJobPostModalSlug = 'edit-job-post-modal'

  const EditJobPostDialog = useDialog()
  const [jobPostToEdit, setJobPostToEdit] = useState<JobPostForEmployer>()
  const [jobPosts, setJobPosts] = useState<JobPostForEmployer[]>([])
  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 0,
  })
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue] = useDebounce(searchValue, 500)
  const [dataPerPage, setDataPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const Alert = useAlert()

  async function getJobPosts() {
    try {
      setLoading(true)
      const result = await axios.get(`/jobs/employer`, {
        params: {
          q: debouncedSearchValue,
          dataPerPage,
          page,
          sortBy,
        },
      })

      setJobPosts(result.data.data.jobPosts)
      setPagination(result.data.data.pagination)
      setCount(result.data.data.count)
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function deleteJobPost(id: number) {
    try {
      if (confirm(`Are you sure want to delete this job post?`)) {
        setLoading(true)
        await axios.delete(`/jobs/${id}`)

        page === 1 ? getJobPosts() : setPage(1)
      }
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
        toast.error('Failed to delete job post', {
          description: error.response?.data.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getJobPosts()
  }, [page, debouncedSearchValue, dataPerPage, sortBy])
  return (
    <DataManagementLayout
      noExpander
      title="Employer Dashboard - Job Posts | JoFi"
      headerTitle="Job Posts"
    >
      {/* Dialogs */}
      <Modal slug={addJobPostModalSlug} className="modal-box max-w-7xl px-10">
        <div className="modal-header">
          <h3 className="font-bold text-lg">Add New Job Post</h3>
        </div>

        {isModalOpen(addJobPostModalSlug) && (
          <FormAddJobPost
            formId="form-add-job-post"
            onSuccess={(data) => {
              // console.log(`${data.title} job post created.`)
              page === 1 ? getJobPosts() : setPage(1)
            }}
          />
        )}

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              toggleModal(addJobPostModalSlug)
            }}
          >
            Cancel
          </button>
          <button
            form="form-add-job-post"
            type="submit"
            className="btn btn-sm btn-primary"
          >
            Submit
          </button>
        </div>
      </Modal>

      <Modal slug={editJobPostModalSlug} className="modal-box max-w-7xl px-10">
        <div className="modal-header">
          <h3 className="font-bold text-lg">Edit Job Post</h3>
        </div>

        {jobPostToEdit && (
          <FormEditJobPost
            existingData={jobPostToEdit!}
            formId="form-edit-job-post"
            onSuccess={(data) => {
              toggleModal(editJobPostModalSlug)
              page === 1 ? getJobPosts() : setPage(1)
              setJobPostToEdit(undefined)
            }}
          />
        )}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              toggleModal(editJobPostModalSlug)
              setJobPostToEdit(undefined)
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="form-edit-job-post"
            className="btn btn-sm btn-primary"
          >
            Submit
          </button>
        </div>
      </Modal>

      <div>
        {/* <JsonView data={jobPosts} style={defaultStyles} />
        {JSON.stringify(pagination)}
        {`count is ${count}`} */}

        <Alert.Alert dismissable />

        <div className="toolbar flex flex-col gap-6 mt-6">
          <div className="toolbar__line-2 flex items-center gap-4">
            <form
              id="employer-job-search"
              className="flex gap-2 flex-grow"
              onSubmit={(e) => {
                e.preventDefault()
                getJobPosts()
              }}
            >
              <input
                type="text"
                className="input input-bordered input-sm flex-grow"
                placeholder="Search job title..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className="btn btn-accent btn-sm">
                <Icon icon="heroicons:magnifying-glass-20-solid" />
              </button>
            </form>
          </div>
          <div className="toolbar__line-1 flex items-center gap-4">
            <select
              className="select select-bordered select-sm"
              onChange={(e) => setSortBy(e.currentTarget.value)}
              value={sortBy}
            >
              <option disabled value="">
                Sort by
              </option>
              <option value="highestSalary">Highest salary</option>
              <option value="mostApplied">Most applied</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <div className="flex items-center gap-2 flex-grow">
              <select
                className="select select-bordered select-sm"
                value={dataPerPage}
                onChange={(e) =>
                  setDataPerPage(parseInt(e.currentTarget.value))
                }
              >
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <div className="text-xs">Per page</div>
            </div>

            <button
              className="btn btn-accent btn-sm"
              onClick={() => {
                toggleModal(addJobPostModalSlug)
              }}
            >
              <Icon icon="mdi:plus" width="20" height="20" />
              Post a job
            </button>
          </div>
        </div>

        <div className="mt-5 max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-2 md:gap-4">
          {!loading
            ? jobPosts.map((jobPost, i) => (
                <EmployerJobCard
                  info={{
                    jobPostId: jobPost.id,
                    title: jobPost.title,
                    applicantCount: jobPost._count.applications,
                    location: jobPost.location,
                    postedAt: `Posted at ${dayjs(jobPost.createdAt).format(
                      'DD MMM YYYY HH:mm:ss'
                    )}`,
                    salary:
                      parseInt(jobPost.salary) < 1
                        ? 'Confidential'
                        : convertRupiah(parseInt(jobPost.salary), {
                            floatingPoint: 0,
                          }),
                  }}
                  onEditBtnClick={() => {
                    setJobPostToEdit(jobPost)
                    toggleModal(editJobPostModalSlug)
                  }}
                  onDeleteBtnClick={(id) => deleteJobPost(id)}
                  key={i}
                />
              ))
            : Array.from({ length: 10 }, (v, i) => (
                <div className="skeleton w-full h-[277px]" key={i}></div>
              ))}
        </div>

        {!loading && !jobPosts.length && (
          <div className="min-h-96 text-center text-sm w-full grid place-items-center">
            Empty
          </div>
        )}

        <div className="pagination w-full mt-10 flex justify-end">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={!pagination.hasPreviousPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DataManagementLayout>
  )
}

export default EmployerDashboardJobPosts
