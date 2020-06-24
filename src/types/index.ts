export interface IListHttpClient {
  getItems: () => Promise<ISPListItem[]>;
  addItem: (newItem: ISPListItem) => Promise<number>;
  removeItem: (itemId: number) => Promise<void>;
  changeItem: (newItem: ISPListItem) => Promise<void>;
}


export interface ISPListItem {
  Id: number;
  Title: string;
  Code: number;
  Description: string;  
}


export interface IListViewProps {
  description: string;  
  listTitle: string;
}
