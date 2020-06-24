import { IListHttpClient, ISPListItem } from '../types';
import MockHttpClient from './clients/MockHttpClient';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import SPListHttpClient from './clients/SPListHttpClient';


export default class ListHttpClient implements IListHttpClient {

  private _listClient: IListHttpClient;


  constructor(webPartContext: WebPartContext, listTitle: string) {
    if (Environment.type === EnvironmentType.Local) {
      this._listClient = new MockHttpClient();
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {
      this._listClient = new SPListHttpClient(webPartContext, listTitle);
    }
    else {
      throw new Error(`Unsupported environment ${Environment.type}`);
    }
  }


  public async getItems() {
    return this._listClient.getItems();
  }


  public async addItem(newItem: ISPListItem) {
    return await this._listClient.addItem(newItem);
  }


  public async removeItem(itemId) {
    return await this._listClient.removeItem(itemId);
  }


  public async changeItem(newItem: ISPListItem) {
    return await this._listClient.changeItem(newItem);
  }
}