import { IListHttpClient, ISPListItem } from '../../types';
import * as faker from 'faker';


export default class MockHttpClient implements IListHttpClient {

    private static _items: ISPListItem[] = [
        { Title: 'Mock item 1', Id: 1, Code: 1, Description: 'description 1' },
        { Title: 'Mock item 2', Id: 2, Code: 2, Description: 'description 2' },
        { Title: 'Mock item 3', Id: 3, Code: 3, Description: 'description 3' },
        { Title: 'Mock item 4', Id: 4, Code: 4, Description: 'description 4' },
        // { Title: 'Mock item 5', Id: 5, Code: 5, Description: 'description 5' },
        // { Title: 'Mock item 6', Id: 6, Code: 6, Description: 'description 6' },
    ];

    public async getItems() {
        // создаем копию
        return Promise.resolve(MockHttpClient._items.concat());
    }


    public async addItem(newItem: ISPListItem){
        MockHttpClient._validateItem(newItem);

        const newId = faker.random.number({min: 999, max: 999999});

        newItem.Id = newId;
        MockHttpClient._items = MockHttpClient._items
            .concat([newItem]);

        return newId;
    }


    public async removeItem(itemId){
        MockHttpClient._items = MockHttpClient._items
            .filter(item => item.Id !== itemId);
    }


    public async changeItem(changedItem: ISPListItem){
        MockHttpClient._validateItem(changedItem);

        MockHttpClient._items = MockHttpClient._items
            .filter(item => item.Id !== changedItem.Id)
            .concat([changedItem]);
    }


    private static _validateItem(item: ISPListItem){
        if (item.Title.trim().length === 0){
            throw new Error(`Invalid value '${item.Title}' of property 'Title'`);
        }
        if (item.Code <= 0){
            throw new Error(`Invalid value '${item.Code}' of property 'Code'`);
        }
        if (item.Description.trim().length === 0){
            throw new Error(`Invalid value '${item.Description}' of property 'Description'`);
        }
    }
}