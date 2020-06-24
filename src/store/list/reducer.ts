import * as listActions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ListState } from './types';
import { ISPListItem } from '../../types';


const defaultState: ListState = {
  items: [],
  waitFetch: false,
  errorFetchMessage: '',
  waitRemove: false,
  errorRemoveMessage: '',
  itemEditorIsOpen: false,
  itemForEditor: undefined,
  waitSave: false,
  errorSaveMessage: '',
};


export default (state = defaultState, action: ActionType<typeof listActions>): ListState => {
  switch (action.type) {

    // GET
    
    case getType(listActions.updateItemsAsync.request):
      return {
        ...state,
        errorFetchMessage: '',
        waitFetch: true,
      };

    case getType(listActions.updateItemsAsync.success):
      return {
        ...state,
        items: action.payload,
        waitFetch: false,
      };

    case getType(listActions.updateItemsAsync.failure):
      return {
        ...state,
        errorFetchMessage: action.payload.message,
        waitFetch: false,
      };

    // REMOVE

    case getType(listActions.removeItemAsync.request):
      return {
        ...state,
        errorRemoveMessage: '',
        waitRemove: true,
      };

    case getType(listActions.removeItemAsync.success):
      const newItems = state.items
        .filter(item => item.Id !== action.payload);

      return {
        ...state,
        items: newItems,
        waitRemove: false,
      };

    case getType(listActions.removeItemAsync.failure):
      return {
        ...state,
        errorRemoveMessage: action.payload.message,
        waitRemove: false,
      };

    // SAVE

    case getType(listActions.saveItemAsync.request):
      return {
        ...state,
        errorSaveMessage: '',
        waitSave: true,
      };

    case getType(listActions.saveItemAsync.success):
      const savedItem = action.payload;
      const prevItemsArray = state.items;
      const prevItemState = prevItemsArray.filter(item => item.Id === savedItem.Id)[0];
      const isNewItem = prevItemState === undefined;

      let newItemsArray: ISPListItem[];
      if (isNewItem) {
        newItemsArray = prevItemsArray.concat([savedItem]);
      }
      else {
        // TS ругается на find/findIndex 
        const itemIndex = prevItemsArray.indexOf(prevItemState);
        newItemsArray = prevItemsArray.concat();
        newItemsArray.splice(itemIndex, 1, savedItem);
      }

      return {
        ...state,
        items: newItemsArray,
        waitSave: false,
        itemEditorIsOpen: false,
        itemForEditor: undefined,
      };

    case getType(listActions.saveItemAsync.failure):
      return {
        ...state,
        errorSaveMessage: action.payload.message,
        waitSave: false,
      };

    // UI

    case getType(listActions.setItemForEditor):
      return {
        ...state,
        itemForEditor: action.payload.item
      };

    case getType(listActions.toggleItemEditor):
      return {
        ...state,
        itemEditorIsOpen: action.payload.itemEditorIsOpen
      };

    default:
      return state;
  }
};

