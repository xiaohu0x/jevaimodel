import { useState, useSyncExternalStore, type SetStateAction } from 'react'
import { emptyDraft, readDraft, saveDraft, type PlaygroundDraft } from './draft'
import type { Question, RunRecord } from './engine'

function createDraftStore() {
  const initial = { ...emptyDraft(), ready: false, storageError: false }
  let snapshot = initial
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())
  const write = (draft: PlaygroundDraft) => {
    let saved = false
    try { saved = saveDraft(sessionStorage, draft) } catch { /* Browser storage can be disabled. */ }
    snapshot = { ...draft, ready: true, storageError: !saved }
    notify()
    return saved
  }
  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      if (!snapshot.ready) {
        try {
          snapshot = { ...(readDraft(sessionStorage) ?? emptyDraft()), ready: true, storageError: false }
        } catch { snapshot = { ...emptyDraft(), ready: true, storageError: true } }
        notify()
      }
      return () => { listeners.delete(listener) }
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    setState(state: string) { write({ ...snapshot, state }) },
    setQuestions(value: SetStateAction<Question[]>) {
      write({ ...snapshot, questions: typeof value === 'function' ? value(snapshot.questions) : value })
    },
    setRuns(runs: RunRecord[]) { write({ ...snapshot, runs: runs.slice(-1) }) },
    persist() { return write(snapshot) },
  }
}

export function useDraft() {
  const [store] = useState(createDraftStore)
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  return { ...snapshot, setState: store.setState, setQuestions: store.setQuestions, setRuns: store.setRuns, persist: store.persist }
}
