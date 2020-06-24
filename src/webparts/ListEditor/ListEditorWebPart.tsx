import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'ListEditorWebPartStrings';
import ListEditor from './components/ListEditor';
import ListHttpClient from '../../ListClient/ListHttpClient';
import { Provider } from 'react-redux';
import store, { initStore } from '../../store';

export interface IListEditorWebPartProps {
  description: string;
}

export default class ListEditorWebPart extends BaseClientSideWebPart<IListEditorWebPartProps> {

  private readonly listTitle = 'Список';

  public render(): void {   
    const element = (
      <Provider store={store}>
        <ListEditor
          description={this.properties.description}
          listTitle={this.listTitle} />
      </Provider>
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onInit() {
    return super.onInit()
      .then(_ => {
        initStore(new ListHttpClient(this.context, this.listTitle));
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
