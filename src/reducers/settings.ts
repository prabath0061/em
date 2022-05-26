import _ from 'lodash'
import { EM_TOKEN } from '../constants'
import { appendToPath, isFunction } from '../util'
import { editThought } from '../reducers'
import { contextToThoughtId, getChildrenRanked, contextToPath } from '../selectors'
import { SimplePath, State } from '../@types'

/** Sets a setting thought. */
const settings = (state: State, { key, value }: { key: string; value: string }) => {
  const newValue = value.toString()
  const context = [EM_TOKEN, 'Settings', key]
  const id = contextToThoughtId(state, context)

  const oldThoughtRanked = id ? getChildrenRanked(state, id).find(child => !isFunction(child.value)) : null

  if (!oldThoughtRanked) {
    console.warn('Missing oldThoughtRanked in Settings update:', key, value)
    return state
  }

  const simplePath = appendToPath(contextToPath(state, context) as SimplePath, oldThoughtRanked.id)

  return editThought(state, {
    context,
    oldValue: oldThoughtRanked.value,
    newValue,
    path: simplePath,
  })
}

export default _.curryRight(settings)
