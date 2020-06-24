import { ListState } from './types';


export function getAllItems(state: ListState) {
  return state.items;
}

export function getErrorFetchMessage(state: ListState) {
  return state.errorFetchMessage;
}

export function getWaitFetch(state: ListState) {
  return state.waitFetch;
}

export function getErrorRemoveMessage(state: ListState) {
  return state.errorRemoveMessage;
}

export function getWaitRemove(state: ListState) {
  return state.waitRemove;
}

export function getAnyListError(state: ListState) {
  return state.errorFetchMessage || state.errorRemoveMessage;
}

export function getWaitSave(state: ListState) {
  return state.waitSave;
}

export function getErrorSaveMessage(state: ListState) {
  return state.errorSaveMessage;
}

export function getItemEditorIsOpen(state: ListState) {
  return state.itemEditorIsOpen;
}

export function getItemForEditor(state: ListState) {
  return state.itemForEditor;
}
