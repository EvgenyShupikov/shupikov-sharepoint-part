import { IListHttpClient, ISPListItem } from '../../types';
import { sp, ItemAddResult } from "@pnp/sp";
import { WebPartContext } from '@microsoft/sp-webpart-base';


type ListFieldInfo = {
    Title: string,
    EntityPropertyName: string,
};


const convertItemToISPListItem = (item: any, propertyCode: string, propertyDescription: string) => {
    const listItem: ISPListItem = {
        Id: item.Id,
        Title: item.Title,
        Code: item[propertyCode],
        Description: item[propertyDescription],
    };

    return listItem;
};


export default class SPListHttpClient implements IListHttpClient {

    private _listTitle: string;
    private _entityPropertyNameCode: string;
    private _entityPropertyNameDescription: string;


    /**
     * Конструктор
     * @param webPartContext Контекст вебчасти
     * @param listTitle Имя списка
     */
    public constructor(webPartContext: WebPartContext, listTitle: string) {
        this._listTitle = listTitle;
        sp.setup({ spfxContext: webPartContext });
    }


    /**
     * Загружает информацию полях
     */
    private async _loadMetaData() {
        const fieldsInfo = await sp.web.lists
            .getByTitle(this._listTitle)
            .fields
            .select('Title, EntityPropertyName')
            .filter(`Hidden eq false`)
            .get<ListFieldInfo[]>();

        const fieldNameCode = 'Код';
        const fieldInfoCode = fieldsInfo.filter(f => f.Title === fieldNameCode)[0];
        if (fieldInfoCode === undefined) {
            throw new Error(`Field '${fieldNameCode}' not found`);
        }
        this._entityPropertyNameCode = fieldInfoCode.EntityPropertyName;

        const fieldNameDesc = 'Описание';
        const fieldInfoDesc = fieldsInfo.filter(f => f.Title === fieldNameDesc)[0];
        if (fieldInfoDesc === undefined) {
            throw new Error(`Field '${fieldNameDesc}' not found`);
        }
        this._entityPropertyNameDescription = fieldInfoDesc.EntityPropertyName;
    }


    /**
     * Загружает все элементы списка
     */
    public async getItems() {
        await this._loadMetaData();

        return sp.web.lists
            .getByTitle(this._listTitle)
            .items
            .get<any[]>()
            .then(items => {
                const itemsInfo = items
                    .map(item => convertItemToISPListItem(item, this._entityPropertyNameCode, this._entityPropertyNameDescription));
                console.log('items', items, itemsInfo);
                return itemsInfo;
            });
    }


    /**
     * Добавляет элемент в список
     * @param newItem новый элемент
     * @returns ID нового элемента
     */
    public async addItem(newItem: ISPListItem) {
        const itemForSave = {
            Id: newItem.Id,
            Title: newItem.Title
        };
        itemForSave[this._entityPropertyNameCode] = newItem.Code;
        itemForSave[this._entityPropertyNameDescription] = newItem.Description;

        return sp.web.lists
            .getByTitle(this._listTitle)
            .items
            .add(itemForSave)
            .then((result: ItemAddResult) => {
                console.log(result);
                const savedItem = convertItemToISPListItem(result.data, this._entityPropertyNameCode, this._entityPropertyNameDescription);
                return savedItem.Id;
            });
    }


    /**
     * Удаляет элемент из списка
     * @param itemId ID удаляемого элемента
     */
    public async removeItem(itemId) {
        return sp.web.lists
            .getByTitle(this._listTitle)
            .items
            .getById(itemId)
            .delete();
    }


    /**
     * Редактирует элемент списка
     * @param newItem новое состяение элемента
     */
    public async changeItem(newItem: ISPListItem) {
        const itemForSave = {
            Id: newItem.Id,
            Title: newItem.Title
        };
        itemForSave[this._entityPropertyNameCode] = newItem.Code;
        itemForSave[this._entityPropertyNameDescription] = newItem.Description;

        return sp.web.lists
            .getByTitle(this._listTitle)
            .items
            .getById(newItem.Id)
            .update(itemForSave)
            .then((result: ItemAddResult) => {
                console.log(result);
            });
    }
}