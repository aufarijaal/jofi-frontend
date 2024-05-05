import React from 'react'

function JobSearchToolbar() {
  return (
    <div id="job-search-toolbar">
      <form className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search job"
            className="input input-bordered input-sm w-full"
          />
          <button className="btn btn-sm btn-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select className="select w-full max-w-[120px] select-sm select-bordered">
            <option disabled selected>
              Sort by
            </option>
            <option>Most relevant</option>
            <option>Highest salary</option>
            <option>Recently posted</option>
          </select>

          <select className="select w-full max-w-[140px] select-sm select-bordered">
            <option disabled selected>
              Category
            </option>
            <option>Maggie</option>
          </select>
        </div>
      </form>
    </div>
  )
}

export default JobSearchToolbar
