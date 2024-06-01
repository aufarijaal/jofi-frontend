import DataManagementLayout from '@/components/data-management-layout'
import FormAddJobPost from '@/components/forms/form-add-job-post'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const TrixEditor = dynamic(
  () => import('@/components/trix-editor/TrixEditor'),
  {
    ssr: false,
  }
)

function CreateJobPostPage() {
  const pathname = usePathname()
  const [desc, setDesc] = useState('dasdsadasda')

  return (
    <DataManagementLayout
      noExpander
      title="Employer Dashboard - Job Posts Create | JoFi"
      headerTitle="Job Posts Create"
    >
      <div className="max-w-4xl mx-auto">
        {/* <FormAddJobPost formId="form-add-job-post" /> */}
        {desc}
        <TrixEditor
          onChange={(html: any, content: any) => setDesc(html)}
          value={desc}
        />

        <div
          className="job-description-paragraph trix-content"
          dangerouslySetInnerHTML={{ __html: desc }}
        ></div>
      </div>
    </DataManagementLayout>
  )
}

export default CreateJobPostPage
