import { IListHttpClient } from '../../types';
import * as listActions from './actions';
import { ListState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';
import { getCopyObject } from '../../utils/immutable';


let _listClient: IListHttpClient;

export function initMiddleware(listClient: IListHttpClient) {
    if (_listClient === undefined) {
        _listClient = listClient;
    }
}


export const listMiddleware: Middleware<{}, ListState> = ({ getState }) => next => async (action: ActionType<typeof listActions>) => {
    next(action);

    // GET
    if (action.type === getType(listActions.updateItems)) {
        next(listActions.updateItemsAsync.request(true));
        try {
            const items = await _listClient.getItems();
            next(listActions.updateItemsAsync.success(items));
        }
        catch (e) {
            next(listActions.updateItemsAsync.failure(e));
        }

        return;
    }

    // REMOVE
    if (action.type === getType(listActions.removeItem)) {
        next(listActions.removeItemAsync.request(true));
        try {
            await _listClient.removeItem(action.payload.itemId);
            next(listActions.removeItemAsync.success(action.payload.itemId));
        }
        catch (e) {
            next(listActions.removeItemAsync.failure(e));
        }

        return;
    }


    // SAVE
    if (action.type === getType(listActions.saveItem)) {
        next(listActions.saveItemAsync.request(true));
        try {
            const item = getCopyObject(action.payload.item);
            if (item.Id > 0) {
                await _listClient.changeItem(item);
            }
            else {
                item.Id = await _listClient.addItem(item);
            }

            next(listActions.saveItemAsync.success(item));
        }
        catch (e) {
            next(listActions.saveItemAsync.failure(e));
        }

        return;
    }
};
