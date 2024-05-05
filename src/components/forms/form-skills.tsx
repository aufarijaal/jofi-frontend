import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Popover } from 'react-tiny-popover'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'
import axios from '@/lib/axios'
import { JsonView } from 'react-json-view-lite'
import { Skill } from '@/types'

interface UserSkill {
  id: number
  userId: number
  skill: Skill
}

const FormSkills: React.FC<{
  existing: UserSkill[]
  onSuccess?: () => void
  editMode?: boolean
}> = ({ existing, onSuccess, editMode }) => {
  const [userSkills, setUserSkills] = useState(existing)
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebounce(value, 500)
  const btnAddRef = useRef<HTMLButtonElement>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [skillSearchResult, setSkillSearchResult] = useState<Skill[]>(() => [])

  async function addItem(item: Skill) {
    try {
      const result = await axios.post(`/user-skills`, item)

      // fill with the updated data
      setUserSkills(result.data.data)
      setValue("")
      setSkillSearchResult([])
    } catch (error) {
      console.error(error)
    }
  }

  async function removeItem(userSkillId: number) {
    try {
      const result = await axios.delete(`/user-skills/${userSkillId}`)

      // fill with the updated data
      setUserSkills(result.data.data)
      setValue("")
      setSkillSearchResult([])
    } catch (error) {
      console.error(error)
    }
  }

  async function getSkill() {
    try {
      if (debouncedValue) {
        const result = await axios.get<{ data: Skill[] }>(`/skills/search`, {
          params: {
            q: debouncedValue,
            excludedId: userSkills.map((userSkill) => userSkill.skill.id),
          },
        })

        setSkillSearchResult(result.data.data)
      }
    } catch (error) {
      console.error(error)

      setSkillSearchResult(() => [])
    }
  }

  useEffect(() => {
    getSkill()
  }, [debouncedValue])

  return (
    <div>
      {/* <JsonView data={userSkills} /> */}
      <div className="flex gap-2 flex-wrap max-w-md">
        {userSkills.map((userSkill, i: number) => (
          <div className="flex items-center">
            <div
              className="badge badge-secondary badge-outline badge-lg text-sm"
              key={i}
            >
              {userSkill.skill.name}
            </div>
            {editMode ? (
              <>
                <div className="w-2 flex items-center">
                  <div className="h-px w-full bg-secondary"></div>
                </div>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => removeItem(userSkill.id)}
                >
                  <Icon icon="mdi:close" />
                </button>
              </>
            ) : null}
          </div>
        ))}

        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom']} // preferred positions by priority
          onClickOutside={() => setIsPopoverOpen(false)}
          transform={{
            top: 10,
          }}
          transformMode="relative"
          content={
            <div className="bg-base-100 shadow-xl p-4 border border-[var(--fallback-bc,oklch(var(--bc)/0.2))]">
              <form className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search a skill"
                  className="input input-bordered input-sm w-full max-w-xs"
                  value={value}
                  onInput={(e) => setValue(e.currentTarget.value)}
                />

                <div className="divider my-0"></div>

                <div className="skill-search-result flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-2">
                  {debouncedValue.trim().length > 0 &&
                  skillSearchResult?.every((skill) =>
                    skill.name
                      ? !skill.name
                          .toLowerCase()
                          .includes(debouncedValue.trim().toLowerCase())
                      : false
                  ) &&
                  userSkills?.every((userSkill) =>
                    userSkill.skill.name
                      ? !userSkill.skill.name
                          .toLowerCase()
                          .includes(debouncedValue.trim().toLowerCase())
                      : false
                  ) ? (
                    <button
                      className="skill-search-result__item"
                      key={0}
                      onClick={() => {
                        addItem({
                          id: 0,
                          name: debouncedValue,
                          slug: ""
                        })
                      }}
                      type="button"
                    >
                      {debouncedValue}
                      <sup className="text-accent text-[8px]">NEW</sup>
                    </button>
                  ) : null}
                  {skillSearchResult && skillSearchResult.length > 0 ? (
                    skillSearchResult.map((skill) => (
                      <button
                        className="skill-search-result__item"
                        key={skill.id}
                        title={skill.slug}
                        onClick={() => {
                          addItem({ ...skill })
                        }}
                        type="button"
                      >
                        {skill.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-center">No skill</div>
                  )}
                </div>
              </form>
            </div>
          }
        >
          <button
            ref={btnAddRef}
            className={cn([
              'btn btn-xs btn-accent ml-2',
              editMode ? 'block' : 'hidden',
            ])}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <Icon icon="mdi:plus" width="20" height="20" />
          </button>
        </Popover>
      </div>
    </div>
  )
}

export default FormSkills
