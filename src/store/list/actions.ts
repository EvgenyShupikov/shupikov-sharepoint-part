import { createAction, createAsyncAction } from 'typesafe-actions';
import { ISPListItem } from '../../types';


/* GET */

export const updateItemsAsync = createAsyncAction(
    'items/FETCH_REQUEST',
    'items/FETCH_SUCCESS',
    'items/FETCH_FAILURE'
)<boolean, ISPListItem[], Error>();


export const updateItems = createAction('items/UPDATE_ITEMS', resolve => () => resolve());


/* REMOVE */

export const removeItemAsync = createAsyncAction(
    'items/REMOVE_ITEM_REQUEST',
    'items/REMOVE_ITEM_SUCCESS',
    'items/REMOVE_ITEM_FAILURE'
)<boolean, number, Error>();


export const removeItem = createAction('items/REMOVE_ITEM', resolve => (itemId: number) => resolve({ itemId }));


/* SAVE */

export const saveItemAsync = createAsyncAction(
    'items/SAVE_ITEM_REQUEST',
    'items/SAVE_ITEM_SUCCESS',
    'items/SAVE_ITEM_FAILURE'
)<boolean, ISPListItem, Error>();


export const saveItem = createAction('items/SAVE_ITEM', resolve => (item: ISPListItem) => resolve({ item }));


/* UI */

export const toggleItemEditor = createAction('ui/TOGGLE_ITEM_EDITOR', resolve => (itemEditorIsOpen: boolean) => resolve({ itemEditorIsOpen }));
export const setItemForEditor = createAction('ui/SET_ITEM_FOR_EDITOR', resolve => (item?: ISPListItem) => resolve({ item }));