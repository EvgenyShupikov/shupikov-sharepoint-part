import { ISPListItem } from "../../types";


export interface ListState {
  waitFetch: boolean;
  errorFetchMessage: string;
  items: ISPListItem[];
  waitRemove: boolean;
  errorRemoveMessage: string;  
  itemEditorIsOpen: boolean;
  itemForEditor: ISPListItem | undefined;
  waitSave: boolean;
  errorSaveMessage: string;
}
